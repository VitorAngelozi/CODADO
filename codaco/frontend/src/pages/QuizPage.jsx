import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ErrorState from '../components/ErrorState'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'
import TypewriterText from '../components/TypewriterText'
import { getChallengesForLevel } from '../data/challenges'

const levelColors = {
  easy: 'bg-[var(--accent)]',
  medium: 'bg-[var(--accent)]',
  hard: 'bg-[var(--accent)]',
}

function QuizPage() {
  const navigate = useNavigate()
  const { levelId } = useParams()

  const challenges = useMemo(() => getChallengesForLevel(levelId), [levelId])

  const [error, setError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [xp, setXp] = useState(0)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    if (!['easy', 'medium', 'hard'].includes(levelId)) {
      navigate('/', { replace: true })
      return
    }

    // Reset session when changing levels
    setError('')
    setCurrentIndex(0)
    setSelectedIndex(null)
    setFeedback(null)
    setXp(0)
    setCorrect(0)
  }, [levelId, navigate])

  const currentChallenge = challenges[currentIndex]
  const canConfirm = useMemo(() => selectedIndex !== null, [selectedIndex])
  const isShowingFeedback = Boolean(feedback)

  const handleSelect = (idx) => {
    if (isShowingFeedback) return
    setSelectedIndex(idx)
  }

  const confirmAnswer = () => {
    if (!canConfirm || isShowingFeedback) return
    const isCorrect = selectedIndex === currentChallenge.correctIndex
    setFeedback({
      correct: isCorrect,
      explanation: currentChallenge.explanation,
    })
    if (isCorrect) {
      setXp((v) => v + 1)
      setCorrect((v) => v + 1)
    }
  }

  const nextStep = () => {
    const isLast = currentIndex === challenges.length - 1
    if (isLast) {
      navigate('/result', {
        state: {
          levelId,
          result: {
            total: challenges.length,
            correct,
            xp,
          },
        },
      })
      return
    }

    setCurrentIndex((v) => v + 1)
    setSelectedIndex(null)
    setFeedback(null)
  }

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
  if (!currentChallenge) return <ErrorState message="Nenhum desafio encontrado para este nivel." />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto w-full max-w-3xl space-y-5">
      <button
        onClick={() => navigate('/')}
        className="terminal-panel w-fit px-4 py-2 text-xs font-bold tracking-[0.12em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:bg-[rgba(217,211,200,0.08)] hover:shadow-[0_0_0_1px_rgba(217,211,200,0.35)] focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:bg-[rgba(217,211,200,0.1)] focus-visible:shadow-[0_0_0_2px_rgba(217,211,200,0.45)]"
      >
        VOLTAR
      </button>

      <ProgressBar
        current={currentIndex + 1}
        total={challenges.length}
        colorClass={levelColors[levelId]}
      />

      <QuestionCard
        challenge={currentChallenge}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      />

      {feedback && (
        <div className="terminal-panel px-5 py-4 text-sm leading-relaxed">
          <p className="text-[var(--text)]">
            <TypewriterText
              text={feedback.correct ? '> correto.' : '> incorreto.'}
              speed={10}
              showCursor
            />
          </p>
          <p className="ascii-muted mt-1">
            <TypewriterText
              text={feedback.correct ? '> xp +1' : `> explicacao: ${feedback.explanation}`}
              speed={9}
            />
          </p>
        </div>
      )}

      <button
        onClick={isShowingFeedback ? nextStep : confirmAnswer}
        disabled={!isShowingFeedback && !canConfirm}
        className="terminal-panel w-full px-6 py-4 text-sm font-bold tracking-[0.12em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isShowingFeedback ? (currentIndex === challenges.length - 1 ? 'FINALIZAR' : 'PROXIMO') : 'CONFIRMAR'}
      </button>
    </motion.div>
  )
}

export default QuizPage
