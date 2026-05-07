function TrackSection({ code, title, description, children }) {
  return (
    <section className="space-y-4">
      <div className="terminal-panel px-5 py-4">
        <p className="ascii-muted text-xs tracking-[0.18em]">{code}</p>
        <h3 className="mt-2 font-display text-xl font-bold tracking-[0.1em] text-[var(--text)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">{children}</div>
    </section>
  )
}

export default TrackSection
