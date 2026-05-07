import axios from 'axios'
import type {
  Level,
  QuestionsResponse,
  QuizLevelId,
  SubmitAnswersPayload,
  SubmitAnswersResponse,
} from '../types'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
})

export const fetchLevels = async (): Promise<Level[]> => {
  const { data } = await api.get<{ levels?: Level[] }>('/levels')
  return data.levels ?? []
}

export const fetchQuestions = async (level: QuizLevelId): Promise<QuestionsResponse> => {
  const { data } = await api.get<QuestionsResponse>('/questions', { params: { level } })
  return data
}

export const submitAnswers = async (
  payload: SubmitAnswersPayload
): Promise<SubmitAnswersResponse> => {
  const { data } = await api.post<SubmitAnswersResponse>('/submit', payload)
  return data
}
