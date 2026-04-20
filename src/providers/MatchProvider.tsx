import { createContext, useContext, useState } from 'react';
import type { Match } from '../domain';

type MatchContextValue = {
    getMatch: () => Match | null;
    setMatch: (match: Match) => void;
};

const MatchContext = createContext<MatchContextValue | null>(null);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
    const [match, setMatchState] = useState<Match | null>(null);

    const getMatch = () => match;
    const setMatch = (m: Match) => setMatchState(m);

    return (
        <MatchContext.Provider value={{ getMatch, setMatch }}>
            {children}
        </MatchContext.Provider>
    );
};

export const useMatchProvider = (): MatchContextValue => {
    const ctx = useContext(MatchContext);
    return ctx;
};
