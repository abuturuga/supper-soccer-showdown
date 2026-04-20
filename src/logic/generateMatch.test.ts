import { describe, it, expect } from 'vitest';
import type { Player } from '../domain';
import { generateMatch } from './generateMatch';

const makePlayer = (id: number, position: Player['position'], universe: Player['universe']): Player => ({
    id,
    name: `Player${id}`,
    height: 170,
    weight: 70,
    position,
    universe,
});

const firstTeam: Player[] = [
    makePlayer(1, 'Offence', 'starwars'),
    makePlayer(2, 'Offence', 'starwars'),
    makePlayer(3, 'Defence', 'starwars'),
    makePlayer(4, 'Defence', 'starwars'),
    makePlayer(5, 'Goalie', 'starwars'),
];

const secondTeam: Player[] = [
    makePlayer(6, 'Offence', 'pokemon'),
    makePlayer(7, 'Offence', 'pokemon'),
    makePlayer(8, 'Defence', 'pokemon'),
    makePlayer(9, 'Defence', 'pokemon'),
    makePlayer(10, 'Goalie', 'pokemon'),
];

const validEvents = new Set([
    'initMatch', 'ballPossession', 'pass', 'advanceWithBall',
    'attemptShot', 'crossTheBall', 'interception',
    'goalScored', 'shotMissed', 'goalieRelease',
]);

describe('generateMatch', () => {
    it('returns exactly 91 actions (1 initial + 90 minutes)', () => {
        const actions = generateMatch(firstTeam, secondTeam);
        expect(actions).toHaveLength(91);
    });

    it('first action is always ballPossession', () => {
        for (let i = 0; i < 10; i++) {
            const actions = generateMatch(firstTeam, secondTeam);
            expect(actions[0].event).toBe('ballPossession');
        }
    });

    it('every action has a valid event', () => {
        const actions = generateMatch(firstTeam, secondTeam);
        for (const action of actions) {
            expect(validEvents.has(action.event)).toBe(true);
        }
    });

    it('teamId is always first or second when present', () => {
        const actions = generateMatch(firstTeam, secondTeam);
        for (const action of actions) {
            if (action.paylod.teamId !== undefined) {
                expect(['first', 'second']).toContain(action.paylod.teamId);
            }
        }
    });
});
