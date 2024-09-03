import React, { useEffect, useState } from 'react';
import MoneyballApi from '../api';

// Define types for different stats
type HittingStats = {
    gamesPlayed: number;
    atBats: number;
    hits: number;
    homeRuns: number;
    avg: number;
    obp: number;
    slg: number;
    ops: number;
    rbi: number;
    runs: number;
    strikeOuts: number;
    stolenBases: number;
};

type PitchingStats = {
    gamesPlayed: number;
    era: number;
    strikeOuts: number;
    baseOnBalls: number;
    whip: number;
    inningsPitched: number;
    wins: number;
    losses: number;
    saves: number;
    homeRunsAllowed: number;
    hitsAllowed: number;
    earnedRuns: number;
};

type FieldingStats = {
    gamesPlayed: number;
    gamesStarted: number;
    assists: number;
    putOuts: number;
    errors: number;
    chances: number;
    fieldingPercentage: number;
    rangeFactorPerGame: number;
    rangeFactorPer9Inn: number;
    innings: number;
    doublePlays: number;
    triplePlays: number;
    throwingErrors: number;
};

type Stats = HittingStats | PitchingStats | FieldingStats;

const PlayerStats: React.FC<{ playerId: number; statsType: 'hitting' | 'pitching' | 'fielding' }> = ({ playerId, statsType }) => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                let fetchedStats: Stats | null = null;
                if (statsType === 'hitting') {
                    fetchedStats = await MoneyballApi.getPlayerHittingStats(playerId);
                } else if (statsType === 'pitching') {
                    fetchedStats = await MoneyballApi.getPlayerPitchingStats(playerId);
                } else if (statsType === 'fielding') {
                    fetchedStats = await MoneyballApi.getPlayerFieldingStats(playerId);
                }
                setStats(fetchedStats);
            } catch (err: any) {
                setError(`Failed to fetch stats: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [playerId, statsType]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    if (!stats) return <p>No stats available</p>;

    // Define headers based on stats type
    const headers = {
        hitting: [
            'Games', 'AB', 'H', 'HR', 'AVG', 'OBP', 'SLG', 'OPS', 'RBI', 'Runs'
        ],
        pitching: [
            'Games', 'ERA', 'SO', 'BB', 'WHIP', 'IP', 'Wins', 'Losses', 'Saves', 'HR Allowed', 'Earned Runs'
        ],
        fielding: [
            'Games', 'GS', 'Assists', 'PO', 'Errors', 'Chances', 'FPCT', 'RFG', 'RFG/9', 'IN', 'DP', 'TP', 'TE'
        ]
    };

    // Get appropriate headers based on statsType
    const currentHeaders = headers[statsType];

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {statsType.charAt(0).toUpperCase() + statsType.slice(1)} Stats
                </h3>
            </div>
            <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    {currentHeaders.map((header, index) => (
                                        <th key={index} className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                    {Object.values(stats).map((stat, index) => (
                                        <td key={index} className="px-2 py-4 text-sm text-sky-900 whitespace-nowrap">
                                            {typeof stat === 'number' ? stat.toFixed(3) : stat}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerStats;
