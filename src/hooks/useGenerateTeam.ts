import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStarWarsCandidates } from '../api/starwars';
import { fetchPokemonCandidates } from '../api/pokemon';
import { generateTeam } from '../logic/generateTeam';
import type { Player, Lineup, Universe } from '../domain';

const teamNames = new Map<Universe, string>([
    ['pokemon', 'Pokemon'],
    ['starwars', 'StarWars']
])

export function useGenerateTeam(universe: Universe, lineup: Lineup) {
    const [generateId, setGenerateId] = useState<number | null>(null);

    const query = useQuery<Player[], Error>({
        queryKey: [universe, generateId],
        queryFn: async () => {
            const fetchCandidates = universe === 'starwars'
                ? fetchStarWarsCandidates
                : fetchPokemonCandidates;
            const candidates = await fetchCandidates();
            return generateTeam(candidates, lineup, universe);
        },
        enabled: generateId !== null,
        staleTime: Infinity,
        retry: 3,
        retryDelay: 1000,
    });

    return {
        players: query.data ?? [],
        isLoading: query.isLoading,
        error: query.error?.message,
        generate: () => setGenerateId(Date.now()),
        name: teamNames.get(universe),
        universe,
    };
}
