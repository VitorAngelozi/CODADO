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
} from '../../shared/contracts'

export type QuizLevelId = 'easy' | 'medium' | 'hard' | 'hardcore' | 'survival'
export type BugHuntModeId = 'normal' | 'hard'
export type DifficultyCardLevelId = QuizLevelId | 'bug_hunt_normal' | 'bug_hunt_hard'
export type QuizFeedbackStatus = 'correct' | 'wrong' | 'timeout'

export type Level = ApiLevel

export interface FrontendLevel {
  id: QuizLevelId
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
  levelId: QuizLevelId
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
