import type { RawCandidate } from '../domain';

const BATCH_SIZE = 20;
const TOTAL_POKEMON = 1000;


export async function fetchPokemonCandidates(): Promise<RawCandidate[]> {
    const maxOffset = TOTAL_POKEMON - BATCH_SIZE;
    const offset = Math.floor(Math.random() * maxOffset);

    const list = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${BATCH_SIZE}&offset=${offset}`
    );
    const listResponse = await list.json();

    const details = await Promise.all(
        listResponse.results.map(async (p) => {
            const response = await fetch(p.url);
            return await response.json();
        })
    );

    return details.map(p => ({
        id: p.id,
        name: p.name,
        height: p.height * 10,  // decimetres → cm
        weight: p.weight / 10,  // hectograms → kg
    }));
}
