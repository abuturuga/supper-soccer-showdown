type Props = {
    homeTeamName: string;
    awayTeamName: string;
    homeScore: number;
    awayScore: number;
};

export const ScoreBar = ({ homeTeamName, awayTeamName, homeScore, awayScore }: Props) => (
    <div className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white text-2xl font-bold rounded-xl shadow">
        <span>{homeTeamName}</span>
        <span>{homeScore} - {awayScore}</span>
        <span>{awayTeamName}</span>
    </div>
);
