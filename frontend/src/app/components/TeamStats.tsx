import React, { useState, useEffect } from 'react';
import MoneyballApi from '../api';
import { HittingStats, PitchingStats, FieldingStats, Stats } from '../types';
import { formatHittingStats, formatPitchingStats, formatFieldingStats } from '../utils';

interface TeamStatsProps {
    teamId: number;
    season: string;
}

const headers = {
    hitting: ['BA', 'HR', 'OBP', 'SLG', 'OPS', 'R', 'H', 'SO', 'SB', 'RBI'],
    pitching: ['ERA', 'SO', 'BB', 'WHIP', 'IP', 'W', 'L', 'SV', 'BS', 'K/BB'],
    fielding: ['FPCT', 'E', 'A', 'PO', 'CH', 'DP', 'TP', 'PB', 'TE', 'RF/G']
};

const TeamStats: React.FC<TeamStatsProps> = ({ teamId, season }) => {
    const [statsType, setStatsType] = useState<'hitting' | 'pitching' | 'fielding'>('hitting');
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);

            try {
                let data;
                switch (statsType) {
                    case 'hitting':
                        data = await MoneyballApi.getHittingStats(teamId);
                        setStats(formatHittingStats(data));
                        break;
                    case 'pitching':
                        data = await MoneyballApi.getPitchingStats(teamId);
                        setStats(formatPitchingStats(data));
                        break;
                    case 'fielding':
                        data = await MoneyballApi.getFieldingStats(teamId);
                        setStats(formatFieldingStats(data));
                        break;
                }
            } catch (err) {
                setError('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [teamId, statsType, season]);

    const handleTabClick = (type: 'hitting' | 'pitching' | 'fielding') => {
        setStatsType(type);
    };

    if (loading) {
        return <div className="text-center text-sky-900 mt-20">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-800 mt-20">{error}</div>;
    }

    const currentHeaders = headers[statsType];

    return (
        <div className="ml-16 lg:mx-0">
            <div className="flex mb-4">
                <button
                    className={`px-3 py-1.5 border rounded-md ${statsType === 'hitting' ? 'border-red-800 text-red-800' : 'border-transparent text-sky-900'} mx-0.5`}
                    onClick={() => handleTabClick('hitting')}
                >
                    Hitting
                </button>
                <button
                    className={`px-3 py-1.5 border rounded-md ${statsType === 'pitching' ? 'border-red-800 text-red-800' : 'border-transparent text-sky-900'} mx-0.5`}
                    onClick={() => handleTabClick('pitching')}
                >
                    Pitching
                </button>
                <button
                    className={`px-3 py-1.5 border rounded-md ${statsType === 'fielding' ? 'border-red-800 text-red-800' : 'border-transparent text-sky-900'} mx-0.5`}
                    onClick={() => handleTabClick('fielding')}
                >
                    Fielding
                </button>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    {currentHeaders.map((header, index) => (
                                        <th key={index} className="px-2 py-3.5 text-left text-sm font-medium bg-sky-50 text-sky-900">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    {stats && Object.values(stats).map((stat, index) => (
                                        <td key={index} className="px-2 py-4 text-sm text-sky-900 whitespace-nowrap">
                                            {stat}
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

export default TeamStats;
