function Header() {
  return (
    <header className="terminal-panel px-4 py-3 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-lg font-bold tracking-[0.2em] text-[var(--text)] md:text-xl">
          CODADO
        </h1>
        <p className="ascii-muted hidden text-xs tracking-[0.12em] sm:block">CODE.CHALLENGE.TERMINAL</p>
      </div>
    </header>
  )
}

export default Header
