import React, { useEffect, useState } from 'react';
import MoneyballApi from '../api';
import { Stats, StatsType } from '../types';
import { useStatsType } from '../hooks/useStatsType';

const PlayerStats: React.FC<{ playerId: number; statsType: StatsType }> = ({ playerId, statsType }) => {
    const { statsType: currentStatsType, handleTabClick } = useStatsType(statsType);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                let fetchedStats: Stats | null = null;
                switch (currentStatsType) {
                    case 'hitting':
                        fetchedStats = await MoneyballApi.getPlayerHittingStats(playerId);
                        break;
                    case 'pitching':
                        fetchedStats = await MoneyballApi.getPlayerPitchingStats(playerId);
                        break;
                    case 'fielding':
                        fetchedStats = await MoneyballApi.getPlayerFieldingStats(playerId);
                        break;
                    default:
                        throw new Error('Invalid stats type');
                }

                if (fetchedStats) {
                    setStats(fetchedStats);
                } else {
                    setError(`No ${currentStatsType} stats found for player`);
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [playerId, currentStatsType]);

    if (loading) return <p>Loading...</p>;

    // Define headers based on stats type
    const headers: Record<StatsType, string[]> = {
        hitting: ['Games', 'AB', 'H', 'HR', 'AVG', 'OBP', 'SLG', 'OPS', 'RBI', 'SO'],
        pitching: ['ERA', 'SO', 'WHIP', 'IP', 'Wins', 'Losses', 'Saves', 'HR Allowed', 'Earned Runs', 'SO/9'],
        fielding: ['Games', 'GS', 'Assists', 'PO', 'Errors', 'Chances', 'FPCT', 'RFG', 'RFG/9', 'IN', 'DP', 'TP', 'TE'],
    };

    const currentHeaders = headers[currentStatsType];
    const splitIndex = Math.ceil(currentHeaders.length / 2);
    const firstHeaders = currentHeaders.slice(0, splitIndex);
    const secondHeaders = currentHeaders.slice(splitIndex);
    const statsArray = stats ? Object.values(stats) : [];
    const firstHalf = statsArray.slice(0, splitIndex);
    const secondHalf = statsArray.slice(splitIndex);

    return (
        <div className="overflow-hidden bg-white mt-2 md:mt-0 md:ml-16 lg:ml-10 w-full">
            <div className="flex mb-4">
                {['hitting', 'pitching', 'fielding'].map((type) => (
                    <button
                        key={type}
                        className={`px-3 py-1.5 border rounded-md ${currentStatsType === type ? 'border-red-800 text-red-800' : 'border-transparent text-sky-900'} mx-0.5`}
                        onClick={() => handleTabClick(type as StatsType)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {error && <p className="text-sm font-medium text-sky-900">{error}</p>}

            <div className="">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                        {/* Render the first table with the first half of the headers and stats if stats exist */}
                        {stats ? (
                            <>
                                <table className="min-w-full divide-y divide-gray-300 mb-4">
                                    <thead>
                                        <tr>
                                            {firstHeaders.map((header, index) => (
                                                <th key={index} className="px-2 py-3.5 text-left text-sm font-medium bg-sky-50 text-sky-900">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        <tr>
                                            {firstHalf.map((stat, index) => (
                                                <td key={index} className="px-2 py-4 text-sm text-sky-900 whitespace-nowrap">
                                                    {stat}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            {secondHeaders.map((header, index) => (
                                                <th key={index} className="px-2 py-3.5 text-left text-sm font-medium bg-sky-50 text-sky-900">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        <tr>
                                            {secondHalf.map((stat, index) => (
                                                <td key={index} className="px-2 py-4 text-sm text-sky-900 whitespace-nowrap">
                                                    {stat}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerStats;
