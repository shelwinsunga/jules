'use client'
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { db } from '@/lib/constants'

// TODO: Add types
const FrontendContext = createContext<any>(undefined)

export function FrontendProvider({ children }: { children: ReactNode }) {
  const { user } = db.useAuth()

  const value = {
    user,
  }
  return <FrontendContext.Provider value={value}>{children}</FrontendContext.Provider>
}

export const useFrontend = () => {
  const context = useContext(FrontendContext)
  if (context === undefined) {
    throw new Error('useFrontend must be used within a FrontendProvider')
  }
  return context
}
