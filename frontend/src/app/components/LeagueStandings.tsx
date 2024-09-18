import { useState, useEffect } from "react";
import Image from "next/image";
import { LeagueStanding } from "../types";
import User from "../apiClient";
import { useRouter } from "next/navigation";

interface LeagueStandingsProps {
    leagueName: string;
    teams: LeagueStanding[];
}

export default function LeagueStandings({ leagueName, teams }: LeagueStandingsProps) {

    const [favoriteTeams, setFavoriteTeams] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch favorite teams on component mount
    useEffect(() => {
        const fetchFavoriteTeams = async () => {
            try {
                const response = await User.getFavoriteTeams();
                // Access the favoriteTeams array from the response object
                const favorites = response.favoriteTeams || [];
                setFavoriteTeams(favorites.map((teamId: number) => teamId));
            } catch (error) {
                console.error("Failed to fetch favorite teams", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteTeams();
    }, []);

    // Handle the click to add/remove team from favorites
    const handleFavoriteClick = async (teamId: number) => {
        try {
            setLoading(true);
            const isFavorite = Array.isArray(favoriteTeams) && favoriteTeams.includes(teamId);

            if (isFavorite) {
                await User.deleteFavoriteTeam(teamId);
                setFavoriteTeams(prevFavorites => prevFavorites.filter(id => id !== teamId));
            } else {
                await User.addFavoriteTeam(teamId);
                setFavoriteTeams(prevFavorites => [...prevFavorites, teamId]);
            }

            // Force a page reload
            window.location.reload();
        } catch (error) {
            console.error("Failed to update favorite team", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="px-6 sm:px-14 lg:px-20 border-b-2 border-dashed border-red-800 py-10 ">
            <div className="flow-root">
                <div className="mx-auto max-w-7xl bg-white rounded-md">
                    <div className="inline-block min-w-full  py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y  divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-2xl font-medium text-red-800 sm:pl-0"
                                    >
                                        {leagueName}
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-red-800">
                                        W
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        L
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        PCT
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        GB
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        WCGB
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        STRK
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        RS
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        RA
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        DIFF
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        HOME
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        AWAY
                                    </th>
                                    <th className="relative whitespace-nowrap py-3.5 px-2 text-center text-sm font-medium text-red-800">
                                        Follow / Unfollow
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sky-200 bg-white">
                                {teams.map((team) => {
                                    const isFavorite = favoriteTeams.includes(team.teamId);

                                    return (
                                        <tr key={team.teamId}>
                                            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-sky-900 sm:pl-0 flex">
                                                <Image src={team.logoUrl} alt={team.teamName} width={20} height={20} className="mr-2" />
                                                {team.teamName}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-red-800">
                                                {team.W}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-sky-900 font-medium">
                                                {team.L}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {team.pct}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {team.gamesBack}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {team.wildCardGamesBack}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {team.streakCode}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {team.runsScored}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {team.runsAllowed}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {team.runDifferential}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {team.HOME}
                                            </td>
                                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                {team.AWAY}
                                            </td>
                                            <td className="relative whitespace-nowrap py-2 text-sm font-medium text-center">
                                                <button
                                                    onClick={() => handleFavoriteClick(team.teamId)}
                                                    className={`p-1 border rounded ${isFavorite ? 'bg-sky-900 text-white' : 'border-red-800 text-red-800 hover:bg-red-800 hover:text-white'}`}
                                                >
                                                    {isFavorite ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="size-6"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={2.5}
                                                            stroke="currentColor"
                                                            className="size-6"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
