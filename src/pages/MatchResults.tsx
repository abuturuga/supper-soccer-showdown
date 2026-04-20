import { computeMatchOverview } from "../logic/computeMatchOverview";
import { generateMatch } from "../logic/generateMatch";
import { useMatchProvider } from "../providers/MatchProvider";
import { ScoreBar } from "../components/ScoreBar";

export const MatchResults = () => {
    const { getMatch } = useMatchProvider();
    const matchLineup = getMatch();
    const actions = generateMatch(matchLineup.homeTeam.players, matchLineup.awayTeam.players);
    const overview = computeMatchOverview(actions, matchLineup.homeTeam.players, matchLineup.awayTeam.players);

    const homeScore = overview[matchLineup.homeTeam.universe]?.score ?? 0;
    const awayScore = overview[matchLineup.awayTeam.universe]?.score ?? 0;

    return (
        <div>
            <ScoreBar
                homeTeamName={matchLineup.homeTeam.name}
                awayTeamName={matchLineup.awayTeam.name}
                homeScore={homeScore}
                awayScore={awayScore}
            />
        </div>
    );
};
