import type { TerminalHistoryEntry } from '../lib/terminalMode'

interface TerminalHistoryProps {
  entries: TerminalHistoryEntry[]
}

function TerminalHistory({ entries }: TerminalHistoryProps) {
  return (
    <>
      {entries.map((entry) => (
        <p
          key={entry.id}
          className={`protocol-history-line protocol-history-line-${entry.kind}`}
        >
          {entry.text}
        </p>
      ))}
    </>
  )
}

export default TerminalHistory

