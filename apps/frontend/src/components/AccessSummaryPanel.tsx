import type { OperatorSessionSnapshot, TerminalRank } from '../types'
import { getRankProgress } from '../lib/terminalShared'

const MICROCOPY: Record<TerminalRank, string> = {
  INITIATE: 'bootstrap required.',
  OPERATOR: 'operator recognized.',
  DEBUGGER: 'debugging privileges enabled.',
  EXECUTOR: 'execution layer unlocked.',
  ROOT: 'root access granted.',
  ARCHITECT: 'architecture synchronization complete.',
}

interface AccessSummaryPanelProps {
  operator: OperatorSessionSnapshot
}

function AccessSummaryPanel({ operator }: AccessSummaryPanelProps) {
  const progress = getRankProgress(operator.xp)
  const xpDenominator = progress.nextMinXp ?? progress.currentMinXp

  return (
    <section className="terminal-panel codado-access-summary" aria-label="Access summary">
      <div className="codado-panel-head">
        <p className="codado-panel-title">ACCESS SUMMARY</p>
        <p className="ascii-muted codado-panel-sub">{'// autorizacao e progressao'}</p>
      </div>

      <div className="codado-access-body">
        <div className="codado-access-kv">
          <p className="ascii-muted codado-access-k">RANK</p>
          <p className="codado-access-v codado-green">{progress.currentRank}</p>
        </div>
        <div className="codado-access-kv">
          <p className="ascii-muted codado-access-k">XP</p>
          <p className="codado-access-v">
            {operator.xp} / {xpDenominator}
          </p>
        </div>
        <div className="codado-access-kv">
          <p className="ascii-muted codado-access-k">NEXT</p>
          <p className="codado-access-v">
            {progress.nextRank ? (
              <>
                <span className="codado-green">{progress.nextRank}</span> ({progress.remainingXp} XP)
              </>
            ) : (
              <span className="codado-green">MAX ACCESS</span>
            )}
          </p>
        </div>
        <div className="codado-access-kv codado-access-progress">
          <p className="ascii-muted codado-access-k">PROGRESS</p>
          <div className="codado-access-bar" aria-hidden="true">
            <div className="codado-access-bar-fill" style={{ width: `${progress.progressPct}%` }} />
          </div>
          <p className="ascii-muted codado-access-hint">
            {progress.nextRank ? `${progress.progressPct}% to next tier` : '100% synchronized'}
          </p>
        </div>

        <p className="ascii-muted codado-access-micro">{'> '}{MICROCOPY[progress.currentRank]}</p>
      </div>
    </section>
  )
}

export default AccessSummaryPanel

