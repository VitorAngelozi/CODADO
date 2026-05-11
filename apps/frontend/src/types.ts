import type { ReactNode } from 'react'
import type {
  ApiLevel,
  LegacyQuestion,
  QuestionsResponse,
  SubmitAnswerItem,
  SubmitAnswersRequest,
  SubmitAnswersResponse,
  BugHuntRunResponse,
  BugHuntRunStatus,
} from '../../backend/shared/contracts'

export type QuizLevelId = 'easy' | 'medium' | 'hard' | 'hardcore' | 'survival'
export type GuessLanguageLevelId = 'easy' | 'medium' | 'hard'
export type BugHuntModeId = 'normal' | 'hard'
export type DifficultyCardLevelId =
  | QuizLevelId
  | 'bug_hunt_normal'
  | 'bug_hunt_hard'
  | 'guess_language_easy'
  | 'guess_language_medium'
  | 'guess_language_hard'
export type QuizFeedbackStatus = 'correct' | 'wrong' | 'timeout'
export type TerminalStartModeId =
  | 'logica_facil'
  | 'logica_medio'
  | 'logica_dificil'
  | 'logica_hardcore'
  | 'logica_sobrevivencia'
  | 'linguagem_facil'
  | 'linguagem_medio'
  | 'linguagem_dificil'
  | 'caca-ao-bug'
  | 'caca-ao-bug-hard-mode'
export type TerminalRank =
  | 'INITIATE'
  | 'OPERATOR'
  | 'DEBUGGER'
  | 'EXECUTOR'
  | 'ROOT'
  | 'ARCHITECT'

export interface OperatorSessionSnapshot {
  xp: number
  rank: TerminalRank
  streak: number
  bugsResolved: number
  favoriteModeLabel: string
  activeTrackLabel: string
}

export type Level = ApiLevel

export interface FrontendLevel {
  id: QuizLevelId
  nome: string
  desc: string
}

export interface GuessLanguageLevel {
  id: GuessLanguageLevelId
  nome: string
  desc: string
}

export interface DifficultyCardLevel {
  id: DifficultyCardLevelId
  nome: string
  desc: string
}

export interface Challenge {
  id: string
  prompt: string
  code: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type GuessLanguageChallenge = Challenge

export interface QuizFeedback {
  status: QuizFeedbackStatus
  correct: boolean
  explanation: string
}

export interface QuizResult {
  total: number
  correct: number
  xp: number
}

export interface ResultPageState {
  levelId: QuizLevelId | GuessLanguageLevelId
  retryPath: string
  sessionMode: TerminalStartModeId
  result: QuizResult
}

export interface BugHuntChallenge {
  id: string
  title: string
  prompt: string
  buggyCode: string
}

export interface BugHuntMode {
  id: BugHuntModeId
  title: string
  description: string
  challenges: BugHuntChallenge[]
}

export interface PageFrameProps {
  children: ReactNode
  className?: string
}

export interface SubmitAnswersPayload extends SubmitAnswersRequest {
  level: QuizLevelId
  answers: SubmitAnswerItem[]
}

export type {
  BugHuntRunResponse,
  BugHuntRunStatus,
  LegacyQuestion,
  QuestionsResponse,
  SubmitAnswerItem,
  SubmitAnswersResponse,
}

