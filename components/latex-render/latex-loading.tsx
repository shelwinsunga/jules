'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function LatexLoading() {
  const pageCount = 8

  const loadingElements = useMemo(() => {
    return [...Array(pageCount)].map((_, index) => (
      <motion.div
        key={index}
        className="mb-8 last:mb-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
      >
        <div className="h-6 w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-gray-200 dark:bg-muted rounded mb-4" />
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
    ));
  }, [pageCount]);

  return (
    <div className="flex justify-center items-start w-full h-full">
    <div className="w-full max-w-4xl p-4 bg-background">
      <div className="mb-4 flex items-center justify-between">
        <motion.div
          className="h-8 w-40 sm:w-32 md:w-40 lg:w-48 xl:w-56 bg-gray-200 dark:bg-muted rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-8 w-20 sm:w-24 md:w-20 lg:w-24 xl:w-28 bg-gray-200 dark:bg-muted rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </div>
      {loadingElements}
    </div>
    </div>
  )
}
