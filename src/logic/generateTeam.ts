import type { Player, RawCandidate, Lineup, Universe } from '../domain';

export function generateTeam(
    candidates: RawCandidate[],
    lineup: Lineup,
    universe: Universe
): Player[] {
    const goalie = [...candidates].sort((a, b) => b.height - a.height)[0];

    const remaining = candidates.filter(c => c.id !== goalie.id);

    const defenders = [...remaining].sort((a, b) => b.weight - a.weight).slice(0, lineup.defenders);
    const defenderIds = new Set(defenders.map(d => d.id));

    const afterDefenders = remaining.filter(c => !defenderIds.has(c.id));
    const attackers = [...afterDefenders].sort((a, b) => a.height - b.height).slice(0, lineup.attackers);

    return [
        { ...goalie, position: 'Goalie', universe },
        ...defenders.map(d => ({ ...d, position: 'Defence' as const, universe })),
        ...attackers.map(a => ({ ...a, position: 'Offence' as const, universe })),
    ];
}
