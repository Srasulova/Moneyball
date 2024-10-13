import React from 'react';
import Image from 'next/image';
import PlayerStats from './PlayerStats';
import { PlayerGeneralInfo } from '../types';
import UnfollowButton from './UnfollowButton';
import { handleRemoveFromFavorites } from '../utils';

interface PlayerDashboardProps {
    playerSummary: PlayerGeneralInfo | null;
    statsType: 'hitting' | 'pitching' | 'fielding';
}

const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ playerSummary, statsType }) => {
    if (!playerSummary) {
        return <div className="text-center text-sky-900">Loading...</div>;
    }

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg max-w-3xl mx-auto my-2 border border-gray-100 flex flex-col items-center w-full">
            {/* Parent container: uses different flex layouts depending on screen size */}
            <div className="flex flex-col sm:flex-row sm:items-start w-full">
                {/* On small screens, the h2 appears first, followed by image and details */}
                <div className="flex flex-col items-center sm:items-start mb-6">
                    {/* Player Name */}
                    <h2 className="text-2xl font-medium text-red-800">{playerSummary.fullName}</h2>

                    {/* On medium and larger screens, Image and name align horizontally */}
                    <div className="flex sm:items-center space-x-4 my-4">
                        {/* Player Image */}
                        <Image
                            src={`https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${playerSummary.id}/headshot/67/current`}
                            alt={`${playerSummary.fullName} photo`}
                            width={80}
                            height={40}
                            className="rounded-md"
                        />

                        {/* Player Details */}
                        <div className="flex flex-col items-start sm:items-start">
                            <p className="text-base text-red-800">Team: <span className="text-sky-900">{playerSummary.currentTeam.name}</span></p>
                            <p className="text-base text-red-800">Number: <span className="text-sky-900">{playerSummary.primaryNumber || 'N/A'}</span></p>
                            <p className="text-base text-red-800">Position: <span className="text-sky-900">{playerSummary.primaryPosition}</span></p>
                            <p className="text-base text-red-800">Batside: <span className="text-sky-900">{playerSummary.batSide || 'N/A'}</span></p>
                            <p className="text-base text-red-800">Pitching Hand: <span className="text-sky-900">{playerSummary.pitchingHand || 'N/A'}</span></p>
                        </div>
                    </div>
                </div>

                {/* Player Stats Section */}
                <div className="flex justify-center w-full sm:w-auto">
                    <PlayerStats playerId={playerSummary.id} statsType={statsType} />
                </div>
            </div>

            {/* Unfollow Button */}
            <UnfollowButton removeFromFavorites={() => handleRemoveFromFavorites('player', playerSummary.id)} />
        </div>
    );
};

export default PlayerDashboard;
