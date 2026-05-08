import { getRankProgress } from '../lib/terminalShared'
import type { OperatorSessionSnapshot } from '../types'
import TypewriterText from './TypewriterText'

interface HeroPanelProps {
  operator: OperatorSessionSnapshot
  onEnterTerminalMode: () => void
}

function HeroPanel({ operator, onEnterTerminalMode }: HeroPanelProps) {
  const progress = getRankProgress(operator.xp)
  const xpDenominator = progress.nextMinXp ?? progress.currentMinXp

  return (
    <section className="codado-hero terminal-panel scanline" aria-label="System overview">
      <div className="codado-hero-grid">
        <div className="codado-hero-left">
          <p className="ascii-muted codado-hero-kicker">{'// SYSTEM READY'}</p>
          <h1 className="codado-hero-title codado-hero-title-loop" aria-label="CODADO">
            <TypewriterText
              text="CODADO"
              speed={92}
              holdMs={110}
              loop
              loopSuffix="..."
              loopSuffixSpeed={110}
              deleteSpeed={80}
              loopEndBlinkCount={3}
              loopRestartBlinkCount={2}
              loopBlinkMs={165}
              loopRestartDelayMs={160}
              showCursor
            />
          </h1>
          <p className="codado-hero-desc">
            Desafios interativos de programacao em estilo terminal.
            <br />
            Linguagem inicial: Python.
          </p>
          <p className="codado-hero-line">
            <span className="codado-green">{'> SISTEMA:'}</span> Todos os protocolos carregados com sucesso.
          </p>
        </div>

        <div className="codado-hero-mid">
          <button type="button" className="codado-hero-cta terminal-panel" onClick={onEnterTerminalMode}>
            {'>_ ENTER TERMINAL MODE'}
          </button>
          <p className="ascii-muted codado-hero-cta-sub">{'+ iniciar protocolo terminal'}</p>
        </div>

        <div className="codado-hero-right terminal-panel">
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
          <div className="codado-sidebar-xpbar codado-hero-status-bar" aria-hidden="true">
            <div className="codado-sidebar-xpbar-fill" style={{ width: `${progress.progressPct}%` }} />
          </div>
          <p className="codado-sidebar-status-line">
            <span className="ascii-muted">NEXT:</span>{' '}
            {progress.nextRank ? `${progress.nextRank} (${progress.remainingXp} XP)` : 'MAX ACCESS'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroPanel
