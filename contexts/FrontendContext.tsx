'use client'
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { db } from '@/lib/constants'
import { tx } from '@instantdb/react'
// TODO: Add types
const FrontendContext = createContext<any>(undefined)

export function FrontendProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = db.useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && user === null && pathname !== '/') {
      router.push('/login')
    }
  }, [isLoading, user, router, pathname])

  if (isLoading) {
    return null;
  }
  
  // useEffect(() => {
  //   if (user) {
  //     const userProperties = Object.entries(user).reduce((acc, [key, value]) => {
  //       if (key !== 'id') {
  //         acc[key] = value;
  //       }
  //       return acc;
  //     }, {} as Record<string, any>);

  //     db.transact(tx.users[user.id].update(userProperties));
  //   }
  // }, [user]);

  const value = {
    user,
    isLoading,
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
