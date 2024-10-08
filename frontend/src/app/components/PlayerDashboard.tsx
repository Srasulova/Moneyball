import React from 'react';
import Image from 'next/image';
import PlayerStats from './PlayerStats';
import { Player } from '../types';
import UnfollowButton from './UnfollowButton';
import { handleRemoveFromFavorites } from '../utils';

interface PlayerDashboardProps {
    playerSummary: Player | null;
    statsType: 'hitting' | 'pitching' | 'fielding';
}

const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ playerSummary, statsType }) => {
    if (!playerSummary) {
        return <div className="text-center text-sky-900">Loading...</div>;
    }

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg max-w-3xl mx-auto my-2 border border-gray-100 flex flex-col items-center w-full">
            <div className="flex">
                <div className="mb-6">
                    <div className="flex mb-4 items-center">
                        <Image
                            src={`https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${playerSummary.id}/headshot/67/current`}
                            alt={`${playerSummary.fullName} photo`}
                            width={80}
                            height={40}
                            className="mr-2 rounded-md"
                        />
                        <h2 className="text-2xl font-medium text-red-800">{playerSummary.fullName}</h2>
                    </div>
                    <div>
                        <p className="text-base text-red-800">Team: <span className="text-sky-900">{playerSummary.currentTeam.name}</span></p>
                        <p className="text-base text-red-800">Number: <span className="text-sky-900">{playerSummary.primaryNumber || 'N/A'}</span></p>
                        <p className="text-base text-red-800">Position: <span className="text-sky-900">{playerSummary.primaryPosition.name}</span></p>
                        <p className="text-base text-red-800">Batside: <span className="text-sky-900">{playerSummary.batSide?.description || 'N/A'}</span></p>
                        <p className="text-base text-red-800">Pitching Hand: <span className="text-sky-900">{playerSummary.pitchingHand?.description || 'N/A'}</span></p>
                    </div>
                </div>
                <PlayerStats playerId={playerSummary.id} statsType={statsType} />
            </div>
            <UnfollowButton removeFromFavorites={() => handleRemoveFromFavorites('player', playerSummary.id)} />
        </div>
    );
};

export default PlayerDashboard;
