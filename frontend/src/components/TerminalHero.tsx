import { motion } from 'framer-motion'

interface TerminalHeroProps {
  onEnterTerminalMode?: () => void
}

function TerminalHero({ onEnterTerminalMode }: TerminalHeroProps) {
  return (
    <section className="terminal-panel scanline px-6 py-10 md:px-10 md:py-14">
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="ascii-muted text-xs tracking-[0.25em]"
      >
        [ SYSTEM READY ]
      </motion.p>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-4 font-display text-5xl font-extrabold tracking-[0.18em] text-[var(--text)] md:text-7xl"
      >
        CODADO
        <span className="cursor-blink" />
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base"
      >
        Desafios interativos de programacao em estilo terminal. Linguagem inicial: Python.
      </motion.p>
      <pre className="ascii-muted mt-6 overflow-x-auto text-[11px] leading-relaxed md:text-xs">
{`+-----------------------------+
|  SELECT DIFFICULTY TO START |
+-----------------------------+`}
      </pre>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onEnterTerminalMode}
          className="terminal-panel px-5 py-3 text-xs font-bold tracking-[0.18em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:bg-[rgba(217,211,200,0.08)]"
        >
          ENTER TERMINAL MODE
        </button>
        <p className="ascii-muted self-center text-xs tracking-[0.14em]">
          {'> iniciar protocolo terminal'}
        </p>
      </div>
    </section>
  )
}

export default TerminalHero
