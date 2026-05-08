import type { OperatorSessionSnapshot } from '../types'
import { getRankProgress } from '../lib/terminalShared'

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
  operator: OperatorSessionSnapshot
  activeItem?: SidebarItemId
  onNavigateHome: () => void
  onNavigateRanking: () => void
  onNavigateTerminal: () => void
  onScrollTo?: (anchorId: string) => void
}

function Sidebar({
  operator,
  activeItem = 'home',
  onNavigateHome,
  onNavigateRanking,
  onNavigateTerminal,
  onScrollTo,
}: SidebarProps) {
  const progress = getRankProgress(operator.xp)
  const xpDenominator = progress.nextMinXp ?? progress.currentMinXp
  const xpPercent = progress.progressPct

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
          <p className="codado-sidebar-status-title">STATUS</p>
          <p className="codado-sidebar-status-line">
            <span className="ascii-muted">OPERATOR:</span> UNKNOWN
          </p>
          <p className="codado-sidebar-status-line">
            <span className="ascii-muted">RANK:</span> <span className="codado-green">{progress.currentRank}</span>
          </p>
          <p className="codado-sidebar-status-line">
            <span className="ascii-muted">XP:</span> {operator.xp} / {xpDenominator}
          </p>
          <div className="codado-sidebar-xpbar" aria-hidden="true">
            <div className="codado-sidebar-xpbar-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <p className="codado-sidebar-status-line">
            <span className="ascii-muted">NEXT:</span>{' '}
            {progress.nextRank ? `${progress.nextRank} (${progress.remainingXp} XP)` : 'MAX ACCESS'}
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
