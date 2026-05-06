import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DifficultyCard from '../components/DifficultyCard'
import TerminalHero from '../components/TerminalHero'
import { LEVELS } from '../data/challenges'

function HomePage() {
  const navigate = useNavigate()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <TerminalHero />
      <section className="grid gap-4 md:grid-cols-3">
        {LEVELS.map((level) => (
          <DifficultyCard key={level.id} level={level} onSelect={(id) => navigate(`/quiz/${id}`)} />
        ))}
      </section>
    </motion.div>
  )
}

export default HomePage
