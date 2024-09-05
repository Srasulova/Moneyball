import React from 'react';
import Image from 'next/image';
import PlayerStats from './PlayerStats'; // Ensure this is the correct import path

interface PlayerDashboardProps {
    playerId: number;
    playerSummary: {
        id: number;
        fullName: string;
        currentTeam: {
            name: string;
        };
        primaryPosition: string;
        primaryNumber: number;
        batSide: string;
        pitchingHand: string;
    } | null;
    statsType: 'hitting' | 'pitching' | 'fielding';
}

const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ playerId, playerSummary, statsType }) => {
    if (!playerSummary) {
        return <div className="text-center text-sky-900 mt-20">Loading...</div>;
    }

    const handleRemoveFromFavorites = () => {
        // Retrieve the favoritePlayers array from localStorage
        const favoritePlayers = JSON.parse(localStorage.getItem('favoritePlayers') || '[]');

        // Filter out the playerId to remove
        const updatedFavorites = favoritePlayers.filter((id: number) => id !== playerId);

        // Update localStorage with the filtered array
        localStorage.setItem('favoritePlayers', JSON.stringify(updatedFavorites));

        // Redirect to the home page
        window.location.href = '/';
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg max-w-3xl mx-auto my-4 border border-gray-100 flex flex-col items-center">
            <div className="flex">
                <div className="mb-6">
                    <div className="flex mb-4 items-center">
                        <Image
                            src={`https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${playerId}/headshot/67/current`}
                            alt={`${playerSummary.fullName} photo`}
                            width={40}
                            height={40}
                            className="mr-2"
                        />
                        <h2 className="text-2xl font-medium text-red-800">{playerSummary.fullName}</h2>
                    </div>
                    <div>
                        <p className="text-base text-red-800">Team: <span className="text-sky-900">{playerSummary.currentTeam.name}</span></p>
                        <p className="text-base text-red-800">Number: <span className="text-sky-900">{playerSummary.primaryNumber}</span></p>
                        <p className="text-base text-red-800">Position: <span className="text-sky-900">{playerSummary.primaryPosition}</span></p>
                        <p className="text-base text-red-800">Batside: <span className="text-sky-900">{playerSummary.batSide}</span></p>
                        <p className="text-base text-red-800">Pitching Hand: <span className="text-sky-900">{playerSummary.pitchingHand}</span></p>
                    </div>
                </div>
                {/* <PlayerStats playerId={playerId} statsType={statsType} /> */}
            </div>
            <button
                onClick={handleRemoveFromFavorites}
                className="text-base rounded-md px-3 py-1.5 bg-red-800 text-white"
            >
                Remove from favorites
            </button>
        </div>
    );
};

export default PlayerDashboard;
