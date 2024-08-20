'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FrontendContextType {
    latex: string;
    setLatex: (latex: string) => void;
}

const FrontendContext = createContext<FrontendContextType | undefined>(undefined);

export const FrontendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [latex, setLatex] = useState<string>('');

    return (
        <FrontendContext.Provider value={{ latex, setLatex }}>
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
