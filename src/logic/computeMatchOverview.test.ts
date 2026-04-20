import { describe, it, expect } from 'vitest';
import type { Action, Player } from '../domain';
import { computeMatchOverview } from './computeMatchOverview';

const makePlayer = (id: number, universe: Player['universe']): Player => ({
    id,
    name: `Player${id}`,
    height: 170,
    weight: 70,
    position: 'Offence',
    universe,
});

const makeAction = (event: Action['event'], teamId?: 'first' | 'second'): Action => ({
    event,
    paylod: { teamId },
});

const firstTeam: Player[] = [makePlayer(1, 'starwars'), makePlayer(2, 'starwars')];
const secondTeam: Player[] = [makePlayer(3, 'pokemon'), makePlayer(4, 'pokemon')];

describe('computeMatchOverview', () => {
    it('returns zero stats when there are no actions', () => {
        const overview = computeMatchOverview([], firstTeam, secondTeam);
        expect(overview.starwars).toEqual({ score: 0, passes: 0, shots: 0 });
        expect(overview.pokemon).toEqual({ score: 0, passes: 0, shots: 0 });
    });

    it('counts goals per team', () => {
        const actions = [
            makeAction('goalScored', 'first'),
            makeAction('goalScored', 'first'),
            makeAction('goalScored', 'second'),
        ];
        const overview = computeMatchOverview(actions, firstTeam, secondTeam);
        expect(overview.starwars.score).toBe(2);
        expect(overview.pokemon.score).toBe(1);
    });

    it('counts passes per team', () => {
        const actions = [
            makeAction('pass', 'first'),
            makeAction('pass', 'second'),
            makeAction('pass', 'second'),
        ];
        const overview = computeMatchOverview(actions, firstTeam, secondTeam);
        expect(overview.starwars.passes).toBe(1);
        expect(overview.pokemon.passes).toBe(2);
    });

    it('counts shots per team', () => {
        const actions = [
            makeAction('attemptShot', 'first'),
            makeAction('attemptShot', 'second'),
        ];
        const overview = computeMatchOverview(actions, firstTeam, secondTeam);
        expect(overview.starwars.shots).toBe(1);
        expect(overview.pokemon.shots).toBe(1);
    });

    it('ignores actions without a teamId', () => {
        const actions = [makeAction('ballPossession', undefined)];
        const overview = computeMatchOverview(actions, firstTeam, secondTeam);
        expect(overview.starwars).toEqual({ score: 0, passes: 0, shots: 0 });
        expect(overview.pokemon).toEqual({ score: 0, passes: 0, shots: 0 });
    });

    it('does not mix up goal, pass, and shot counts', () => {
        const actions = [
            makeAction('goalScored', 'first'),
            makeAction('pass', 'first'),
            makeAction('attemptShot', 'first'),
        ];
        const overview = computeMatchOverview(actions, firstTeam, secondTeam);
        expect(overview.starwars).toEqual({ score: 1, passes: 1, shots: 1 });
    });
});
