import type { Player } from "../domain";

type Props = {
    teamName: string;
    players: Player[];
    onGenerate: () => void;
    errorMessage?: string;
};

export const TeamTable = ({ teamName, players, onGenerate, errorMessage }: Props) => {
    const isEmpty = players.length === 0;

    return (
        <div className="flex flex-col gap-2 bg-white h-full border-2 border-b-mauve-900">
            <h2 className="text-lg font-bold">{teamName}</h2>

            {isEmpty ? (
                <div className="flex flex-col items-center gap-2 py-8">
                    <button
                        onClick={onGenerate}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Generate
                    </button>
                    {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                </div>
            ) : (
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-gray-300 text-left">
                            <th className="py-1 pr-3">Pos</th>
                            <th className="py-1 pr-3">Name</th>
                            <th className="py-1 pr-3">Weight</th>
                            <th className="py-1">Height</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.id} className="border-b border-gray-100">
                                <td className="py-1 pr-3">{player.position}</td>
                                <td className="py-1 pr-3">{player.name}</td>
                                <td className="py-1 pr-3">{player.weight}</td>
                                <td className="py-1">{player.height}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
