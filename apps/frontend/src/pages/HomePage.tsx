import HeroPanel from '../components/HeroPanel'
import PageFrame from '../components/PageFrame'
import ProtocolCard from '../components/ProtocolCard'
import StatsPanel from '../components/StatsPanel'
import { useNavigate } from 'react-router-dom'
import type { OperatorSessionSnapshot } from '../types'

interface HomePageProps {
  operator: OperatorSessionSnapshot
  onEnterTerminalMode?: () => void
}

function HomePage({ operator, onEnterTerminalMode }: HomePageProps) {
  const navigate = useNavigate()
  const gearIcon = (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.35 2.4c.42-1.6 2.88-1.6 3.3 0l.18.68c.12.45.49.8.95.88.55.1 1.1.26 1.62.47.43.17.92.11 1.28-.2l.54-.47c1.24-1.08 3.03.72 1.95 1.95l-.47.54c-.31.36-.37.85-.2 1.28.21.52.37 1.07.47 1.62.08.46.43.83.88.95l.68.18c1.6.42 1.6 2.88 0 3.3l-.68.18c-.45.12-.8.49-.88.95-.1.55-.26 1.1-.47 1.62-.17.43-.11.92.2 1.28l.47.54c1.08 1.23-.71 3.03-1.95 1.95l-.54-.47c-.36-.31-.85-.37-1.28-.2-.52.21-1.07.37-1.62.47-.46.08-.83.43-.95.88l-.18.68c-.42 1.6-2.88 1.6-3.3 0l-.18-.68c-.12-.45-.49-.8-.95-.88-.55-.1-1.1-.26-1.62-.47-.43-.17-.92-.11-1.28.2l-.54.47c-1.24 1.08-3.03-.72-1.95-1.95l.47-.54c.31-.36.37-.85.2-1.28a7.17 7.17 0 0 1-.47-1.62c-.08-.46-.43-.83-.88-.95l-.68-.18c-1.6-.42-1.6-2.88 0-3.3l.68-.18c.45-.12.8-.49.88-.95.1-.55.26-1.1.47-1.62.17-.43.11-.92-.2-1.28l-.47-.54c-1.08-1.24.71-3.03 1.95-1.95l.54.47c.36.31.85.37 1.28.2.52-.21 1.07-.37 1.62-.47.46-.08.83-.43.95-.88l.18-.68Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.05" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )

  return (
    <PageFrame className="codado-home">
      <HeroPanel operator={operator} onEnterTerminalMode={() => onEnterTerminalMode?.()} />

      <section id="codado-trilhas" className="terminal-panel codado-trilhas" aria-label="Available tracks">
        <div className="codado-panel-head">
          <p className="codado-panel-title">TRILHAS DISPONIVEIS</p>
          <p className="ascii-muted codado-panel-sub">{'// escolha seu caminho'}</p>
        </div>

        <div className="codado-trilhas-grid">
          <ProtocolCard
            idLabel="[ 01 ]"
            title="LOGICA DE PROGRAMACAO"
            description="Leitura de codigo. Do basico ao hardcore. Inclui modo sobrevivencia."
            icon=">"
            onStart={() => navigate('/trilhas/logica')}
          />
          <ProtocolCard
            idLabel="[ 02 ]"
            title="DEPURACAO DE CODIGO"
            description="Encontre bugs em scripts Python. Normal e hard mode com validacao real."
            icon={gearIcon}
            onStart={() => navigate('/trilhas/depuracao')}
          />
          <ProtocolCard
            idLabel="[ 03 ]"
            title="ADIVINHE A LINGUAGEM"
            description="Trechos soltos de codigo. Descubra qual linguagem esta por tras."
            icon="</>"
            onStart={() => navigate('/trilhas/linguagem')}
          />
        </div>
      </section>

      <section className="codado-lower-grid" aria-label="Progress and activity">
        <StatsPanel operator={operator} accuracyPercent={0} />
        <section className="terminal-panel codado-activity" aria-label="Recent activity">
          <div className="codado-panel-head">
            <p className="codado-panel-title">ATIVIDADE RECENTE</p>
            <p className="ascii-muted codado-panel-sub">{'// ultimas atividades'}</p>
          </div>
          <div className="codado-activity-body">
            <p className="ascii-muted">{'> Nenhuma atividade registrada.'}</p>
            <p className="ascii-muted">{'> Complete desafios para gerar atividade.'}</p>
          </div>
        </section>
      </section>
    </PageFrame>
  )
}

export default HomePage
