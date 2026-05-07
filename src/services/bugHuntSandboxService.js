const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const crypto = require('crypto');

const RUNNER_IMAGE = process.env.BUG_HUNT_RUNNER_IMAGE || 'codado-bughunt-runner:local';
const CODE_MAX_LENGTH = 12000;
const EXEC_TIMEOUT_MS = Number(process.env.BUG_HUNT_EXEC_TIMEOUT_MS || 2000);

function buildRunnerScript(challenge) {
  return `import importlib.util\nimport json\nimport traceback\n\nspec = importlib.util.spec_from_file_location('submission', '/sandbox/submission.py')\nmodule = importlib.util.module_from_spec(spec)\ntry:\n    spec.loader.exec_module(module)\nexcept Exception as e:\n    print(json.dumps({\"status\": \"runtime_error\", \"details\": f\"erro ao carregar submissao: {type(e).__name__}: {e}\"}))\n    raise SystemExit(0)\n\nfunc = getattr(module, ${JSON.stringify(challenge.entryFunction)}, None)\nif not callable(func):\n    print(json.dumps({\"status\": \"runtime_error\", \"details\": \"funcao esperada nao encontrada ou invalida\"}))\n    raise SystemExit(0)\n\ntests = ${JSON.stringify(challenge.testCases)}\npassed = 0\nfor idx, test in enumerate(tests, start=1):\n    args = test.get('input', [])\n    expected = test.get('expected')\n    try:\n        output = func(*args)\n    except Exception as e:\n        print(json.dumps({\"status\": \"runtime_error\", \"details\": f\"erro de runtime no teste {idx}: {type(e).__name__}: {e}\"}))\n        raise SystemExit(0)\n\n    if output == expected:\n        passed += 1\n    else:\n        print(json.dumps({\"status\": \"failed\", \"tests\": {\"passed\": passed, \"total\": len(tests)}, \"details\": f\"falha no teste {idx}: esperado={expected!r} obtido={output!r}\"}))\n        raise SystemExit(0)\n\nprint(json.dumps({\"status\": \"passed\", \"tests\": {\"passed\": len(tests), \"total\": len(tests)}}))\n`;
}

function runDocker(args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({ timedOut: true, stdout, stderr, exitCode: null });
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ timedOut: false, stdout, stderr, exitCode: code });
    });
  });
}

async function runBugHuntInSandbox({ challenge, code }) {
  if (typeof code !== 'string' || code.length === 0) {
    return { status: 'sandbox_error', details: 'codigo vazio' };
  }
  if (code.length > CODE_MAX_LENGTH) {
    return { status: 'sandbox_error', details: `codigo excede limite de ${CODE_MAX_LENGTH} caracteres` };
  }

  const sandboxId = `codado_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const sandboxDir = await fs.mkdtemp(path.join(os.tmpdir(), `${sandboxId}_`));

  try {
    await fs.writeFile(path.join(sandboxDir, 'submission.py'), code, 'utf8');
    await fs.writeFile(path.join(sandboxDir, 'runner.py'), buildRunnerScript(challenge), 'utf8');

    const dockerArgs = [
      'run', '--rm',
      '--network', 'none',
      '--cpus', '0.5',
      '--memory', '128m',
      '--pids-limit', '64',
      '--read-only',
      '--tmpfs', '/tmp:rw,noexec,nosuid,size=16m',
      '--security-opt', 'no-new-privileges',
      '--cap-drop', 'ALL',
      '-v', `${sandboxDir}:/sandbox:ro`,
      RUNNER_IMAGE,
      'python', '/sandbox/runner.py'
    ];

    const startedAt = Date.now();
    const result = await runDocker(dockerArgs, EXEC_TIMEOUT_MS);
    const durationMs = Date.now() - startedAt;

    if (result.timedOut) {
      return { status: 'timeout', details: 'tempo limite excedido', durationMs };
    }

    const raw = result.stdout.trim().split('\n').filter(Boolean).at(-1);
    if (!raw) {
      return { status: 'sandbox_error', details: `runner sem resposta. stderr: ${result.stderr.trim() || 'n/a'}`, durationMs };
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (_err) {
      return { status: 'sandbox_error', details: `resposta invalida do runner: ${raw}`, durationMs };
    }

    if (!['passed', 'failed', 'runtime_error'].includes(parsed.status)) {
      return { status: 'sandbox_error', details: 'status invalido retornado pelo runner', durationMs };
    }

    return {
      status: parsed.status,
      tests: parsed.tests,
      details: parsed.details,
      durationMs
    };
  } catch (err) {
    const message = String(err?.message || err);
    const isDockerMissing = /docker/i.test(message) && /not recognized|ENOENT/i.test(message);
    return {
      status: 'sandbox_error',
      details: isDockerMissing
        ? 'docker nao encontrado. instale/inicie o Docker e gere a imagem do runner.'
        : `falha de sandbox: ${message}`
    };
  } finally {
    await fs.rm(sandboxDir, { recursive: true, force: true }).catch(() => {});
  }
}

module.exports = {
  runBugHuntInSandbox
};
