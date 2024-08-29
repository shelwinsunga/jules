'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation'
import { db } from '@/lib/constants';

interface FrontendContextType {
    latex: string;
    setLatex: (latex: string) => void;
    isLoading: boolean;
}

const FrontendContext = createContext<FrontendContextType | undefined>(undefined);

export const FrontendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [latex, setLatex] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { id } = useParams<{ id?: string }>();
    const pathname = usePathname();

    const isProjectRoute = pathname?.startsWith('/project/');

    const { isLoading: dbLoading, error, data } = db.useQuery(
        isProjectRoute && id
            ? {
                projects: {
                    $: {
                        where: {
                            id: id
                        }
                    }
                }
              }
            : null
    );

    useEffect(() => {
        if (isProjectRoute) {
            if (!dbLoading && data) {
                setLatex(data.projects[0]?.project_content || '');
                setIsLoading(false);
            }
        } else {
            setLatex('');
            setIsLoading(false);
        }
    }, [isProjectRoute, dbLoading, data]);

    return (
        <FrontendContext.Provider value={{ latex, setLatex, isLoading }}>
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
