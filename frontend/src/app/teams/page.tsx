"use client";

import { useEffect, useState } from "react";
import MoneyballApi from "../api";
import Image from "next/image";
import { Team } from "../types";
import User from "../apiClient";
import FavoriteButton from "../components/FavoriteButton";

export default function Teams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
    const [favoriteTeams, setFavoriteTeams] = useState<number[]>([]);

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
        async function fetchFavoriteTeams() {
            try {
                const response = await User.getFavoriteTeams();
                const favorites = response.favoriteTeams;
                setFavoriteTeams(favorites);
            } catch (error) {
                console.error("Failed to fetch favorite teams:", error);
            }
        }
        fetchFavoriteTeams();
    }, []);

    useEffect(() => {
        setFilteredTeams(
            teams.filter(team =>
                team.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, teams]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFavoriteClick = async (teamId: number) => {
        try {
            const isFavorite = favoriteTeams.includes(teamId);

            if (isFavorite) {
                await User.deleteFavoriteTeam(teamId);
            } else {
                await User.addFavoriteTeam(teamId);
            }

            const response = await User.getFavoriteTeams();
            const favorites = response.favoriteTeams;
            setFavoriteTeams(favorites);

        } catch (error) {
            console.error("Failed to update favorite teams:", error);
        }
    };

    return (
        <div className="min-h-screen bg-white py-8 px-8 sm:px-16">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeams.map((team) => {
                    const logoUrl = `https://www.mlbstatic.com/team-logos/team-cap-on-light/${team.id}.svg`;
                    const isFavorite = favoriteTeams.includes(team.id);

                    return (
                        <div
                            key={team.id}
                            className="bg-white text-red-800 text-base py-4 px-10 rounded-lg shadow-xl border border-gray-100 hover:shadow-2xl"
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
                            </div >
                            <div className="">
                                <p className="">Location: <span className="text-sky-900">{team.locationName}</span></p>
                                <p>First Year of Play: <span className="text-sky-900">{team.firstYearOfPlay}</span></p>
                                <p>League: <span className="text-sky-900">{team.league.name}</span></p>
                                <p>Division: <span className="text-sky-900">{team.division.name}</span></p>
                            </div>

                            <div className="flex justify-center">
                                <FavoriteButton
                                    isFavorite={isFavorite}
                                    onClick={() => handleFavoriteClick(team.id)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
