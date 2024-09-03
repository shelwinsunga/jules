'use client'
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useProjectData, useProjectFiles } from '@/hooks/data';

interface FrontendContextType {
  
}

const FrontendContext = createContext<FrontendContextType | undefined>(undefined);

export function FrontendProvider({children}: {children: ReactNode}) {

    const value = {}
    return (
        <FrontendContext.Provider value={value}>
            {children}
        </FrontendContext.Provider>
    );
};

export const useFrontend = () => {
    const context = useContext(FrontendContext);
    if (context === undefined) {
        throw new Error('useFrontend must be used within a FrontendProvider');
    }
    return context;
};
