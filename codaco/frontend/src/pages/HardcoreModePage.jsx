import { useEffect, useMemo, useState } from 'react'

const HARDCORE_DURATION = 15

function HardcoreModePage() {
  const [timeLeft, setTimeLeft] = useState(HARDCORE_DURATION)
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [timeLeft])

  const timerClass = useMemo(
    () => (timeLeft <= 5 ? 'hardcore-timer-critical' : 'hardcore-timer'),
    [timeLeft]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className="hardcore-screen hardcore-boot relative min-h-screen overflow-hidden bg-black px-4 py-6 sm:px-6">
      <div className="crt-overlay" aria-hidden="true" />
      <div className="hardcore-flicker" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col justify-center gap-7 border border-[var(--line)] bg-[#050505] px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              data-text="CODADO // HARDCORE MODE"
              className="glitch font-display text-xl font-bold tracking-[0.18em] text-[var(--text)] sm:text-2xl"
            >
              CODADO // HARDCORE MODE
            </h1>
            <p className="ascii-muted mt-3 text-xs tracking-[0.16em] sm:text-sm">&gt; modo: hardcore</p>
            <p className="ascii-muted text-xs tracking-[0.16em] sm:text-sm">&gt; aviso: sem assistencia</p>
          </div>
          <div className={`${timerClass} text-sm font-bold tracking-[0.15em] sm:text-base`}>
            {String(timeLeft).padStart(2, '0')}s
          </div>
        </div>

        <div className="terminal-panel scanline px-5 py-5">
          <p className="ascii-muted text-xs tracking-[0.15em]">&gt; desafio_01</p>
          <pre className="mt-3 overflow-x-auto border border-[var(--line)] bg-[#0a0a0a] px-4 py-4 text-sm leading-relaxed text-[var(--text)]">
{`def two_sum(nums, target):
    return ___`}
          </pre>
        </div>

        <form onSubmit={handleSubmit} className="terminal-panel px-5 py-5">
          <label htmlFor="hardcore-answer" className="ascii-muted block text-xs tracking-[0.14em]">
            &gt; sua resposta:
          </label>
          <div className="mt-3 flex items-center border border-[var(--line)] bg-black px-3 py-3">
            <span className="mr-2 text-[var(--muted)]">&gt;</span>
            <input
              id="hardcore-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent text-sm tracking-[0.03em] text-[var(--text)] outline-none"
              placeholder="digite aqui"
            />
            <span className="cursor-blink" aria-hidden="true" />
          </div>

          <button
            type="submit"
            className="terminal-panel mt-5 px-5 py-3 text-xs font-bold tracking-[0.2em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:bg-[rgba(217,211,200,0.08)] focus-visible:outline-none focus-visible:border-[var(--accent)]"
          >
            [ ENVIAR ]
          </button>
        </form>
      </div>
    </section>
  )
}

export default HardcoreModePage
