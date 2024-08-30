"use client"

import { useEffect, useState } from "react";
import MoneyballApi from "../api";
import Image from "next/image";

type Team = {
    id: number;
    name: string;
    firstYearOfPlay: string;
    leagueName: string;
    divisionName: string;
    locationName: string;
};

export default function Teams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
    const [favoriteTeams, setFavoriteTeams] = useState<number[]>(() => {
        // Initialize state from localStorage
        const storedFavorites = localStorage.getItem("favoriteTeams");
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });

    useEffect(() => {
        async function fetchTeams() {
            try {
                const data = await MoneyballApi.getMlbTeams();
                setTeams(data);
                setFilteredTeams(data);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            }
        }
        fetchTeams();
    }, []);

    useEffect(() => {
        // Filter teams based on search term
        setFilteredTeams(
            teams.filter(team =>
                team.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, teams]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Add or remove a team to/from the favorites list
    const handleFavoriteClick = (teamId: number) => {
        setFavoriteTeams(prevFavorites => {
            const updatedFavorites = prevFavorites.includes(teamId)
                ? prevFavorites.filter(id => id !== teamId) // Remove from favorites
                : [...prevFavorites, teamId]; // Add to favorites

            localStorage.setItem("favoriteTeams", JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    return (
        <div className="min-h-screen bg-white py-8 px-8">
            <h1 className="text-red-800 text-4xl font-bold text-center mb-8">
                MLB Teams
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTeams.map((team) => {
                    const logoUrl = `https://www.mlbstatic.com/team-logos/team-cap-on-light/${team.id}.svg`;
                    const isFavorite = favoriteTeams.includes(team.id);

                    return (
                        <div
                            key={team.id}
                            className="bg-white text-red-800 text-base p-4 rounded-lg shadow-xl border border-gray-100 hover:shadow-2xl"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <Image
                                    src={logoUrl}
                                    alt={`${team.name} logo`}
                                    width={40}
                                    height={40}
                                    className="mr-2"
                                />
                                <h2 className="text-2xl text-sky-900 font-bold text-center">{team.name}</h2>
                            </div>
                            <p>Location: <span className="text-sky-900">{team.locationName}</span></p>
                            <p>First Year of Play: <span className="text-sky-900">{team.firstYearOfPlay}</span></p>
                            <p>League: <span className="text-sky-900">{team.leagueName}</span></p>
                            <p>Division: <span className="text-sky-900">{team.divisionName}</span></p>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleFavoriteClick(team.id)}
                                    className={`rounded-md mt-4 shadow-sm border border-gray-100 text-xs ${isFavorite ? 'bg-sky-900 hover:bg-red-800' : 'bg-red-800 hover:bg-sky-900'
                                        }  font-normal px-3 py-2 text-white`}
                                >
                                    {isFavorite ? "Remove from favorites" : "Add to favorites"}
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}


