import { useLocation, useNavigate } from 'react-router-dom'
import ResultCard from '../components/ResultCard'
import type { ResultPageState } from '../types'

function isResultPageState(value: unknown): value is ResultPageState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ResultPageState>
  return Boolean(candidate.levelId && candidate.result)
}

function ResultPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

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
