import React, { useState, useEffect } from 'react';
import MoneyballApi from '../api';

interface TeamStatsProps {
    teamId: number;
    season: string;
}

const formatHittingStats = (stats: any) => ({
    avg: stats.avg || 'N/A',           // Batting average
    hr: stats.homeRuns || 'N/A',       // Home runs
    obp: stats.obp || 'N/A',           // On-base percentage
    slg: stats.slg || 'N/A',           // Slugging percentage
    ops: stats.ops || 'N/A',           // On-base plus slugging
    r: stats.runs || 'N/A',            // Runs scored
    h: stats.hits || 'N/A',            // Hits
    so: stats.strikeOuts || 'N/A',     // Strikeouts
    sb: stats.stolenBases || 'N/A',    // Stolen bases
    rbi: stats.rbi || 'N/A'            // Runs batted in
});

const formatPitchingStats = (stats: any) => ({
    era: stats.era || 'N/A',
    so: stats.so || 'N/A',
    bb: stats.bb || 'N/A',
    whip: stats.whip || 'N/A',
    ip: stats.ip || 'N/A',
    wins: stats.wins || 'N/A',
    losses: stats.losses || 'N/A',
    saves: stats.saves || 'N/A',
    blownSaves: stats.blownSaves || 'N/A',
    strikeoutWalkRatio: stats.strikeoutWalkRatio || 'N/A',
});

const formatFieldingStats = (stats: any) => ({
    fpct: stats.fielding || 'N/A',
    errors: stats.errors || 'N/A',
    assists: stats.assists || 'N/A',
    putOuts: stats.putOuts || 'N/A',
    chances: stats.chances || 'N/A',
    doublePlays: stats.doublePlays || 'N/A',
    triplePlays: stats.triplePlays || 'N/A',
    passedBall: stats.passedBall || 'N/A',
    throwingErrors: stats.throwingErrors || 'N/A',
    rangeFactorPerGame: stats.rangeFactorPerGame || 'N/A',
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
        <div className="px-6 sm:px-10">
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
                                    {statsType === 'hitting' && (
                                        <>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">BA</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">HR</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">OBP</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">SLG</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">OPS</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">R</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">H</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">SO</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">SB</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">RBI</th>
                                        </>
                                    )}
                                    {statsType === 'pitching' && (
                                        <>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">ERA</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">SO</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">BB</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">WHIP</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">IP</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">W</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">L</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">SV</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">BS</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">K/BB</th>
                                        </>
                                    )}

                                    {statsType === 'fielding' && (
                                        <>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">FPCT</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">E</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">A</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">PO</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">CH</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">DP</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">TP</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">PB</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">TE</th>
                                            <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900">RF/G</th>
                                        </>
                                    )}

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    {Object.values(stats).map((stat: any, index: number) => (
                                        <td key={index} className="px-2 py-4 text-sm text-sky-900 whitespace-nowrap">{stat}</td>
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
