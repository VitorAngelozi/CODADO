function QuestionCard({ challenge, selectedIndex, onSelect }) {
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
          return (
            <button
              key={`${challenge.id}_${idx}`}
              onClick={() => onSelect(idx)}
              className={`terminal-panel px-4 py-4 text-left text-sm tracking-[0.02em] transition duration-200 hover:border-[var(--accent)] ${
                isSelected ? 'border-[var(--accent)]' : ''
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
