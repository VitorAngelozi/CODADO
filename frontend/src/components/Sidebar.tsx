import { useEffect, useState } from 'react'
import { BUILD_LABEL, NODE_LABEL, PROTOCOL_LABEL } from '../lib/buildInfo'

type SidebarItemId = 'home' | 'trilhas' | 'ranking' | 'perfil' | 'protocolos' | 'configs'

interface SidebarItem {
  id: SidebarItemId
  label: string
  icon: string
}

const ITEMS: SidebarItem[] = [
  { id: 'home', label: 'HOME', icon: '>' },
  { id: 'trilhas', label: 'TRILHAS', icon: '≡' },
  { id: 'ranking', label: 'RANKING', icon: '⌁' },
  { id: 'perfil', label: 'PERFIL', icon: '○' },
  { id: 'protocolos', label: 'PROTOCOLOS', icon: '⟡' },
  { id: 'configs', label: 'CONFIGS', icon: '⚙' },
]

interface SidebarProps {
  activeItem?: SidebarItemId
  onNavigateHome: () => void
  onNavigateRanking: () => void
  onNavigateTerminal: () => void
  onScrollTo?: (anchorId: string) => void
}

function Sidebar({
  activeItem = 'home',
  onNavigateHome,
  onNavigateRanking,
  onNavigateTerminal,
  onScrollTo,
}: SidebarProps) {
  const [now, setNow] = useState(() => new Date())
  const [bootAt] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const uptimeSeconds = Math.max(0, Math.floor((now.getTime() - bootAt) / 1000))
  const uptimeLabel = now
    .toLocaleTimeString('pt-BR', { hour12: false })
    .split(':')
    .join(':')

  const handleItem = (id: SidebarItemId) => {
    if (id === 'home') {
      onNavigateHome()
      return
    }

    if (id === 'trilhas') {
      onScrollTo?.('codado-trilhas')
      return
    }

    if (id === 'protocolos') {
      onNavigateTerminal()
      return
    }

    if (id === 'ranking') {
      onNavigateRanking()
      return
    }
  }

  return (
    <aside className="codado-sidebar" aria-label="Sidebar">
      <div className="codado-sidebar-frame terminal-panel">
        <div className="codado-sidebar-header">
          <p className="codado-sidebar-title">CODADO</p>
          <p className="ascii-muted codado-sidebar-sub">CODE.CHALLENGE.TERMINAL</p>
        </div>

        <nav className="codado-sidebar-nav" aria-label="Primary navigation">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItem(item.id)}
              className={`codado-sidebar-item ${activeItem === item.id ? 'codado-sidebar-item-active' : ''}`}
            >
              <span className="codado-sidebar-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="codado-sidebar-label">{item.label}</span>
              {activeItem === item.id && <span className="codado-sidebar-active-dot" aria-hidden="true" />}
            </button>
          ))}
        </nav>

        <div className="codado-sidebar-status terminal-panel">
          <p className="codado-sidebar-status-title">SYSTEM</p>
          <p className="codado-sidebar-status-line">
            <span className="ascii-muted">BUILD:</span> <span className="codado-green">{BUILD_LABEL}</span>
          </p>
          <p className="codado-sidebar-status-line">
            <span className="ascii-muted">NODE:</span> <span className="codado-green">{NODE_LABEL}</span>
          </p>
          <p className="codado-sidebar-status-line">
            <span className="ascii-muted">PROTOCOL:</span> <span className="codado-green">{PROTOCOL_LABEL}</span>
          </p>
          <p className="codado-sidebar-status-line">
            <span className="ascii-muted">UPTIME:</span>{' '}
            <span className="codado-green">
              {uptimeLabel} ({uptimeSeconds}s)
            </span>
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
