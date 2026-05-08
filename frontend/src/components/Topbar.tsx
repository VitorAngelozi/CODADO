import { useEffect, useState } from 'react'
import type { OperatorSessionSnapshot } from '../types'
import { BUILD_LABEL, NODE_LABEL, PROTOCOL_LABEL } from '../lib/buildInfo'

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour12: false })
}

interface TopbarProps {
  operator: OperatorSessionSnapshot
  onEnterTerminalMode: () => void
}

function Topbar({ operator, onEnterTerminalMode }: TopbarProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <header className="codado-topbar terminal-panel" aria-label="Top bar">
      <div className="codado-topbar-row">
        <div className="codado-topbar-left">
          <span className="codado-topbar-brand">CODADO.SYSTEM_{BUILD_LABEL}</span>
          <span className="codado-topbar-sep" aria-hidden="true">
            ●
          </span>
          <span className="codado-topbar-kv">
            <span className="ascii-muted">NODE:</span> <span className="codado-green">{NODE_LABEL}</span>
          </span>
          <span className="codado-topbar-sep" aria-hidden="true">
            ●
          </span>
          <span className="codado-topbar-kv">
            <span className="ascii-muted">PROTOCOL:</span> <span className="codado-green">ACTIVE</span>
          </span>
          <span className="codado-topbar-sep" aria-hidden="true">
            ●
          </span>
          <span className="codado-topbar-kv">
            <span className="ascii-muted">RANK:</span> {operator.rank}
          </span>
        </div>

        <div className="codado-topbar-right">
          <span className="codado-topbar-time">{formatTime(now)}</span>
          <button type="button" className="codado-topbar-cta terminal-panel" onClick={onEnterTerminalMode}>
            {'>_ TERMINAL MODE'}
          </button>
          <span className="codado-topbar-protocol ascii-muted">{PROTOCOL_LABEL}</span>
        </div>
      </div>
    </header>
  )
}

export default Topbar

