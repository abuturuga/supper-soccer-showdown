type SoccerEvent =
    | "initMatch"
    | "ballPossession"
    | "pass"
    | "advanceWithBall"
    | "attemptShot"
    | "crossTheBall"
    | "interception"
    | "goalScored"
    | "shotMissed"
    | "goalieRelease";

type Universe = 'starwars' | 'pokemon';

type Position = 'Goalie' | 'Defence' | 'Offence';

type Player = {
    id: number;
    name: string;
    weight: number;
    height: number;
    position: Position;
    universe: Universe;
};

const firstTeam: Player[] = [
    { id: 1, name: 'Mewtwo', weight: 122, height: 200, position: 'Goalie', universe: 'pokemon' },
    { id: 2, name: 'Machamp', weight: 130, height: 160, position: 'Defence', universe: 'pokemon' },
    { id: 3, name: 'Snorlax', weight: 460, height: 210, position: 'Defence', universe: 'pokemon' },
    { id: 4, name: 'Pikachu', weight: 6, height: 40, position: 'Offence', universe: 'pokemon' },
    { id: 5, name: 'Lucario', weight: 54, height: 120, position: 'Offence', universe: 'pokemon' }
];

const secondTeam: Player[] = [
    { id: 6, name: 'Chewbacca', weight: 112, height: 228, position: 'Goalie', universe: 'starwars' },
    { id: 7, name: 'Darth Vader', weight: 120, height: 203, position: 'Defence', universe: 'starwars' },
    { id: 8, name: 'Bobba Fett', weight: 78, height: 183, position: 'Defence', universe: 'starwars' },
    { id: 9, name: 'Luke Skywalker', weight: 77, height: 172, position: 'Offence', universe: 'starwars' },
    { id: 10, name: 'Ahsoka Tano', weight: 56, height: 170, position: 'Offence', universe: 'starwars' }
];

type ActionPayload = {
    player?: Player;
    teamId?: 'first' | 'second';
};

type Action = {
    event: SoccerEvent;
    paylod: ActionPayload;
}

type GenerateActionParams = {
    action: Action;
    firstTeam: Player[];
    secondTeam: Player[];
    chance: number;
};

const generateRandomNumber = (max: number) => Math.floor(Math.random() * max);

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

const playMatch = () => {
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

const actions = playMatch();
console.log(actions);