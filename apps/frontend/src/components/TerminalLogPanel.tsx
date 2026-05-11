export interface TerminalLogEntry {
  time: string
  message: string
  kind?: 'system' | 'info' | 'success' | 'warning'
}

interface TerminalLogPanelProps {
  id?: string
  title?: string
  lines: TerminalLogEntry[]
  actionLabel?: string
  onAction?: () => void
}

function TerminalLogPanel({
  id,
  title = 'TERMINAL LOG',
  lines,
  actionLabel = 'ABRIR TERMINAL COMPLETO ->',
  onAction,
}: TerminalLogPanelProps) {
  return (
    <section id={id} className="terminal-panel codado-terminal-log" aria-label="Terminal log">
      <div className="codado-panel-head codado-terminal-log-head">
        <div>
          <p className="codado-panel-title">{title}</p>
          <p className="ascii-muted codado-panel-sub">{'// logs do sistema'}</p>
        </div>
        {onAction && (
          <button type="button" className="codado-terminal-log-cta terminal-panel" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>

      <div className="codado-terminal-log-body">
        {lines.slice(-14).map((line) => (
          <p key={`${line.time}-${line.message}`} className="codado-terminal-line">
            <span className="ascii-muted">[{line.time}]</span> {line.message}
          </p>
        ))}
        {lines.length === 0 && <p className="ascii-muted codado-terminal-line">{'> sem logs no momento.'}</p>}
      </div>
    </section>
  )
}

export default TerminalLogPanel

