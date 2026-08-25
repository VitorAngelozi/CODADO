import axios from 'axios'
import type {
  Level,
  QuestionsResponse,
  QuizLevelId,
  SubmitAnswersPayload,
  SubmitAnswersResponse,
} from '../types'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

export const register = async (name: string, email: string, password: string): Promise<AuthUser> => {
  const { data } = await api.post<AuthUser>('/auth/register', { name, email, password })
  return data
}

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const { data } = await api.post<AuthUser>('/auth/login', { email, password })
  return data
}

export const fetchCurrentUser = async (): Promise<AuthUser> => {
  const { data } = await api.get<AuthUser>('/auth/me')
  return data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

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
