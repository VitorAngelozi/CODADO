import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ResultCard from '../components/ResultCard'
import { getTrackRouteFromMode } from '../lib/terminalShared'
import type { QuizResult, ResultPageState, TerminalStartModeId } from '../types'

interface ResultPageProps {
  onRecordResult?: (sessionMode: TerminalStartModeId, result: QuizResult, resultKey: string) => void
}

function isResultPageState(value: unknown): value is ResultPageState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ResultPageState>
  return Boolean(candidate.levelId && candidate.result && candidate.retryPath && candidate.sessionMode)
}

function ResultPage({ onRecordResult }: ResultPageProps) {
  const navigate = useNavigate()
  const { state, key } = useLocation()

  useEffect(() => {
    if (!isResultPageState(state)) return
    onRecordResult?.(state.sessionMode, state.result, key)
  }, [key, onRecordResult, state])

  if (!isResultPageState(state)) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <div className="relative">
      <ResultCard
        result={state.result}
        onRetry={() => navigate(state.retryPath)}
        onBack={() => navigate(getTrackRouteFromMode(state.sessionMode))}
      />
    </div>
  )
}

export default ResultPage
