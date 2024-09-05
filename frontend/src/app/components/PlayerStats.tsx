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
    strikeOuts: number;
};

type PitchingStats = {
    era: number;
    strikeOuts: number;
    whip: number;
    inningsPitched: number;
    wins: number;
    losses: number;
    saves: number;
    homeRunsAllowed: number;
    earnedRuns: number;
    strikeoutsPer9Inn: number;
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
    const [currentStatsType, setCurrentStatsType] = useState<'hitting' | 'pitching' | 'fielding'>(statsType);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                let fetchedStats: Stats | null = null;
                if (currentStatsType === 'hitting') {
                    fetchedStats = await MoneyballApi.getPlayerHittingStats(playerId);
                } else if (currentStatsType === 'pitching') {
                    fetchedStats = await MoneyballApi.getPlayerPitchingStats(playerId);
                } else if (currentStatsType === 'fielding') {
                    fetchedStats = await MoneyballApi.getPlayerFieldingStats(playerId);
                }
                if (fetchedStats) {
                    setStats(fetchedStats);
                } else {
                    setError(`No ${currentStatsType} stats found for player`);
                }
            } catch (err: any) {
                setError(`${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [playerId, currentStatsType]);

    const handleTabClick = (type: 'hitting' | 'pitching' | 'fielding') => {
        setCurrentStatsType(type);
    };

    if (loading) return <p>Loading...</p>;

    // Define headers based on stats type
    const headers = {
        hitting: [
            'Games', 'AB', 'H', 'HR', 'AVG', 'OBP', 'SLG', 'OPS', 'RBI', 'SO'
        ],
        pitching: [
            'ERA', 'SO', 'WHIP', 'IP', 'Wins', 'Losses', 'Saves', 'HR Allowed', 'Earned Runs', 'SO/9'
        ],
        fielding: [
            'Games', 'GS', 'Assists', 'PO', 'Errors', 'Chances', 'FPCT', 'RFG', 'RFG/9', 'IN', 'DP', 'TP', 'TE'
        ]
    };

    // Get appropriate headers based on currentStatsType
    const currentHeaders = headers[currentStatsType];

    // Split headers and stats into two parts
    const splitIndex = Math.ceil(currentHeaders.length / 2);
    const firstHeaders = currentHeaders.slice(0, splitIndex);
    const secondHeaders = currentHeaders.slice(splitIndex);
    const statsArray = stats ? Object.values(stats) : [];
    const firstHalf = statsArray.slice(0, splitIndex);
    const secondHalf = statsArray.slice(splitIndex);

    return (
        <div className="overflow-hidden bg-white ml-16 lg:ml-10 w-full">
            <div className="flex mb-4">
                <button
                    className={`px-3 py-1.5 border rounded-md ${currentStatsType === 'hitting' ? 'border-red-800 text-red-800' : 'border-transparent text-sky-900'} mx-0.5`}
                    onClick={() => handleTabClick('hitting')}
                >
                    Hitting
                </button>
                <button
                    className={`px-3 py-1.5 border rounded-md ${currentStatsType === 'pitching' ? 'border-red-800 text-red-800' : 'border-transparent text-sky-900'} mx-0.5`}
                    onClick={() => handleTabClick('pitching')}
                >
                    Pitching
                </button>
                <button
                    className={`px-3 py-1.5 border rounded-md ${currentStatsType === 'fielding' ? 'border-red-800 text-red-800' : 'border-transparent text-sky-900'} mx-0.5`}
                    onClick={() => handleTabClick('fielding')}
                >
                    Fielding
                </button>
            </div>
            <div className="">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                        {/* Render the first table with the first half of the headers and stats */}
                        <table className="min-w-full divide-y divide-gray-300 mb-4">
                            <thead className="">
                                <tr>
                                    {firstHeaders.map((header, index) => (
                                        <th key={index} className="px-2 py-3.5 text-left text-sm font-medium bg-sky-50 text-sky-900">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {error ? (
                                    <tr>
                                        <td colSpan={firstHeaders.length} className="px-2 py-4 text-sm text-sky-900 whitespace-nowrap">
                                            {error}
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {firstHalf.length > 0 && (
                                            <tr>
                                                {firstHalf.map((stat, index) => (
                                                    <td key={index} className="px-2 py-4 text-sm text-sky-900 whitespace-nowrap">
                                                        {stat}
                                                    </td>
                                                ))}
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                        {/* Render the second table with the second half of the headers and stats */}
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="">
                                <tr>
                                    {secondHeaders.map((header, index) => (
                                        <th key={index} className="px-2 py-3.5 text-left text-sm font-medium bg-sky-50 text-sky-900">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {error ? (
                                    <tr>
                                        <td colSpan={secondHeaders.length} className="px-2 py-4 text-sm text-sky-900 whitespace-nowrap">
                                            {error}
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {secondHalf.length > 0 && (
                                            <tr>
                                                {secondHalf.map((stat, index) => (
                                                    <td key={index} className="px-2 py-4 text-sm text-sky-900 whitespace-nowrap">
                                                        {stat}
                                                    </td>
                                                ))}
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerStats;
