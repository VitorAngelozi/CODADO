import { useEffect, useState } from 'react'
import { BUILD_LABEL, NODE_LABEL, PROTOCOL_LABEL } from '../lib/buildInfo'

interface HeroPanelProps {
  onEnterTerminalMode: () => void
}

function HeroPanel({ onEnterTerminalMode }: HeroPanelProps) {
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

  return (
    <section className="codado-hero terminal-panel scanline" aria-label="System overview">
      <div className="codado-hero-grid">
        <div className="codado-hero-left">
          <p className="ascii-muted codado-hero-kicker">{'// SYSTEM READY'}</p>
          <h1 className="codado-hero-title">
            CODADO<span className="codado-hero-cursor">_</span>
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
          <p className="codado-hero-techline">
            <span className="ascii-muted">BUILD</span>
            <span className="codado-green">{BUILD_LABEL}</span>
          </p>
          <p className="codado-hero-techline">
            <span className="ascii-muted">NODE</span>
            <span className="codado-green">{NODE_LABEL}</span>
          </p>
          <p className="codado-hero-techline">
            <span className="ascii-muted">PROTOCOL</span>
            <span className="codado-green">{PROTOCOL_LABEL}</span>
          </p>
          <p className="codado-hero-techline">
            <span className="ascii-muted">UPTIME</span>
            <span className="codado-green">
              {uptimeLabel} ({uptimeSeconds}s)
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroPanel
