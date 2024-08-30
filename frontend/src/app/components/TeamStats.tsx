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
    r: stats.runs || 'N/A',
    h: stats.hits || 'N/A',
    so: stats.strikeOuts || 'N/A',
    sb: stats.stolenBases || 'N/A',
    rbi: stats.rbi || 'N/A',
    bb: stats.baseOnBalls || 'N/A',
    babip: stats.babip || 'N/A',
});

const formatPitchingStats = (stats: any) => ({
    era: stats.era || 'N/A',
    so: stats.strikeOuts || 'N/A',
    bb: stats.baseOnBalls || 'N/A',
    whip: stats.whip || 'N/A',
    ip: stats.inningsPitched || 'N/A',
    wins: stats.wins || 'N/A',
    losses: stats.losses || 'N/A',
    saves: stats.saves || 'N/A',
    holds: stats.holds || 'N/A',
    blownSaves: stats.blownSaves || 'N/A',
    strikePercentage: stats.strikePercentage || 'N/A',
    strikeoutWalkRatio: stats.strikeoutWalkRatio || 'N/A',
    strikeoutsPer9Inn: stats.strikeoutsPer9Inn || 'N/A',
    walksPer9Inn: stats.walksPer9Inn || 'N/A',
    hitsPer9Inn: stats.hitsPer9Inn || 'N/A',
    homeRunsPer9: stats.homeRunsPer9 || 'N/A',
    winPercentage: stats.winPercentage || 'N/A',
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
    rangeFactorPer9Inn: stats.rangeFactorPer9Inn || 'N/A',
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
            <div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        {statsType === 'hitting' && (
                                            <>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Batting Average">BA</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Home Runs">HR</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="On-base Percentage">OBP</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Slugging Percentage">SLG</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="On-base Plus Slugging">OPS</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Runs Scored">R</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Hits">H</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Strikeouts">SO</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Stolen Bases">SB</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Runs Batted In">RBI</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Base on Balls">BB</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Batting Average on Balls in Play">BABIP</th>
                                            </>
                                        )}
                                        {statsType === 'pitching' && (
                                            <>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Earned Run Average">ERA</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Strikeouts">SO</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Base on Balls">BB</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Walks and Hits per Inning Pitched">WHIP</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Innings Pitched">IP</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Wins">W</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Losses">L</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Saves">SV</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Holds">HLD</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Blown Saves">BS</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Strikeout Percentage">SO%</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Strikeout to Walk Ratio">SO/BB</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Strikeouts per 9 Innings">SO/9</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Walks per 9 Innings">BB/9</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Hits per 9 Innings">H/9</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Home Runs per 9 Innings">HR/9</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Win Percentage">W%</th>
                                            </>
                                        )}
                                        {statsType === 'fielding' && (
                                            <>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Fielding Percentage">FPCT</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Errors">E</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Assists">A</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Put Outs">PO</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Chances">CH</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Double Plays">DP</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Triple Plays">TP</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Passed Balls">PB</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Throwing Errors">TE</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Range Factor per Game">RF/G</th>
                                                <th className="px-2 py-3.5 text-left text-sm font-medium text-sky-900" title="Range Factor per 9 Innings">RF/9</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        {Object.values(stats).map((stat, index) => (
                                            <td key={index} className="px-2 py-4 text-sm text-gray-700">
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
        </div>
    );
};

export default TeamStats;
