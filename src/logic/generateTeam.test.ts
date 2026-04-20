import { describe, it, expect } from 'vitest';
import type { RawCandidate, Lineup } from '../domain';
import { generateTeam } from './generateTeam';

const makeCandidate = (id: number, height: number, weight: number): RawCandidate => ({
    id,
    name: `Player${id}`,
    height,
    weight,
});

// Tallest → goalie: id=5 (200cm)
// Heaviest remaining → defenders: id=4 (90kg), id=3 (80kg)
// Shortest remaining → attackers: id=1 (160cm), id=2 (165cm)
const candidates: RawCandidate[] = [
    makeCandidate(1, 160, 60),
    makeCandidate(2, 165, 65),
    makeCandidate(3, 175, 80),
    makeCandidate(4, 180, 90),
    makeCandidate(5, 200, 70),
];
const lineup: Lineup = { defenders: 2, attackers: 2 };

describe('generateTeam', () => {
    it('returns the correct total number of players', () => {
        const team = generateTeam(candidates, lineup, 'starwars');
        expect(team).toHaveLength(5);
    });

    it('assigns exactly one Goalie', () => {
        const team = generateTeam(candidates, lineup, 'starwars');
        expect(team.filter(p => p.position === 'Goalie')).toHaveLength(1);
    });

    it('assigns the correct number of Defenders', () => {
        const team = generateTeam(candidates, lineup, 'starwars');
        expect(team.filter(p => p.position === 'Defence')).toHaveLength(lineup.defenders);
    });

    it('assigns the correct number of Attackers', () => {
        const team = generateTeam(candidates, lineup, 'starwars');
        expect(team.filter(p => p.position === 'Offence')).toHaveLength(lineup.attackers);
    });

    it('picks the tallest candidate as Goalie', () => {
        const team = generateTeam(candidates, lineup, 'starwars');
        const goalie = team.find(p => p.position === 'Goalie')!;
        expect(goalie.id).toBe(5);
    });

    it('picks the heaviest non-goalie candidates as Defenders', () => {
        const team = generateTeam(candidates, lineup, 'starwars');
        const defenderIds = team.filter(p => p.position === 'Defence').map(p => p.id).sort();
        expect(defenderIds).toEqual([3, 4]);
    });

    it('picks the shortest remaining candidates as Attackers', () => {
        const team = generateTeam(candidates, lineup, 'starwars');
        const attackerIds = team.filter(p => p.position === 'Offence').map(p => p.id).sort();
        expect(attackerIds).toEqual([1, 2]);
    });

    it('stamps all players with the given universe', () => {
        const team = generateTeam(candidates, lineup, 'pokemon');
        expect(team.every(p => p.universe === 'pokemon')).toBe(true);
    });

    it('no candidate appears twice', () => {
        const team = generateTeam(candidates, lineup, 'starwars');
        const ids = team.map(p => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
