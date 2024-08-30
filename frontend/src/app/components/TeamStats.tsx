import React, { useState, useEffect } from 'react';
import MoneyballApi from '../api';

interface TeamStatsProps {
    teamId: number;
    season: string;
}

const formatHittingStats = (stats: any) => ({
    avg: stats.avg || 'N/A',
    hr: stats.hr || 'N/A',
    obp: stats.obp || 'N/A',
    slg: stats.slg || 'N/A',
    ops: stats.ops || 'N/A',
    r: stats.r || 'N/A',
    h: stats.h || 'N/A',
    so: stats.so || 'N/A',
    sb: stats.sb || 'N/A',
    rbi: stats.rbi || 'N/A',
    bb: stats.bb || 'N/A',
    babip: stats.babip || 'N/A',
});

const formatPitchingStats = (stats: any) => ({
    era: stats.era || 'N/A',
    so: stats.so || 'N/A',
    bb: stats.bb || 'N/A',
    whip: stats.whip || 'N/A',
});

const formatFieldingStats = (stats: any) => ({
    fpct: stats.fpct || 'N/A',
    e: stats.e || 'N/A',
    dp: stats.dp || 'N/A',
});

const TeamStats: React.FC<TeamStatsProps> = ({ teamId, season }) => {
    const [statsType, setStatsType] = useState<'hitting' | 'pitching' | 'fielding'>('hitting');
    const [stats, setStats] = useState<any>(null);
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

    return (
        <div className="px-6 sm:px-14 lg:px-20 my-10">
            <div className="flex mb-4">
                <button
                    className={`px-4 py-2 rounded ${statsType === 'hitting' ? 'bg-sky-900 text-white' : 'bg-white text-sky-900 border-sky-900 border'} mx-0.5`}
                    onClick={() => handleTabClick('hitting')}
                >
                    Hitting
                </button>
                <button
                    className={`px-4 py-2 rounded ${statsType === 'pitching' ? 'bg-sky-900 text-white' : 'bg-white text-sky-900 border-sky-900 border'} mx-0.5`}
                    onClick={() => handleTabClick('pitching')}
                >
                    Pitching
                </button>
                <button
                    className={`px-4 py-2 rounded ${statsType === 'fielding' ? 'bg-sky-900 text-white' : 'bg-white text-sky-900 border-sky-900 border'} mx-0.5`}
                    onClick={() => handleTabClick('fielding')}
                >
                    Fielding
                </button>
            </div>
            <div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        {statsType === 'hitting' && (
                                            <>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">AVG</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">HR</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">OBP</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">SLG</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">OPS</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">R</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">H</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">SO</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">SB</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">RBI</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">BB</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">BABIP</th>
                                            </>
                                        )}
                                        {statsType === 'pitching' && (
                                            <>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">ERA</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">SO</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">BB</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">WHIP</th>
                                            </>
                                        )}
                                        {statsType === 'fielding' && (
                                            <>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">FPCT</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">E</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">DP</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sky-200 bg-white">
                                    <tr>
                                        {statsType === 'hitting' && (
                                            <>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.avg}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.hr}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.obp}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.slg}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.ops}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.r}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.h}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.so}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.sb}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.rbi}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.bb}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.babip}</td>
                                            </>
                                        )}
                                        {statsType === 'pitching' && (
                                            <>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.era}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.so}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.bb}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.whip}</td>
                                            </>
                                        )}
                                        {statsType === 'fielding' && (
                                            <>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.fpct}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.e}</td>
                                                <td className="px-2 py-2 text-sm text-gray-500">{stats.dp}</td>
                                            </>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamStats;
