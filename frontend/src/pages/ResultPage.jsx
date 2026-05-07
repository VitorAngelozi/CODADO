import { useLocation, useNavigate } from 'react-router-dom'
import ResultCard from '../components/ResultCard'

function ResultPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  if (!state?.result || !state?.levelId) {
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
