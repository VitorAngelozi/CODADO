import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { BUG_HUNT_MODES, getBugHuntMode } from '../data/bugHuntChallenges'

const INDENT = '    '
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function BugHuntPage() {
  const navigate = useNavigate()
  const { modeId } = useParams()
  const mode = useMemo(() => getBugHuntMode(modeId), [modeId])
  const challenges = mode.challenges

  const [currentIndex, setCurrentIndex] = useState(0)
  const [codeByIndex, setCodeByIndex] = useState({})
  const [resultByIndex, setResultByIndex] = useState({})
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!BUG_HUNT_MODES[modeId]) {
      navigate('/bug-hunt/normal', { replace: true })
      return
    }

    setCurrentIndex(0)
    setCodeByIndex({})
    setResultByIndex({})
    setIsRunning(false)
  }, [modeId, navigate])

  const challenge = useMemo(() => challenges[currentIndex], [challenges, currentIndex])
  const code = codeByIndex[currentIndex] ?? challenge.buggyCode
  const result = resultByIndex[currentIndex] ?? null

  const setCodeForCurrent = (value) => {
    setCodeByIndex((previous) => ({
      ...previous,
      [currentIndex]: value,
    }))
  }

  const setResultForCurrent = (value) => {
    setResultByIndex((previous) => ({
      ...previous,
      [currentIndex]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isRunning) return

    setIsRunning(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/bug-hunt/run`, {
        challengeId: challenge.id,
        code,
      })
      setResultForCurrent(response.data)
    } catch (err) {
      const details =
        err?.response?.data?.details ||
        err?.message ||
        'falha ao executar validacao'
      setResultForCurrent({ status: 'sandbox_error', details })
    } finally {
      setIsRunning(false)
    }
  }

  const goToChallenge = (nextIndex) => {
    setCurrentIndex(nextIndex)
    setIsRunning(false)
  }

  const nextChallenge = () => {
    if (currentIndex >= challenges.length - 1) return
    goToChallenge(currentIndex + 1)
  }

  const previousChallenge = () => {
    if (currentIndex <= 0) return
    goToChallenge(currentIndex - 1)
  }

  const retryCurrentChallenge = () => {
    setCodeForCurrent(challenge.buggyCode)
    setResultForCurrent(null)
  }

  const handleEditorKeyDown = (event) => {
    const { key, currentTarget, shiftKey } = event
    if (key !== 'Tab' && key !== 'Enter') return

    const start = currentTarget.selectionStart
    const end = currentTarget.selectionEnd
    const before = code.slice(0, start)
    const selected = code.slice(start, end)
    const after = code.slice(end)

    if (key === 'Tab') {
      event.preventDefault()

      if (start !== end && selected.includes('\n')) {
        const lines = selected.split('\n')
        const updated = shiftKey
          ? lines.map((line) => (line.startsWith(INDENT) ? line.slice(INDENT.length) : line))
          : lines.map((line) => `${INDENT}${line}`)
        const nextSelected = updated.join('\n')
        const nextValue = `${before}${nextSelected}${after}`
        setCodeForCurrent(nextValue)
        requestAnimationFrame(() => {
          currentTarget.selectionStart = start
          currentTarget.selectionEnd = start + nextSelected.length
        })
        return
      }

      if (shiftKey) return
      const nextValue = `${before}${INDENT}${after}`
      setCodeForCurrent(nextValue)
      requestAnimationFrame(() => {
        currentTarget.selectionStart = currentTarget.selectionEnd = start + INDENT.length
      })
      return
    }

    event.preventDefault()
    const currentLineStart = before.lastIndexOf('\n') + 1
    const currentLine = before.slice(currentLineStart)
    const baseIndent = (currentLine.match(/^\s*/) || [''])[0]
    const shouldIncrease = /:\s*$/.test(currentLine)
    const nextIndent = `${baseIndent}${shouldIncrease ? INDENT : ''}`
    const insertion = `\n${nextIndent}`
    const nextValue = `${before}${insertion}${after}`
    setCodeForCurrent(nextValue)
    requestAnimationFrame(() => {
      const cursor = start + insertion.length
      currentTarget.selectionStart = currentTarget.selectionEnd = cursor
    })
  }

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto w-full max-w-4xl space-y-5">
      <button
        onClick={() => navigate('/')}
        className="terminal-panel w-fit px-4 py-2 text-xs font-bold tracking-[0.12em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:bg-[rgba(217,211,200,0.08)] hover:shadow-[0_0_0_1px_rgba(217,211,200,0.35)] focus-visible:outline-none focus-visible:border-[var(--accent)]"
      >
        VOLTAR
      </button>

      <div className="terminal-panel scanline px-6 py-6">
        <p className="ascii-muted text-xs tracking-[0.22em]">[ DEBUG TRACK ]</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-[0.12em] text-[var(--text)]">{mode.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{mode.description}</p>
      </div>

      <div className="terminal-panel px-6 py-6">
        <p className="ascii-muted text-xs tracking-[0.16em]">{`> progresso: ${currentIndex + 1}/${challenges.length}`}</p>
        <p className="ascii-muted text-xs tracking-[0.16em]">{`> desafio: ${challenge.id}`}</p>
        <h3 className="mt-2 font-display text-lg font-bold tracking-[0.08em] text-[var(--text)]">{challenge.title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{challenge.prompt}</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="ascii-muted block text-xs tracking-[0.14em]">{'> edite o codigo abaixo:'}</label>
          <textarea
            value={code}
            onChange={(event) => setCodeForCurrent(event.target.value)}
            onKeyDown={handleEditorKeyDown}
            spellCheck={false}
            className="min-h-[240px] w-full resize-y border border-[var(--line)] bg-[#0a0a0a] p-4 font-mono text-sm leading-relaxed text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isRunning}
              className="terminal-panel px-6 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRunning ? 'EXECUTANDO...' : 'SUBMIT'}
            </button>
            <button
              type="button"
              onClick={previousChallenge}
              disabled={currentIndex === 0}
              className="terminal-panel px-6 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              VOLTAR QUESTAO
            </button>
            <button
              type="button"
              onClick={nextChallenge}
              disabled={currentIndex === challenges.length - 1}
              className="terminal-panel px-6 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              PROXIMA QUESTAO
            </button>
            {result?.status && result.status !== 'passed' && (
              <button
                type="button"
                onClick={retryCurrentChallenge}
                className="terminal-panel px-6 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition hover:border-[#ff6c6c]"
              >
                TENTAR NOVAMENTE
              </button>
            )}
          </div>
        </form>

        {result && (
          <div className="terminal-panel mt-5 px-4 py-4 text-sm">
            <p className={result.status === 'passed' ? 'text-[#6cff9a]' : 'text-[#ff6c6c]'}>
              {result.status === 'passed'
                ? '> correcao aceita.'
                : result.status === 'failed'
                  ? '> ainda nao. alguns testes falharam.'
                  : result.status === 'timeout'
                    ? '> timeout: sua solucao excedeu o tempo limite.'
                    : result.status === 'runtime_error'
                      ? '> erro de runtime na execucao.'
                      : '> erro na sandbox. verifique o ambiente local.'}
            </p>
            {result.tests && (
              <p className="ascii-muted mt-1">{`> testes: ${result.tests.passed}/${result.tests.total}`}</p>
            )}
            {result.details && (
              <p className="ascii-muted mt-1">{`> detalhe: ${result.details}`}</p>
            )}
          </div>
        )}
      </div>
    </motion.section>
  )
}

export default BugHuntPage
