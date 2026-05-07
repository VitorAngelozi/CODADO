import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
})

export const fetchLevels = async () => {
  const { data } = await api.get('/levels')
  return data.levels ?? []
}

export const fetchQuestions = async (level) => {
  const { data } = await api.get('/questions', { params: { level } })
  return data
}

export const submitAnswers = async (payload) => {
  const { data } = await api.post('/submit', payload)
  return data
}

