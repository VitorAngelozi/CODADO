import { BUILD_LABEL } from '../lib/buildInfo'

function FooterBar() {
  return (
    <footer className="codado-footerbar terminal-panel" aria-label="Footer bar">
      <div className="codado-footerbar-row">
        <span className="ascii-muted">{"> digite 'help' para listar comandos disponiveis"}</span>
        <span className="ascii-muted">v{BUILD_LABEL} | CODE.CHALLENGE.TERMINAL</span>
      </div>
    </footer>
  )
}

export default FooterBar

