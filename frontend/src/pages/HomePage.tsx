import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DifficultyCard from '../components/DifficultyCard'
import PageFrame from '../components/PageFrame'
import TerminalHero from '../components/TerminalHero'
import TrackSection from '../components/TrackSection'
import { LEVELS } from '../data/challenges'
import type { DifficultyCardLevel, QuizLevelId } from '../types'

function isQuizLevelId(id: DifficultyCardLevel['id']): id is QuizLevelId {
  return (
    id === 'easy' ||
    id === 'medium' ||
    id === 'hard' ||
    id === 'hardcore' ||
    id === 'survival'
  )
}

interface HomePageProps {
  onEnterTerminalMode?: () => void
}

function HomePage({ onEnterTerminalMode }: HomePageProps) {
  const navigate = useNavigate()
  const [isHardcoreBooting, setIsHardcoreBooting] = useState(false)
  const bootTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (bootTimerRef.current !== null) window.clearTimeout(bootTimerRef.current)
    }
  }, [])

  const handleSelectLevel = (id: DifficultyCardLevel['id']) => {
    if (!isQuizLevelId(id)) {
      return
    }

    if (id !== 'hardcore') {
      navigate(`/quiz/${id}`)
      return
    }

    setIsHardcoreBooting(true)
    bootTimerRef.current = window.setTimeout(() => {
      navigate('/quiz/hardcore')
    }, 700)
  }

  return (
    <PageFrame>
      {isHardcoreBooting && (
        <div className="hardcore-crack-overlay" aria-hidden="true">
          <div className="hardcore-crack-burst" />
          <div className="hardcore-crack-noise" />
        </div>
      )}

      <TerminalHero onEnterTerminalMode={onEnterTerminalMode} />
      <TrackSection
        code="[ TRILHA 01 ]"
        title="Logica de Programacao"
        description="Resolva desafios de leitura de codigo, evolua do basico ao hardcore e encare um modo sobrevivencia de uma vida so."
      >
        {LEVELS.map((level) => (
          <DifficultyCard key={level.id} level={level} onSelect={handleSelectLevel} />
        ))}
      </TrackSection>

      <TrackSection
        code="[ TRILHA 02 ]"
        title="Depuracao de Codigo"
        description="Encontre o erro em scripts Python com duas trilhas: uma normal para aquecer e outra hard mode com casos mais pesados."
      >
        <DifficultyCard
          level={{
            id: 'bug_hunt_normal',
            nome: 'Caca ao Bug',
            desc: '3 questoes com bugs classicos de loop, condicao e indexacao.',
          }}
          onSelect={() => navigate('/bug-hunt/normal')}
        />
        <DifficultyCard
          level={{
            id: 'bug_hunt_hard',
            nome: 'Caca ao Bug Hard Mode',
            desc: '5 questoes de depuracao com bugs mais dificeis, casos limite e validacao real no backend.',
          }}
          onSelect={() => navigate('/bug-hunt/hard')}
        />
      </TrackSection>
    </PageFrame>
  )
}

export default HomePage
