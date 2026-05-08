import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ErrorState from '../components/ErrorState'
import ProtocolCard from '../components/ProtocolCard'
import { GUESS_LANGUAGE_LEVELS } from '../data/guessLanguageChallenges'
import { CHALLENGES, LEVELS } from '../data/challenges'
import { BUG_HUNT_MODES } from '../data/bugHuntChallenges'

type TrackId = 'logica' | 'depuracao' | 'linguagem'

function isTrackId(value?: string): value is TrackId {
  return value === 'logica' || value === 'depuracao' || value === 'linguagem'
}

function TrackPage() {
  const navigate = useNavigate()
  const { trackId } = useParams<{ trackId?: string }>()
  const safeTrackId = isTrackId(trackId) ? trackId : null

  const logicCounts = useMemo(() => {
    return {
      easy: CHALLENGES.easy.length,
      medium: CHALLENGES.medium.length,
      hard: CHALLENGES.hard.length,
      hardcore: CHALLENGES.hardcore.length,
      survival:
        CHALLENGES.easy.length + CHALLENGES.medium.length + CHALLENGES.hard.length + CHALLENGES.hardcore.length,
    }
  }, [])

  const header = useMemo(() => {
    if (!safeTrackId) return null

    if (safeTrackId === 'logica') {
      return {
        code: '[ TRILHA 01 ]',
        title: 'LOGICA DE PROGRAMACAO',
        subtitle: '// escolha um protocolo',
        description:
          'Leitura de codigo em Python, do basico ao hardcore. Inclui modo sobrevivencia (uma vida so).',
      }
    }

    if (safeTrackId === 'depuracao') {
      return {
        code: '[ TRILHA 02 ]',
        title: 'DEPURACAO DE CODIGO',
        subtitle: '// escolha um protocolo',
        description: 'Encontre o erro em scripts Python. Normal para aquecer e hard mode com casos mais pesados.',
      }
    }

    return {
      code: '[ TRILHA 03 ]',
      title: 'ADIVINHE A LINGUAGEM',
      subtitle: '// escolha um protocolo',
      description: 'Trechos soltos de codigo: identifique a linguagem correta, do obvio ao enganador.',
    }
  }, [safeTrackId])

  if (!safeTrackId || !header) {
    return <ErrorState message="Trilha nao encontrada." />
  }

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
        <p className="ascii-muted text-xs tracking-[0.22em]">{header.code}</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-[0.12em] text-[var(--text)]">{header.title}</h2>
        <p className="ascii-muted mt-1 text-xs tracking-[0.18em]">{header.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{header.description}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {safeTrackId === 'logica' &&
          LEVELS.map((level, idx) => (
            <ProtocolCard
              key={level.id}
              idLabel={`[ ${String(idx + 1).padStart(2, '0')} ]`}
              title={level.nome.toUpperCase()}
              description={level.desc}
              countLabel={`0/${logicCounts[level.id]} desafios`}
              icon=">"
              onStart={() => navigate(`/quiz/${level.id}`)}
            />
          ))}

        {safeTrackId === 'depuracao' && (
          <>
            <ProtocolCard
              idLabel="[ 01 ]"
              title="CACA AO BUG"
              description="3 questoes com bugs classicos de loop, condicao e indexacao."
              countLabel={`0/${BUG_HUNT_MODES.normal.challenges.length} desafios`}
              icon="[]"
              onStart={() => navigate('/bug-hunt/normal')}
            />
            <ProtocolCard
              idLabel="[ 02 ]"
              title="CACA AO BUG HARD MODE"
              description="5 questoes de depuracao com bugs mais dificeis, casos limite e validacao real no backend."
              countLabel={`0/${BUG_HUNT_MODES.hard.challenges.length} desafios`}
              icon="!!"
              onStart={() => navigate('/bug-hunt/hard')}
            />
          </>
        )}

        {safeTrackId === 'linguagem' &&
          GUESS_LANGUAGE_LEVELS.map((level, idx) => (
            <ProtocolCard
              key={level.id}
              idLabel={`[ ${String(idx + 1).padStart(2, '0')} ]`}
              title={level.nome.toUpperCase()}
              description={level.desc}
              countLabel="0/5 desafios"
              icon="</>"
              onStart={() => navigate(`/guess-language/${level.id}`)}
            />
          ))}
      </div>
    </motion.section>
  )
}

export default TrackPage

