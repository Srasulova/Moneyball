"use client"

import { useEffect, useState } from "react";
import MoneyballApi from "../api";
import Image from "next/image";
import { Player } from "../types";
import User from "../apiClient";
import FavoriteButton from "../components/FavoriteButton";

export default function Players() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
    const [favoritePlayers, setFavoritePlayers] = useState<any[]>([]);

    useEffect(() => {
        async function fetchPlayers() {
            try {
                setIsLoading(true);
                const data = await MoneyballApi.getMlbPlayers();

                setPlayers(data);

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch players:", error);
                setIsLoading(false);
            }
        }

        fetchPlayers();
    }, []);


    // Fetch the favorite players from the API
    useEffect(() => {
        async function fetchFavoritePlayers() {
            try {
                const response = await User.getFavoritePlayers()
                const favorites = response.favoritePlayers;
                setFavoritePlayers(favorites);
            } catch (error) {
                console.error("Failed to fetch favorite teams:", error);
            }
        }
        fetchFavoritePlayers();
    }, []);

    useEffect(() => {
        // Filter teams based on search term
        setFilteredPlayers(
            players.filter(player =>
                player.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, players]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };


    // Add or remove a player to/from the favorites list and update the API
    const handleFavoriteClick = async (playerId: number) => {
        try {
            const isFavorite = favoritePlayers.includes(playerId);

            if (isFavorite) {
                await User.deleteFavoritePlayer(playerId);
            } else {
                // Prevent adding the same player if it's already in the favorites
                const response = await User.getFavoritePlayers();
                const updatedFavorites = response.favoritePlayers;

                if (updatedFavorites.includes(playerId)) {
                    console.warn("Player is already in favorites");
                    return; // Prevent adding the player again
                }

                await User.addFavoritePlayer(playerId);
            }

            // Fetch the updated list of favorite players from the API
            const response = await User.getFavoritePlayers();
            const updatedFavorites = response.favoritePlayers;

            setFavoritePlayers(updatedFavorites); // Update the state with the new favorites list

        } catch (err) {
            console.error("Failed to update favorite players:", err);
        }
    };



    return (
        <div className="min-h-screen bg-white py-8 px-8 md:px-16">
            <h1 className="text-red-800 text-4xl font-bold text-center mb-8">
                MLB Players
            </h1>
            <div className="mb-8 flex justify-center">
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-1/2 p-2 border border-gray-300 rounded-full text-sky-900 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filteredPlayers.map((player, index) => {
                    const imgUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${player.id}/headshot/67/current`;
                    const isFavorite = favoritePlayers.includes(player.id);

                    return (
                        <div
                            key={player.id}
                            className="bg-white text-red-800 text-sm py-4 sm:p-4 rounded-lg shadow-xl border border-gray-100 flex flex-col items-center sm:flex-row hover:shadow-2xl"
                        >
                            <Image
                                src={imgUrl}
                                alt={`${player.fullName}`}
                                className="rounded-md"
                                width={220}
                                height={0}
                            />
                            <div className="sm:ml-8 text-center sm:text-left">
                                <FavoriteButton
                                    isFavorite={isFavorite}
                                    onClick={() => handleFavoriteClick(player.id)}
                                />
                                <h2 className="text-2xl text-sky-900 font-bold my-4">
                                    {player.fullName}
                                </h2>
                                {/* Apply grid layout for the <p> elements */}
                                <div className="grid grid-cols-2 gap-x-8 sm:grid-cols-1 text-left">
                                    <p className="mb-1">Team: <span className="text-sky-900">{player.currentTeam.name}</span></p>
                                    <p className="mb-1">Position: <span className="text-sky-900">{player.primaryPosition.name}</span></p>
                                    <p className="mb-1">Height: <span className="text-sky-900">{player.height}</span></p>
                                    <p className="mb-1">Weight: <span className="text-sky-900">{player.weight} lbs</span></p>
                                    <p className="mb-1">Age: <span className="text-sky-900">{player.currentAge}</span></p>
                                    <p className="mb-1">Birth City: <span className="text-sky-900">{player.birthCity}</span></p>
                                    <p className="mb-1">Birth State/Province: <span className="text-sky-900">{player.birthStateProvince}</span></p>
                                    <p className="mb-1">Birth Country: <span className="text-sky-900">{player.birthCountry}</span></p>
                                    <p className="mb-1">Debut: <span className="text-sky-900">{player.mlbDebutDate}</span></p>
                                    <p className="mb-1">Draft: <span className="text-sky-900">{player.draftYear}</span></p>
                                </div>
                            </div>
                        </div>

                    );
                })
                }
            </div>
            {isLoading && <p className="text-center text-gray-500">Loading players...</p>}
        </div>
    );
}
