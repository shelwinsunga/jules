'use client'

import { motion } from 'framer-motion'

export default function LatexLoading() {
  const pageCount = 5 // Simulating 3 pages of a PDF

  return (
    <div className="w-full h-full p-2.5 bg-background">
      <div className="mb-4 flex items-center justify-between">
        <motion.div
          className="h-8 w-40 bg-gray-200 dark:bg-muted rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-8 w-20 bg-gray-200 dark:bg-muted rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </div>
      {[...Array(pageCount)].map((_, index) => (
        <motion.div
          key={index}
          className="mb-8 last:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-muted rounded mb-4" />
          <div className="space-y-2">
            {[...Array(5)].map((_, lineIndex) => (
              <motion.div
                key={lineIndex}
                className="h-4 bg-gray-200 dark:bg-muted rounded"
                style={{ width: `${Math.random() * 40 + 60}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: lineIndex * 0.1 }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
