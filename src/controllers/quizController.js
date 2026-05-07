const { getLevels, getQuestionsByLevel } = require('../data/quizData');
const { getBugChallengeById } = require('../data/bugHuntData');
const { runBugHuntInSandbox } = require('../services/bugHuntSandboxService');

function toLegacyQuestion(question) {
  return {
    id: question.id,
    enunciar: question.question,
    opcoes: question.options,
    resposta: question.options[question.answer]
  };
}

function getLevelsController(_req, res) {
  return res.status(200).json({ levels: getLevels() });
}

function getQuestionsController(req, res) {
  const level = req.query.level || 'easy';
  const questions = getQuestionsByLevel(level);

  return res.status(200).json({
    level,
    total: questions.length,
    perguntas: questions.map(toLegacyQuestion),
    questions
  });
}

function submitController(req, res) {
  const { level = 'easy' } = req.body || {};
  const respostas = Array.isArray(req.body?.respostas) ? req.body.respostas : [];
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];

  const questions = getQuestionsByLevel(level);
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  let acertos = 0;

  for (const resposta of respostas) {
    const question = questionMap.get(resposta?.pergunta_id);
    if (!question) {
      continue;
    }

    const selectedValue = String(resposta?.opcao ?? '');
    const correctValue = question.options[question.answer];

    if (selectedValue === correctValue) {
      acertos += 1;
    }
  }

  for (const answer of answers) {
    const question = questionMap.get(answer?.id);
    if (!question) {
      continue;
    }

    if (typeof answer.answer === 'number' && answer.answer === question.answer) {
      acertos += 1;
    }
  }

  const total = questions.length;
  const percentual = total > 0 ? (acertos / total) * 100 : 0;

  let mensagem = 'Continue praticando! Voce consegue!';
  if (acertos === total) {
    mensagem = 'Perfeito! Voce acertou todas!';
  } else if (acertos >= total - 2) {
    mensagem = 'Excelente! Muito bom!';
  } else if (acertos >= total / 2) {
    mensagem = 'Bom trabalho! Continue praticando';
  }

  return res.status(200).json({
    acertos,
    total,
    pontuacao: acertos,
    percentual,
    mensagem
  });
}

async function runBugHuntController(req, res) {
  const challengeId = String(req.body?.challengeId || '').trim();
  const code = String(req.body?.code || '');

  if (!challengeId) {
    return res.status(400).json({
      status: 'sandbox_error',
      details: 'challengeId obrigatorio'
    });
  }

  const challenge = getBugChallengeById(challengeId);
  if (!challenge) {
    return res.status(400).json({
      status: 'sandbox_error',
      details: 'desafio nao encontrado'
    });
  }

  const startedAt = Date.now();
  const result = await runBugHuntInSandbox({ challenge, code });
  const durationMs = result.durationMs ?? Date.now() - startedAt;

  console.log(
    JSON.stringify({
      event: 'bug_hunt_run',
      challengeId,
      status: result.status,
      durationMs,
      detail: result.details || null
    })
  );

  return res.status(200).json({
    status: result.status,
    tests: result.tests,
    details: result.details
  });
}

module.exports = {
  getLevelsController,
  getQuestionsController,
  submitController,
  runBugHuntController
};
