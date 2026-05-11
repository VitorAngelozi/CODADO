import { BUILD_LABEL, NODE_LABEL, PROTOCOL_LABEL } from '../lib/buildInfo'

function Footer() {
  return (
    <footer className="terminal-panel codado-footerbar mt-5 px-4 py-2.5 text-[11px] tracking-[0.16em] text-[var(--muted)] md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span>{"> digite 'help' para listar comandos"}</span>
        <span className="ascii-muted">
          BUILD: {BUILD_LABEL} | NODE: {NODE_LABEL} | PROTOCOL: {PROTOCOL_LABEL}
        </span>
      </div>
    </footer>
  )
}

export default Footer
