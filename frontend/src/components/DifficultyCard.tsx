import { motion } from 'framer-motion'
import type { DifficultyCardLevel } from '../types'

const levelAscii: Record<DifficultyCardLevel['id'], string> = {
  easy: '[ 01 ]',
  medium: '[ 02 ]',
  hard: '[ 03 ]',
  hardcore: '[ 04 ]',
  survival: '[ 05 ]',
  bug_hunt_normal: '[ 06 ]',
  bug_hunt_hard: '[ 07 ]',
  guess_language_easy: '[ 08 ]',
  guess_language_medium: '[ 09 ]',
  guess_language_hard: '[ 10 ]',
}

interface DifficultyCardProps {
  level: DifficultyCardLevel
  onSelect: (id: DifficultyCardLevel['id']) => void
}

function DifficultyCard({ level, onSelect }: DifficultyCardProps) {
  const statusLabel = 'DISPONIVEL'

  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
      onClick={() => onSelect(level.id)}
      className="group terminal-panel relative min-h-[190px] w-full overflow-hidden px-5 py-5 text-left transition duration-300 hover:border-[var(--accent)] hover:bg-[rgba(217,211,200,0.03)] focus:outline-none"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="h-full w-full bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)]" />
      </div>
      <p className="ascii-muted text-xs tracking-[0.2em]">{levelAscii[level.id] ?? '[ -- ]'}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl font-bold uppercase tracking-[0.12em] text-[var(--text)]">
          {level.nome}
        </h3>
        <span className="flex items-center gap-2 text-[11px] tracking-[0.18em]">
          <span className="codado-dot codado-dot-on" aria-hidden="true" />
          <span className="codado-green">{statusLabel}</span>
        </span>
      </div>
      <p className="mt-3 min-h-[48px] text-sm leading-relaxed text-[var(--muted)]">{level.desc}</p>
      <p className="mt-4 text-xs tracking-[0.15em] text-[var(--accent)]">PRESS ENTER -&gt;</p>
    </motion.button>
  )
}

export default DifficultyCard
