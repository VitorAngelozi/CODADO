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
}

interface DifficultyCardProps {
  level: DifficultyCardLevel
  onSelect: (id: DifficultyCardLevel['id']) => void
}

function DifficultyCard({ level, onSelect }: DifficultyCardProps) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
      onClick={() => onSelect(level.id)}
      className="group terminal-panel relative min-h-[220px] w-full overflow-hidden px-5 py-6 text-left transition duration-300 hover:border-[var(--accent)] focus:outline-none"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="h-full w-full bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)]" />
      </div>
      <p className="ascii-muted text-xs tracking-[0.2em]">{levelAscii[level.id] ?? '[ -- ]'}</p>
      <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.12em] text-[var(--text)]">
        {level.nome}
      </h3>
      <p className="mt-3 min-h-[48px] text-sm leading-relaxed text-[var(--muted)]">{level.desc}</p>
      <p className="mt-5 text-xs tracking-[0.15em] text-[var(--accent)]">PRESS ENTER →</p>
    </motion.button>
  )
}

export default DifficultyCard
