import type { RawCandidate } from '../domain';

const SWAPI_MAX_PAGE = 8;

function parseId(url: string): number {
    const parts = url.split('/').filter(Boolean);
    return parseInt(parts[parts.length - 1]);
}

export async function fetchStarWarsCandidates(): Promise<RawCandidate[]> {
    const page = Math.floor(Math.random() * SWAPI_MAX_PAGE) + 1;
    const response = await fetch(
        `https://swapi.dev/api/people/?page=${page}`
    );
    const result = await response.json();

    return result.results
        .filter(p => p.height !== 'unknown' && p.mass !== 'unknown')
        .map(p => ({
            id: parseId(p.url),
            name: p.name,
            height: parseFloat(p.height),
            weight: parseFloat(p.mass.replace(',', '')),
        }))
        .filter(p => !isNaN(p.height) && !isNaN(p.weight));
}
