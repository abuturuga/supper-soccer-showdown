import type { Action, Player } from '../domain';
import { generateRandomNumber } from './utils';


type GenerateActionParams = {
    action: Action;
    firstTeam: Player[];
    secondTeam: Player[];
    chance: number;
};

const generateAction = ({ action, firstTeam, secondTeam, chance }: GenerateActionParams): Action => {
    const { event, paylod } = action;
    const teamId = paylod.teamId;

    const getTeam = (id: 'first' | 'second') => id === 'first' ? firstTeam : secondTeam;
    const getOppositeTeamId = (id: 'first' | 'second'): 'first' | 'second' => id === 'first' ? 'second' : 'first';
    const getOffence = (team: Player[]) => team.filter(p => p.position === 'Offence');
    const getGoalie = (team: Player[]) => team.find(p => p.position === 'Goalie')!;
    const getDefence = (team: Player[]) => team.filter(p => p.position === 'Defence');

    switch (event) {
        case 'initMatch': {
            const startingTeamId: 'first' | 'second' = generateRandomNumber(2) === 0 ? 'first' : 'second';
            const offence = getOffence(getTeam(startingTeamId));
            const player = offence[generateRandomNumber(offence.length)];
            return { event: 'ballPossession', paylod: { player, teamId: startingTeamId } };
        }

        case 'ballPossession':
            return chance === 0
                ? { event: 'pass', paylod }
                : { event: 'advanceWithBall', paylod };

        case 'pass':
            if (chance === 0) {
                const oppositeId = getOppositeTeamId(teamId!);
                const defence = getDefence(getTeam(oppositeId));
                const player = defence[generateRandomNumber(defence.length)];
                return { event: 'interception', paylod: { player, teamId: oppositeId } };
            }
            return { event: 'ballPossession', paylod };

        case 'advanceWithBall':
            return chance === 0
                ? { event: 'attemptShot', paylod }
                : { event: 'ballPossession', paylod };

        case 'interception': {
            const offence = getOffence(getTeam(teamId!));
            const player = offence[generateRandomNumber(offence.length)];
            return { event: 'ballPossession', paylod: { player, teamId } };
        }

        case 'attemptShot':
            return chance === 0
                ? { event: 'goalScored', paylod }
                : { event: 'shotMissed', paylod };

        case 'goalScored': {
            const oppositeId = getOppositeTeamId(teamId!);
            const offence = getOffence(getTeam(oppositeId));
            const player = offence[generateRandomNumber(offence.length)];
            return { event: 'crossTheBall', paylod: { player, teamId: oppositeId } };
        }

        case 'shotMissed': {
            const oppositeId = getOppositeTeamId(teamId!);
            const goalie = getGoalie(getTeam(oppositeId));
            return { event: 'goalieRelease', paylod: { player: goalie, teamId: oppositeId } };
        }

        case 'goalieRelease': {
            const offence = getOffence(getTeam(teamId!));
            const player = offence[generateRandomNumber(offence.length)];
            return { event: 'ballPossession', paylod: { player, teamId } };
        }

        case 'crossTheBall':
            return { event: 'ballPossession', paylod };

        default:
            return action;
    }
};

export const generateMatch = (firstTeam: Player[], secondTeam: Player[]) => {
    const actions: Action[] = [];
    const MINUTES = 90;

    actions.push(generateAction({
        action: { event: 'initMatch', paylod: { } },
        firstTeam,
        secondTeam,
        chance: 1,
    }));

    for (let minute = 1; minute <= MINUTES; minute++) {
        const action = generateAction({
            action: actions.slice(-1)[0],
            firstTeam,
            secondTeam,
            chance: generateRandomNumber(2)
        });

        actions.push(action);
    }

    return actions;
};
