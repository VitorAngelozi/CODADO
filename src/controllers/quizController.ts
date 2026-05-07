import type { Request, Response } from 'express';
import { getLevels, getQuestionsByLevel } from '../data/quizData';
import { getBugChallengeById } from '../data/bugHuntData';
import { runBugHuntInSandbox } from '../services/bugHuntSandboxService';
import type {
  BugHuntRunRequest,
  LegacyQuestion,
  ParsedSubmitAnswersRequest,
  Question,
  QuestionsResponse,
  SubmitAnswersRequest,
  SubmitAnswersResponse,
} from '../types/backend';

function toLegacyQuestion(question: Question): LegacyQuestion {
  return {
    id: question.id,
    enunciar: question.question,
    opcoes: question.options,
    resposta: question.options[question.answer],
  };
}

function parseSubmitRequest(body: SubmitAnswersRequest | undefined): ParsedSubmitAnswersRequest {
  return {
    level: body?.level || 'easy',
    respostas: Array.isArray(body?.respostas) ? body.respostas : [],
    answers: Array.isArray(body?.answers) ? body.answers : [],
  };
}

export function getLevelsController(_req: Request, res: Response): Response {
  return res.status(200).json({ levels: getLevels() });
}

export function getQuestionsController(
  req: Request<unknown, QuestionsResponse, unknown, { level?: string }>,
  res: Response<QuestionsResponse>
): Response {
  const level = req.query.level || 'easy';
  const questions = getQuestionsByLevel(level);

  return res.status(200).json({
    level,
    total: questions.length,
    perguntas: questions.map(toLegacyQuestion),
    questions,
  });
}

export function submitController(
  req: Request<unknown, SubmitAnswersResponse, SubmitAnswersRequest>,
  res: Response<SubmitAnswersResponse>
): Response {
  const { level, respostas, answers } = parseSubmitRequest(req.body);
  const questions = getQuestionsByLevel(level);
  const questionMap = new Map(questions.map((question) => [question.id, question]));

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
    mensagem,
  });
}

export async function runBugHuntController(
  req: Request<unknown, unknown, Partial<BugHuntRunRequest>>,
  res: Response
): Promise<Response> {
  const challengeId = String(req.body?.challengeId || '').trim();
  const code = String(req.body?.code || '');

  if (!challengeId) {
    return res.status(400).json({
      status: 'sandbox_error',
      details: 'challengeId obrigatorio',
    });
  }

  const challenge = getBugChallengeById(challengeId);
  if (!challenge) {
    return res.status(400).json({
      status: 'sandbox_error',
      details: 'desafio nao encontrado',
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
      detail: result.details || null,
    })
  );

  return res.status(200).json({
    status: result.status,
    tests: result.tests,
    details: result.details,
  });
}
