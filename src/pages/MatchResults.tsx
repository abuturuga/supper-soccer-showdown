import { useMemo } from "react";
import { Navigate } from "react-router";
import { computeMatchOverview } from "../logic/computeMatchOverview";
import { generateMatch } from "../logic/generateMatch";
import { useMatchProvider } from "../providers/MatchProvider";
import { ScoreBar } from "../components/ScoreBar";

export const MatchResults = () => {
    const { match: matchLineup } = useMatchProvider();

    const { overview } = useMemo(() => {
        if (!matchLineup) return { actions: [], overview: null };
        const actions = generateMatch(matchLineup.homeTeam.players, matchLineup.awayTeam.players);
        const overview = computeMatchOverview(actions, matchLineup.homeTeam.players, matchLineup.awayTeam.players);
        return { overview };
    }, [matchLineup]);

    if (!matchLineup || !overview) return <Navigate to="/" replace />;

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
