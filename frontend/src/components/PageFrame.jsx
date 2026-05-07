import { motion } from 'framer-motion'

function PageFrame({ children, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`relative space-y-8 ${className}`}>
      {children}
    </motion.div>
  )
}

export default PageFrame
