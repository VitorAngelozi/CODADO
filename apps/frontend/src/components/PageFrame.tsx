import { motion } from 'framer-motion'
import type { PageFrameProps } from '../types'

function PageFrame({ children, className = '' }: PageFrameProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`relative space-y-6 ${className}`}>
      {children}
    </motion.div>
  )
}

export default PageFrame
