import type { Action, Player, TeamOverview, Universe } from '../domain';


export type MatchOverview = Record<Universe, TeamOverview>;

export const computeMatchOverview = (
    actions: Action[],
    firstTeam: Player[],
    secondTeam: Player[],
): MatchOverview => {
    const firstUniverse = firstTeam[0].universe;
    const secondUniverse = secondTeam[0].universe;

    const overview = {
        [firstUniverse]: { score: 0, passes: 0, shots: 0 },
        [secondUniverse]: { score: 0, passes: 0, shots: 0 },
    } as MatchOverview;

    for (const action of actions) {
        const teamId = action.paylod.teamId;
        if (!teamId) continue;

        const universe = teamId === 'first' ? firstUniverse : secondUniverse;
        const team = overview[universe];

        if (action.event === 'goalScored') team.score++;
        else if (action.event === 'pass') team.passes++;
        else if (action.event === 'attemptShot') team.shots++;
    }

    return overview;
};
