import type { OperatorSessionSnapshot, TerminalRank } from '../types'
import { RANK_THRESHOLDS, getRankProgress } from '../lib/terminalShared'

type LadderStatus = 'locked' | 'current' | 'unlocked'

function getStatus(xp: number, current: TerminalRank, rank: TerminalRank): LadderStatus {
  if (rank === current) return 'current'
  const threshold = RANK_THRESHOLDS.find((entry) => entry.rank === rank)?.minXp ?? 0
  return xp >= threshold ? 'unlocked' : 'locked'
}

const MICROCOPY: Record<TerminalRank, { unlocked: string; current: string; locked: string }> = {
  INITIATE: {
    unlocked: 'bootstrap sequence completed.',
    current: 'operator handshake pending.',
    locked: 'bootstrap required.',
  },
  OPERATOR: {
    unlocked: 'operator recognized.',
    current: 'operator privileges active.',
    locked: 'operator privileges locked.',
  },
  DEBUGGER: {
    unlocked: 'debugging privileges enabled.',
    current: 'debugging layer active.',
    locked: 'debug layer locked.',
  },
  EXECUTOR: {
    unlocked: 'execution layer unlocked.',
    current: 'execution layer active.',
    locked: 'execution layer locked.',
  },
  ROOT: {
    unlocked: 'root access granted.',
    current: 'root access active.',
    locked: 'root access locked.',
  },
  ARCHITECT: {
    unlocked: 'architecture synchronization complete.',
    current: 'architecture synchronization complete.',
    locked: 'architect privileges required.',
  },
}

interface RankLadderPanelProps {
  operator: OperatorSessionSnapshot
}

function RankLadderPanel({ operator }: RankLadderPanelProps) {
  const progress = getRankProgress(operator.xp)
  const ranksAscending = [...RANK_THRESHOLDS].slice().reverse()

  return (
    <section className="terminal-panel codado-rankladder" aria-label="Rank ladder">
      <div className="codado-panel-head">
        <p className="codado-panel-title">RANK LADDER</p>
        <p className="ascii-muted codado-panel-sub">{'// niveis de acesso do sistema'}</p>
      </div>

      <div className="codado-rankladder-body">
        {ranksAscending.map((entry, index) => {
          const status = getStatus(operator.xp, progress.currentRank, entry.rank)
          const tierLabel = `[ TIER_${String(index + 1).padStart(2, '0')} ]`
          const micro =
            status === 'current' ? MICROCOPY[entry.rank].current : status === 'unlocked' ? MICROCOPY[entry.rank].unlocked : MICROCOPY[entry.rank].locked

          return (
            <div
              key={entry.rank}
              className={`codado-rankladder-row codado-rankladder-${status}`}
            >
              <div className="codado-rankladder-marker" aria-hidden="true">
                <span className={`codado-dot ${status === 'locked' ? 'codado-dot-off' : 'codado-dot-on'}`} />
                {index < ranksAscending.length - 1 && <span className="codado-rankladder-line" />}
              </div>
              <div className="codado-rankladder-main">
                <p className="ascii-muted codado-rankladder-tier">{tierLabel}</p>
                <div className="codado-rankladder-head">
                  <p className="codado-rankladder-rank">{entry.rank}</p>
                  <p className="codado-rankladder-xp">{entry.minXp} XP</p>
                  <p className="codado-rankladder-status">
                    {status === 'current' ? 'CURRENT' : status === 'unlocked' ? 'ONLINE' : 'LOCKED'}
                  </p>
                </div>
                <p className="ascii-muted codado-rankladder-micro">{'> '}{micro}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default RankLadderPanel

