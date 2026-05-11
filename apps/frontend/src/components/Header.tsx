function Header() {
  return (
    <header className="terminal-panel px-4 py-2.5 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-sm font-bold tracking-[0.32em] text-[var(--text)] md:text-base">
          CODADO
        </h1>
        <p className="ascii-muted hidden text-[11px] tracking-[0.18em] sm:block">
          CODE.CHALLENGE.TERMINAL
        </p>
      </div>
    </header>
  )
}

export default Header
