import { useState } from "react";
import { useNavigate } from "react-router";
import { Field } from "../components/Field";
import { TeamTable } from '../components/TeamTable';
import { useGenerateTeam } from "../hooks/useGenerateTeam";
import type { Lineup } from "../domain";
import { useMatchProvider } from "../providers/MatchProvider";

const DEFAULT_LINEUP: Lineup = { defenders: 2, attackers: 2 };
const GENERIC_ERROR_MESSAGE = "An unexpected error occurred. Please try again later.";

export const TeamGeneration = () => {
    const [homeLineup, setHomeLineup] = useState<Lineup>(DEFAULT_LINEUP);
    const [awayLineup, setAwayLineup] = useState<Lineup>(DEFAULT_LINEUP);

    const homeTeam = useGenerateTeam('starwars', homeLineup);
    const awayTeam = useGenerateTeam('pokemon', awayLineup);

    const { setMatch } = useMatchProvider()

    const navigate = useNavigate();
    const bothGenerated = homeTeam.players.length > 0 && awayTeam.players.length > 0;

    const handlePlay = () => {
        setMatch({
            homeTeam: {
                players: homeTeam.players,
                universe: homeTeam.universe,
                name: homeTeam.name
            },
            awayTeam: {
                players: awayTeam.players,
                universe: awayTeam.universe,
                name: awayTeam.name
            }
        })
        navigate('/match-results');
    };

    return <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded mb-2 shadow">
            <span className="font-semibold text-sm">Lineup Settings</span>
            <button
                onClick={handlePlay}
                disabled={!bothGenerated}
                className="px-3 py-1.5 rounded bg-green-600 text-white text-sm font-medium
                    disabled:opacity-40 disabled:cursor-not-allowed
                    enabled:hover:bg-green-700 transition-colors"
            >
                ▶ Play
            </button>
        </div>
        <div className="flex-1 flex flex-row">
            <div className="h-full flex-1">
                <Field
                    onHomeLineupChange={setHomeLineup}
                    onAwayLineupChange={setAwayLineup}
                />
            </div>
            <div className="flex-1 flex flex-col ml-2">
                <div className="flex-1 mb-2">
                    <TeamTable
                        teamName={homeTeam.name}
                        players={homeTeam.players}
                        onGenerate={homeTeam.generate}
                        errorMessage={homeTeam.error ? GENERIC_ERROR_MESSAGE : undefined}
                        loading={homeTeam.isLoading}
                    />
                </div>
                <div className="flex-1 mt-2">
                    <TeamTable
                        teamName={awayTeam.name}
                        players={awayTeam.players}
                        onGenerate={awayTeam.generate}
                        errorMessage={awayTeam.error ? GENERIC_ERROR_MESSAGE : undefined}
                        loading={awayTeam.isLoading}
                    />
                </div>
            </div>
        </div>
    </div>
};
