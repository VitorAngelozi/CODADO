import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ResultCard from '../components/ResultCard'
import type { QuizLevelId, QuizResult, ResultPageState } from '../types'

interface ResultPageProps {
  onRecordResult?: (levelId: QuizLevelId, result: QuizResult, resultKey: string) => void
}

function isResultPageState(value: unknown): value is ResultPageState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ResultPageState>
  return Boolean(candidate.levelId && candidate.result)
}

function ResultPage({ onRecordResult }: ResultPageProps) {
  const navigate = useNavigate()
  const { state, key } = useLocation()

  useEffect(() => {
    if (!isResultPageState(state)) return
    onRecordResult?.(state.levelId, state.result, key)
  }, [key, onRecordResult, state])

  if (!isResultPageState(state)) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <div className="relative">
      <ResultCard
        result={state.result}
        onRetry={() => navigate(`/quiz/${state.levelId}`)}
        onBack={() => navigate('/')}
      />
    </div>
  )
}

export default ResultPage
