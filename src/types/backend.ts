import type {
  ApiLevel,
  ApiQuestion,
  ApiQuizLevelId,
  BugHuntRunRequest,
  BugHuntRunResponse,
  BugHuntRunStatus,
  BugHuntRunTests,
  LegacyQuestion,
  QuestionsResponse,
  SubmitAnswersRequest,
  SubmitAnswersResponse,
} from '../../shared/contracts';

export type { ApiLevel as Level, ApiQuestion as Question, ApiQuizLevelId, LegacyQuestion, QuestionsResponse, SubmitAnswersRequest, SubmitAnswersResponse, BugHuntRunRequest, BugHuntRunResponse, BugHuntRunStatus };

export interface BugHuntChallenge {
  id: string;
  title: string;
  prompt: string;
  buggyCode: string;
  entryFunction: string;
  testCases: Array<{
    input: unknown[];
    expected: unknown;
  }>;
}

export interface DockerExecutionResult {
  timedOut: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

export interface SandboxExecutionResult extends BugHuntRunResponse {
  durationMs?: number;
}

export interface RunnerResponse {
  status: Extract<BugHuntRunStatus, 'passed' | 'failed' | 'runtime_error'>;
  details?: string;
  tests?: BugHuntRunTests;
}

export interface LegacySubmitAnswerItem {
  pergunta_id: string;
  opcao: string;
}

export interface CurrentSubmitAnswerItem {
  id: string;
  answer: number;
}

export interface ParsedSubmitAnswersRequest extends SubmitAnswersRequest {
  level: string;
  respostas: LegacySubmitAnswerItem[];
  answers: CurrentSubmitAnswerItem[];
}
