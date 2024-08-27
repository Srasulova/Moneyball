"use client"

import { useEffect, useState } from "react";
import MoneyballApi from "../api";

type Team = {
    name: string;
    firstYearOfPlay: string;
    leagueName: string;
    divisionName: string;
    locationName: string;
};

export default function Teams() {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        async function fetchTeams() {
            try {
                const data = await MoneyballApi.getMlbTeams();
                setTeams(data);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            }
        }
        fetchTeams();
    }, []);

    return (
        <div className="min-h-screen bg-white py-8 px-8">
            <h1 className="text-red-800 text-4xl font-bold text-center mb-8">
                MLB Teams
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-10">
                {teams.map((team) => (
                    <div
                        key={team.name}
                        className="bg-white text-red-800 text-base p-4 rounded-lg shadow-xl border border-gray-100 hover:scale-125"
                    >
                        <h2 className="text-2xl text-sky-900 font-bold text-center my-4">{team.name}</h2>
                        <p>Location: <span className="text-sky-900">{team.locationName}</span> </p>
                        <p >First Year of Play:<span className="text-sky-900">{team.firstYearOfPlay}</span> </p>
                        <p >League: <span className="text-sky-900">{team.leagueName}</span> </p>
                        <p >Division:<span className="text-sky-900"> {team.divisionName}</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
}
