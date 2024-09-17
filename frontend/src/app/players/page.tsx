"use client"

import { useEffect, useState } from "react";
import MoneyballApi from "../api";
import Image from "next/image";
import { Player } from "../types";

export default function Players() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
    const [favoritePlayers, setFavoritePlayers] = useState<number[]>(() => {
        // Initialize state from localStorage
        const storedFavorites = localStorage.getItem("favoritePlayers");
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });


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

    // Add or remove a team to/from the favorites list
    const handleFavoriteClick = (playerId: number) => {
        setFavoritePlayers(prevFavorites => {
            const updatedFavorites = prevFavorites.includes(playerId)
                ? prevFavorites.filter(id => id !== playerId) // Remove from favorites
                : [...prevFavorites, playerId]; // Add to favorites

            localStorage.setItem("favoritePlayers", JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };


    return (
        <div className="min-h-screen bg-white py-8 px-16">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
                {filteredPlayers.map((player, index) => {
                    const imgUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${player.id}/headshot/67/current`;
                    const isFavorite = favoritePlayers.includes(player.id);

                    return (
                        <div
                            key={player.id}
                            className="bg-white text-red-800 text-sm p-4 rounded-lg shadow-xl border border-gray-100 flex hover:shadow-2xl"
                        >
                            <Image
                                src={imgUrl}
                                alt={`${player.fullName}`}
                                className="rounded-md"
                                width={220}
                                height={0}
                            />
                            <div className="ml-8">
                                <button
                                    onClick={() => handleFavoriteClick(player.id)}
                                    className={`rounded-md mt-4 shadow-sm border border-gray-100 text-xs ${isFavorite ? 'bg-sky-900 hover:bg-red-800' : 'bg-red-800 hover:bg-sky-900'
                                        }  font-normal px-3 py-2 text-white`}
                                >
                                    {isFavorite ? "Remove from favorites" : "Add to favorites"}
                                </button>
                                <h2 className="text-2xl text-sky-900 font-bold my-2">
                                    {index + 1}. {player.fullName}

                                </h2>
                                <p className="mb-1">Team: <span className="text-sky-900 ">{player.currentTeam.name}</span></p>
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
                    );
                })
                }
            </div>
            {isLoading && <p className="text-center text-gray-500">Loading players...</p>}
        </div>
    );
}
