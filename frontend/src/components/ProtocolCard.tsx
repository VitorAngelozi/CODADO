import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ProtocolCardProps {
  idLabel: string
  title: string
  description: string
  countLabel?: string
  statusLabel?: string
  statusIcon?: ReactNode
  statusGlyph?: string
  icon?: ReactNode
  onStart: () => void
}

function ProtocolCard({
  idLabel,
  title,
  description,
  countLabel,
  statusLabel = 'DISPONIVEL',
  statusIcon,
  statusGlyph,
  icon = '>',
  onStart,
}: ProtocolCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} className="terminal-panel codado-protocol-card">
      <div className="codado-protocol-card-top">
        <div className="codado-protocol-card-icon" aria-hidden="true">
          {icon}
        </div>
        <div className="codado-protocol-card-meta">
          <p className="ascii-muted codado-protocol-card-id">{idLabel}</p>
          <h3 className="codado-protocol-card-title">{title}</h3>
        </div>
        <div className="codado-protocol-card-status">
          {statusIcon ? (
            <span className="codado-protocol-card-status-glyph" aria-hidden="true">
              {statusIcon}
            </span>
          ) : statusGlyph ? (
              <span className="codado-protocol-card-status-glyph" aria-hidden="true">
                {statusGlyph}
              </span>
            ) : (
              <span className="codado-dot codado-dot-on" aria-hidden="true" />
            )}
          <span className="codado-green">{statusLabel}</span>
        </div>
      </div>

      <div className="codado-protocol-card-mid">
        {countLabel && <p className="ascii-muted codado-protocol-card-count">{countLabel}</p>}
        <p className="codado-protocol-card-desc">{description}</p>
      </div>

      <div className="codado-protocol-card-bottom">
        <button type="button" className="codado-protocol-card-start terminal-panel" onClick={onStart}>
          INICIAR -&gt;
        </button>
      </div>
    </motion.div>
  )
}

export default ProtocolCard
