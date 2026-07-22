'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utilities/ui'

export const AnimatedBlock = ({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
