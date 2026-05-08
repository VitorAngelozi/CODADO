import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BUILD_LABEL, NODE_LABEL, PROTOCOL_LABEL } from '../lib/buildInfo'

interface TerminalHeroProps {
  onEnterTerminalMode?: () => void
}

function TerminalHero({ onEnterTerminalMode }: TerminalHeroProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const timeLabel = now.toLocaleTimeString('pt-BR', { hour12: false })

  return (
    <section className="terminal-panel scanline codado-hero px-5 py-6 md:px-7 md:py-7">
      <div className="grid items-start gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="ascii-muted text-xs tracking-[0.25em]"
          >
            [ SYSTEM READY ]
          </motion.p>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 font-display text-4xl font-extrabold tracking-[0.18em] text-[var(--text)] md:text-5xl"
          >
            CODADO
            <span className="cursor-blink" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]"
          >
            Desafios interativos de programacao em estilo terminal. Linguagem inicial: Python.
          </motion.p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex w-full flex-col items-start gap-2 md:items-end">
            <button
              type="button"
              onClick={onEnterTerminalMode}
              className="terminal-panel w-full px-5 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:bg-[rgba(217,211,200,0.08)] md:w-auto"
            >
              ENTER TERMINAL MODE
            </button>
            <p className="ascii-muted text-[11px] tracking-[0.16em]">{'> iniciar protocolo terminal'}</p>
          </div>

          <div className="terminal-panel w-full px-4 py-3 text-[11px] tracking-[0.18em] text-[var(--text)] md:max-w-[240px]">
            <p className="m-0">
              <span className="ascii-muted">BUILD:</span> <span className="codado-green">{BUILD_LABEL}</span>
            </p>
            <p className="m-0 mt-1">
              <span className="ascii-muted">NODE:</span> <span className="codado-green">{NODE_LABEL}</span>
            </p>
            <p className="m-0 mt-1">
              <span className="ascii-muted">PROTOCOL:</span> <span className="codado-green">{PROTOCOL_LABEL}</span>
            </p>
            <p className="m-0 mt-1">
              <span className="ascii-muted">TIME:</span> {timeLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TerminalHero
