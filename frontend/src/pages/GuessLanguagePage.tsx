import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ErrorState from '../components/ErrorState'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'
import TypewriterText from '../components/TypewriterText'
import { getGuessLanguageChallenges } from '../data/guessLanguageChallenges'
import type {
  GuessLanguageLevelId,
  QuizFeedback,
  ResultPageState,
  TerminalStartModeId,
} from '../types'

const levelColors: Record<GuessLanguageLevelId, string> = {
  easy: 'bg-[var(--accent)]',
  medium: 'bg-[var(--accent)]',
  hard: 'bg-[var(--accent)]',
}

const GUESS_LANGUAGE_SESSION_MODE: Record<GuessLanguageLevelId, TerminalStartModeId> = {
  easy: 'linguagem_facil',
  medium: 'linguagem_medio',
  hard: 'linguagem_dificil',
}

function isGuessLanguageLevelId(levelId?: string): levelId is GuessLanguageLevelId {
  return levelId === 'easy' || levelId === 'medium' || levelId === 'hard'
}

function GuessLanguagePage() {
  const navigate = useNavigate()
  const { levelId } = useParams<{ levelId?: string }>()
  const safeLevelId = isGuessLanguageLevelId(levelId) ? levelId : undefined
  const challenges = useMemo(() => getGuessLanguageChallenges(safeLevelId), [safeLevelId])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answersByIndex, setAnswersByIndex] = useState<Record<number, number | null>>({})
  const [feedbackByIndex, setFeedbackByIndex] = useState<Record<number, QuizFeedback>>({})

  const currentChallenge = challenges[currentIndex]
  const selectedIndex = answersByIndex[currentIndex] ?? null
  const feedback = feedbackByIndex[currentIndex] ?? null
  const canConfirm = selectedIndex !== null
  const isShowingFeedback = Boolean(feedback)
  const correct = useMemo(
    () => Object.values(feedbackByIndex).filter((item) => item.correct).length,
    [feedbackByIndex],
  )
  const xp = correct

  const handleSelect = (idx: number) => {
    if (isShowingFeedback) return
    setAnswersByIndex((previous) => ({
      ...previous,
      [currentIndex]: idx,
    }))
  }

  const confirmAnswer = () => {
    if (!canConfirm || isShowingFeedback || !currentChallenge) return
    const isCorrect = selectedIndex === currentChallenge.correctIndex

    setFeedbackByIndex((previous) => ({
      ...previous,
      [currentIndex]: {
        status: isCorrect ? 'correct' : 'wrong',
        correct: isCorrect,
        explanation: currentChallenge.explanation,
      },
    }))
  }

  const nextStep = () => {
    const isLast = currentIndex === challenges.length - 1
    if (isLast && safeLevelId) {
      const resultState: ResultPageState = {
        levelId: safeLevelId,
        retryPath: `/guess-language/${safeLevelId}`,
        sessionMode: GUESS_LANGUAGE_SESSION_MODE[safeLevelId],
        result: {
          total: challenges.length,
          correct,
          xp,
        },
      }
      navigate('/result', { state: resultState })
      return
    }

    setCurrentIndex((value) => value + 1)
  }

  const previousStep = () => {
    if (currentIndex === 0) return
    setCurrentIndex((value) => value - 1)
  }

  if (!currentChallenge || !safeLevelId) {
    return <ErrorState message="Nenhum desafio encontrado para esta trilha." />
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative mx-auto w-full max-w-3xl space-y-5">
      <button
        onClick={() => navigate('/')}
        className="terminal-panel w-fit px-4 py-2 text-xs font-bold tracking-[0.12em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:bg-[rgba(217,211,200,0.08)] hover:shadow-[0_0_0_1px_rgba(217,211,200,0.35)] focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:bg-[rgba(217,211,200,0.1)] focus-visible:shadow-[0_0_0_2px_rgba(217,211,200,0.45)]"
      >
        VOLTAR
      </button>

      <ProgressBar current={currentIndex + 1} total={challenges.length} colorClass={levelColors[safeLevelId]} />

      <QuestionCard
        challenge={currentChallenge}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        revealCorrectIndex={feedback && !feedback.correct ? currentChallenge.correctIndex : null}
        revealWrongIndex={feedback && feedback.status === 'wrong' ? selectedIndex : null}
      />

      {feedback && (
        <div className="terminal-panel px-5 py-4 text-sm leading-relaxed">
          <p className="text-[var(--text)]">
            <TypewriterText
              text={feedback.correct ? '> linguagem identificada.' : '> identificacao incorreta.'}
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

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={previousStep}
          disabled={currentIndex === 0}
          className="terminal-panel flex-1 px-6 py-4 text-sm font-bold tracking-[0.12em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          VOLTAR QUESTAO
        </button>
        <button
          onClick={isShowingFeedback ? nextStep : confirmAnswer}
          disabled={!isShowingFeedback && !canConfirm}
          className="terminal-panel flex-1 px-6 py-4 text-sm font-bold tracking-[0.12em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isShowingFeedback
            ? currentIndex === challenges.length - 1
              ? 'FINALIZAR'
              : 'PROXIMA QUESTAO'
            : 'CONFIRMAR'}
        </button>
      </div>
    </motion.div>
  )
}

export default GuessLanguagePage
