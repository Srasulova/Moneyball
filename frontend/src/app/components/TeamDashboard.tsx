// TeamDashboard.tsx
import React from "react";

interface TeamDashboardProps {
    teamId: number;
    season: string;
    teamSummary: {
        leagueName: string;
        leagueRank: number;
        recentScores: {
            date: string;
            opponent: string;
            result: string;
            score: string;
        }[];
        playerLeaders: {
            name: string;
            statistic: string;
            value: string;
        }[];
    } | null;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamSummary }) => {
    if (!teamSummary) {
        return <div className="text-center text-sky-900">Loading...</div>;
    }

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-sky-900 mb-4">Team Dashboard</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-sky-900">League Information</h2>
                <p className="text-lg text-red-800">League: {teamSummary.leagueName}</p>
                <p className="text-lg text-red-800">Rank: {teamSummary.leagueRank}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-sky-900">Recent Scores</h2>
                <ul>
                    {teamSummary.recentScores.map((score, index) => (
                        <li key={index} className="text-lg text-gray-700">
                            {score.date} - {score.opponent} - {score.result} - {score.score}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-sky-900">Player Leaders</h2>
                <ul>
                    {teamSummary.playerLeaders.map((leader, index) => (
                        <li key={index} className="text-lg text-gray-700">
                            {leader.name}: {leader.statistic} - {leader.value}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TeamDashboard;
