'use client'

import { motion } from 'framer-motion';

export default function GridTexture() {
    return (
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none z-[-1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
    );
};