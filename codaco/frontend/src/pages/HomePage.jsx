import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DifficultyCard from '../components/DifficultyCard'
import TerminalHero from '../components/TerminalHero'
import { LEVELS } from '../data/challenges'

function HomePage() {
  const navigate = useNavigate()
  const [isHardcoreBooting, setIsHardcoreBooting] = useState(false)
  const bootTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (bootTimerRef.current) window.clearTimeout(bootTimerRef.current)
    }
  }, [])

  const handleSelectLevel = (id) => {
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative space-y-8">
      {isHardcoreBooting && (
        <div className="hardcore-crack-overlay" aria-hidden="true">
          <div className="hardcore-crack-burst" />
          <div className="hardcore-crack-noise" />
        </div>
      )}

      <TerminalHero />
      <section className="grid gap-4 md:grid-cols-3">
        {LEVELS.map((level) => (
          <DifficultyCard key={level.id} level={level} onSelect={handleSelectLevel} />
        ))}
      </section>
    </motion.div>
  )
}

export default HomePage
