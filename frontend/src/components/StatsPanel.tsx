import type { OperatorSessionSnapshot } from '../types'
import { getRankProgress } from '../lib/terminalShared'

interface StatsPanelProps {
  operator: OperatorSessionSnapshot
  accuracyPercent?: number
}

function StatsPanel({ operator, accuracyPercent = 0 }: StatsPanelProps) {
  const progress = getRankProgress(operator.xp)

  return (
    <section className="terminal-panel codado-stats" aria-label="Progress panel">
      <div className="codado-panel-head">
        <p className="codado-panel-title">SEU PROGRESSO</p>
        <p className="ascii-muted codado-panel-sub">{'// estatisticas gerais'}</p>
      </div>

      <div className="codado-stats-grid">
        <div className="codado-stat">
          <p className="codado-stat-k">XP TOTAL</p>
          <p className="codado-stat-v">{operator.xp}</p>
          <p className="ascii-muted codado-stat-h">{'+0 esta semana'}</p>
        </div>
        <div className="codado-stat">
          <p className="codado-stat-k">RANK ATUAL</p>
          <p className="codado-stat-v">{operator.rank}</p>
          <p className="ascii-muted codado-stat-h">
            {progress.nextRank ? `proximo: ${progress.nextRank} (${progress.remainingXp} XP)` : 'acesso maximo'}
          </p>
        </div>
        <div className="codado-stat">
          <p className="codado-stat-k">DESAFIOS RESOLVIDOS</p>
          <p className="codado-stat-v">{operator.bugsResolved}</p>
          <p className="ascii-muted codado-stat-h">{'de ?? disponiveis'}</p>
        </div>
        <div className="codado-stat">
          <p className="codado-stat-k">TAXA DE ACERTO</p>
          <p className="codado-stat-v">{accuracyPercent}%</p>
          <p className="ascii-muted codado-stat-h">{'mantenha o foco'}</p>
        </div>
        <div className="codado-stat">
          <p className="codado-stat-k">SEQUENCIA ATUAL</p>
          <p className="codado-stat-v">{operator.streak}</p>
          <p className="ascii-muted codado-stat-h">{'melhore sua sequencia'}</p>
        </div>
      </div>
    </section>
  )
}

export default StatsPanel
