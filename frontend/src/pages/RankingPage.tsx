import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AccessSummaryPanel from '../components/AccessSummaryPanel'
import RankLadderPanel from '../components/RankLadderPanel'
import type { OperatorSessionSnapshot } from '../types'

interface RankingPageProps {
  operator: OperatorSessionSnapshot
}

function RankingPage({ operator }: RankingPageProps) {
  const navigate = useNavigate()

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto w-full max-w-6xl space-y-5">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="terminal-panel w-fit px-4 py-2 text-xs font-bold tracking-[0.12em] text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:bg-[rgba(217,211,200,0.08)] focus-visible:outline-none focus-visible:border-[var(--accent)]"
      >
        VOLTAR
      </button>

      <div className="terminal-panel scanline px-6 py-6">
        <p className="ascii-muted text-xs tracking-[0.22em]">[ RANKING ]</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-[0.12em] text-[var(--text)]">NIVEIS DE ACESSO</h2>
        <p className="ascii-muted mt-1 text-xs tracking-[0.18em]">{'// autorizacao e protocolos'}</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Progresso do operador dentro do sistema. Acesso a camadas mais avancadas conforme XP acumulado.
        </p>
      </div>

      <div className="codado-ranking-grid">
        <AccessSummaryPanel operator={operator} />
        <RankLadderPanel operator={operator} />
      </div>
    </motion.section>
  )
}

export default RankingPage

