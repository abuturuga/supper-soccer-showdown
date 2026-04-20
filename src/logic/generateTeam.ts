import type { Player, RawCandidate, Lineup, Universe } from '../domain';

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const SAMPLE_SIZE = 8;

export function generateTeam(
    candidates: RawCandidate[],
    lineup: Lineup,
    universe: Universe
): Player[] {
    const pool = shuffle(candidates).slice(0, Math.min(SAMPLE_SIZE, candidates.length));

    const byHeightDesc = [...pool].sort((a, b) => b.height - a.height);
    const goalie = byHeightDesc[0];

    const remaining = pool.filter(c => c.id !== goalie.id);

    const byWeightDesc = [...remaining].sort((a, b) => b.weight - a.weight);
    const defenders = byWeightDesc.slice(0, lineup.defenders);
    const defenderIds = new Set(defenders.map(d => d.id));

    const afterDefenders = remaining.filter(c => !defenderIds.has(c.id));
    const byHeightAsc = [...afterDefenders].sort((a, b) => a.height - b.height);
    const attackers = byHeightAsc.slice(0, lineup.attackers);

    return [
        { ...goalie, position: 'Goalie', universe },
        ...defenders.map(d => ({ ...d, position: 'Defence' as const, universe })),
        ...attackers.map(a => ({ ...a, position: 'Offence' as const, universe })),
    ];
}
