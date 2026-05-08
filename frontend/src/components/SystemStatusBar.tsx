import { useEffect, useMemo, useState } from 'react'
import type { OperatorSessionSnapshot } from '../types'
import { BUILD_LABEL, NODE_LABEL, PROTOCOL_LABEL } from '../lib/buildInfo'

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour12: false })
}

interface SystemStatusBarProps {
  operator: OperatorSessionSnapshot
}

function SystemStatusBar({ operator }: SystemStatusBarProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const xpTarget = 100
  const xpClamped = Math.max(0, Math.min(xpTarget, operator.xp))
  const xpPercent = useMemo(() => Math.round((xpClamped / xpTarget) * 100), [xpClamped])

  return (
    <section className="terminal-panel codado-statusbar px-4 py-2 md:px-6" aria-label="System status">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] tracking-[0.18em]">
        <span className="codado-status-item">
          <span className="ascii-muted">OPERATOR:</span> UNKNOWN
        </span>
        <span className="codado-status-sep" aria-hidden="true">
          |
        </span>
        <span className="codado-status-item">
          <span className="ascii-muted">RANK:</span>{' '}
          <span className="codado-green">{operator.rank}</span>
        </span>
        <span className="codado-status-sep" aria-hidden="true">
          |
        </span>
        <span className="codado-status-item flex items-center gap-3">
          <span>
            <span className="ascii-muted">XP:</span> {operator.xp} / {xpTarget}
          </span>
          <span className="codado-xpbar" aria-hidden="true">
            <span className="codado-xpbar-fill" style={{ width: `${xpPercent}%` }} />
          </span>
        </span>
        <span className="codado-status-sep" aria-hidden="true">
          |
        </span>
        <span className="codado-status-item flex items-center gap-2">
          <span className="ascii-muted">SYSTEM:</span>{' '}
          <span className="codado-green">ONLINE</span>
          <span className="codado-online-dot" aria-hidden="true" />
        </span>
        <span className="codado-status-sep" aria-hidden="true">
          |
        </span>
        <span className="codado-status-item">
          <span className="ascii-muted">BUILD:</span> {BUILD_LABEL}
        </span>
        <span className="codado-status-sep" aria-hidden="true">
          |
        </span>
        <span className="codado-status-item">
          <span className="ascii-muted">NODE:</span> {NODE_LABEL}
        </span>
        <span className="codado-status-sep" aria-hidden="true">
          |
        </span>
        <span className="codado-status-item">
          <span className="ascii-muted">PROTOCOL:</span> {PROTOCOL_LABEL}
        </span>
        <span className="codado-status-sep" aria-hidden="true">
          |
        </span>
        <span className="codado-status-item">
          <span className="ascii-muted">TIME:</span> {formatTime(now)}
        </span>
      </div>
    </section>
  )
}

export default SystemStatusBar

