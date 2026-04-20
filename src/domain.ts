export type Universe = 'starwars' | 'pokemon';

export type Position = 'Goalie' | 'Defence' | 'Offence';

export type RawCandidate = {
    id: number;
    name: string;
    weight: number; // kg
    height: number; // cm
};

export type Lineup = {
    defenders: 1 | 2 | 3;
    attackers: 1 | 2 | 3;
};

export type Player = {
    id: number;
    name: string;
    weight: number;
    height: number;
    position: Position;
    universe: Universe;
};

type Team = {
    players: Player[];
    universe: Universe;
    name: string;
};

export type Match = {
    homeTeam: Team;
    awayTeam: Team;
}

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

type ActionPayload = {
    player?: Player;
    teamId?: 'first' | 'second';
};

export type Action = {
    event: SoccerEvent;
    paylod: ActionPayload;
};

export type TeamOverview = {
    score: number;
    passes: number;
    shots: number;
};
