export type ApiQuizLevelId = 'easy' | 'medium' | 'hard';
export type BugHuntRunStatus =
  | 'passed'
  | 'failed'
  | 'timeout'
  | 'runtime_error'
  | 'sandbox_error';

export interface ApiLevel {
  id: ApiQuizLevelId;
  nome: string;
  desc: string;
}

export interface ApiQuestion {
  id: string;
  question: string;
  code: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface LegacyQuestion {
  id: string;
  enunciar: string;
  opcoes: string[];
  resposta: string;
}

export interface QuestionsResponse {
  level: string;
  total: number;
  perguntas: LegacyQuestion[];
  questions: ApiQuestion[];
}

export interface SubmitAnswerItem {
  id: string;
  answer: number;
}

export interface LegacySubmitAnswerItem {
  pergunta_id: string;
  opcao: string;
}

export interface SubmitAnswersRequest {
  level?: string;
  respostas?: LegacySubmitAnswerItem[];
  answers?: SubmitAnswerItem[];
}

export interface SubmitAnswersResponse {
  acertos: number;
  total: number;
  pontuacao: number;
  percentual: number;
  mensagem: string;
}

export interface BugHuntRunRequest {
  challengeId: string;
  code: string;
}

export interface BugHuntRunTests {
  passed: number;
  total: number;
}

export interface BugHuntRunResponse {
  status: BugHuntRunStatus;
  details?: string;
  tests?: BugHuntRunTests;
}
