import { createContext, useContext, useState } from 'react';
import type { Match } from '../domain';

type MatchContextValue = {
    match: Match | null;
    setMatch: (match: Match) => void;
};

const MatchContext = createContext<MatchContextValue | null>(null);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
    const [match, setMatch] = useState<Match | null>(null);

    return (
        <MatchContext.Provider value={{ match, setMatch }}>
            {children}
        </MatchContext.Provider>
    );
};

export const useMatchProvider = (): MatchContextValue => {
    const ctx = useContext(MatchContext);
    if (!ctx) throw new Error('useMatchProvider must be used within MatchProvider');
    return ctx;
};
