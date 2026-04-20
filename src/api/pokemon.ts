import type { RawCandidate } from '../domain';

const BATCH_SIZE = 20;
const TOTAL_POKEMON = 1000;


export async function fetchPokemonCandidates(): Promise<RawCandidate[]> {
    const maxOffset = TOTAL_POKEMON - BATCH_SIZE;
    const offset = Math.floor(Math.random() * maxOffset);

    const list = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${BATCH_SIZE}&offset=${offset}`
    );
    if (!list.ok) throw new Error(`PokeAPI list error: ${list.status}`);
    const listResponse = await list.json();

    const results = await Promise.allSettled(
        listResponse.results.map(async (p: { url: string }) => {
            const response = await fetch(p.url);
            if (!response.ok) throw new Error(`PokeAPI detail error: ${response.status}`);
            return response.json();
        })
    );

    return results
        .filter((r): r is PromiseFulfilledResult<{ id: number; name: string; height: number; weight: number }> => r.status === 'fulfilled')
        .map(r => r.value)
        .map(p => ({
            id: p.id,
            name: p.name,
            height: p.height * 10,  // decimetres → cm
            weight: p.weight / 10,  // hectograms → kg
        }));
}
