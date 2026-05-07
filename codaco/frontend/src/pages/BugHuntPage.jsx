import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BUG_HUNT_CHALLENGES, normalizeCode } from '../data/bugHuntChallenges'

const INDENT = '    '

function BugHuntPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [code, setCode] = useState(BUG_HUNT_CHALLENGES[0].buggyCode)
  const [result, setResult] = useState(null)

  const challenge = useMemo(() => BUG_HUNT_CHALLENGES[currentIndex], [currentIndex])

  const handleSubmit = (event) => {
    event.preventDefault()
    const solved = normalizeCode(code) === normalizeCode(challenge.fixedCode)
    setResult(solved ? 'correct' : 'wrong')
  }

  const nextChallenge = () => {
    const nextIndex = (currentIndex + 1) % BUG_HUNT_CHALLENGES.length
    setCurrentIndex(nextIndex)
    setCode(BUG_HUNT_CHALLENGES[nextIndex].buggyCode)
    setResult(null)
  }

  const retryCurrentChallenge = () => {
    setCode(challenge.buggyCode)
    setResult(null)
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
        setCode(nextValue)
        requestAnimationFrame(() => {
          currentTarget.selectionStart = start
          currentTarget.selectionEnd = start + nextSelected.length
        })
        return
      }

      if (shiftKey) return
      const nextValue = `${before}${INDENT}${after}`
      setCode(nextValue)
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
    setCode(nextValue)
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
        <h2 className="mt-2 font-display text-2xl font-bold tracking-[0.12em] text-[var(--text)]">CACA AO BUG</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Encontre o erro, corrija no editor e envie. Aqui a missao e depurar codigo sob pressao.
        </p>
      </div>

      <div className="terminal-panel px-6 py-6">
        <p className="ascii-muted text-xs tracking-[0.16em]">{`> desafio: ${challenge.id}`}</p>
        <h3 className="mt-2 font-display text-lg font-bold tracking-[0.08em] text-[var(--text)]">{challenge.title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{challenge.prompt}</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="ascii-muted block text-xs tracking-[0.14em]">{'> edite o codigo abaixo:'}</label>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={handleEditorKeyDown}
            spellCheck={false}
            className="min-h-[240px] w-full resize-y border border-[var(--line)] bg-[#0a0a0a] p-4 font-mono text-sm leading-relaxed text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="terminal-panel px-6 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--accent)]"
            >
              SUBMIT
            </button>
            <button
              type="button"
              onClick={nextChallenge}
              className="terminal-panel px-6 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--accent)]"
            >
              PROXIMO BUG
            </button>
            {result === 'wrong' && (
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
            <p className={result === 'correct' ? 'text-[#6cff9a]' : 'text-[#ff6c6c]'}>
              {result === 'correct' ? '> correcao aceita.' : '> ainda nao. revise a logica e tente novamente.'}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  )
}

export default BugHuntPage
