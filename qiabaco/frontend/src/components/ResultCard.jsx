import { motion } from 'framer-motion'

function ResultCard({ result, onRetry, onBack }) {
  const total = result?.total ?? 0
  const correct = result?.correct ?? 0
  const xp = result?.xp ?? 0

  let message = '> session complete.'
  const pct = total > 0 ? (correct / total) * 100 : 0
  if (pct === 100) message = '> perfeito. keep shipping.'
  else if (pct >= 80) message = '> excelente. boa leitura de codigo.'
  else if (pct >= 50) message = '> bom. repita para fixar.'
  else message = '> continue. consistencia vence.'

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-panel scanline mx-auto w-full max-w-2xl px-6 py-8 md:px-10"
    >
      <p className="ascii-muted text-xs tracking-[0.22em]">[ REPORT ]</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[0.14em] text-[var(--text)] md:text-4xl">
        RESULT
      </h2>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="terminal-panel px-4 py-4">
          <p className="ascii-muted text-xs tracking-[0.18em]">XP</p>
          <p className="mt-1 text-2xl font-bold tracking-[0.08em] text-[var(--text)]">{xp}</p>
        </div>
        <div className="terminal-panel px-4 py-4">
          <p className="ascii-muted text-xs tracking-[0.18em]">CORRETAS</p>
          <p className="mt-1 text-2xl font-bold tracking-[0.08em] text-[var(--text)]">
            {correct}/{total}
          </p>
        </div>
        <div className="terminal-panel px-4 py-4">
          <p className="ascii-muted text-xs tracking-[0.18em]">ACURACIA</p>
          <p className="mt-1 text-2xl font-bold tracking-[0.08em] text-[var(--text)]">{Math.round(pct)}%</p>
        </div>
      </div>

      <div className="terminal-panel mt-5 px-4 py-4 text-sm leading-relaxed">
        <p className="text-[var(--text)]">{message}</p>
        <p className="ascii-muted mt-1">{'> dica: revise as explicacoes quando errar.'}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onRetry}
          className="terminal-panel px-6 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--accent)]"
        >
          TRY AGAIN
        </button>
        <button
          onClick={onBack}
          className="terminal-panel px-6 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition hover:border-[var(--accent)]"
        >
          BACK
        </button>
      </div>
    </motion.section>
  )
}

export default ResultCard
