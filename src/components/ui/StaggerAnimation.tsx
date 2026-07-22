'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export const StaggerContainer = ({ 
  children, 
  className, 
  enabled = true,
  staggerDelay = 0.2
}: { 
  children: ReactNode; 
  className?: string; 
  enabled?: boolean;
  staggerDelay?: number;
}) => {
  if (!enabled) return <div className={className}>{children}</div>
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({ 
  children, 
  className, 
  enabled = true,
  style
}: { 
  children: ReactNode; 
  className?: string; 
  enabled?: boolean;
  style?: React.CSSProperties & { [key: `--${string}`]: string | number };
}) => {
  if (!enabled) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } }
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
