import type { Challenge } from '../types'

interface QuestionCardProps {
  challenge: Challenge
  selectedIndex: number | null
  onSelect: (index: number) => void
  revealCorrectIndex?: number | null
  revealWrongIndex?: number | null
}

function QuestionCard({
  challenge,
  selectedIndex,
  onSelect,
  revealCorrectIndex = null,
  revealWrongIndex = null,
}: QuestionCardProps) {
  return (
    <article className="terminal-panel scanline px-6 py-7">
      <p className="ascii-muted text-xs tracking-[0.22em]">[ CHALLENGE ]</p>
      <h2 className="mt-3 font-display text-lg font-bold tracking-[0.08em] text-[var(--text)] md:text-xl">
        {challenge.prompt}
      </h2>

      <pre className="mt-4 overflow-x-auto border border-[var(--line)] bg-[#0b0b0b] p-4 text-sm leading-relaxed text-[var(--text)]">
        <code>{challenge.code}</code>
      </pre>

      <div className="mt-5 grid gap-3">
        {challenge.options.map((option, idx) => {
          const isSelected = selectedIndex === idx
          const isCorrectRevealed = revealCorrectIndex === idx
          const isWrongRevealed = revealWrongIndex === idx
          return (
            <button
              key={`${challenge.id}_${idx}`}
              onClick={() => onSelect(idx)}
              className={`terminal-panel px-4 py-4 text-left text-sm tracking-[0.02em] transition duration-200 hover:border-[var(--accent)] hover:bg-[rgba(217,211,200,0.08)] hover:shadow-[0_0_0_1px_rgba(217,211,200,0.35)] focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:bg-[rgba(217,211,200,0.1)] focus-visible:shadow-[0_0_0_2px_rgba(217,211,200,0.45)] ${
                isCorrectRevealed
                  ? 'border-[#6cff9a] bg-[rgba(108,255,154,0.08)] shadow-[0_0_0_1px_rgba(108,255,154,0.45)]'
                  : isWrongRevealed
                    ? 'border-[#ff6c6c] bg-[rgba(255,108,108,0.1)] shadow-[0_0_0_1px_rgba(255,108,108,0.45)]'
                    : isSelected
                      ? 'border-[var(--accent)] bg-[rgba(217,211,200,0.1)] shadow-[0_0_0_1px_rgba(217,211,200,0.35)]'
                      : ''
              }`}
            >
              <span className="ascii-muted mr-2">{`[${String(idx + 1).padStart(2, '0')}]`}</span>
              <span className="text-[var(--text)]">{option}</span>
            </button>
          )
        })}
      </div>
    </article>
  )
}

export default QuestionCard
