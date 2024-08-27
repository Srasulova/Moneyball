"use client"

import { useEffect, useState } from "react";
import MoneyballApi from "../api";

type Player = {
    fullName: string;
    currentTeam: {
        name: string;
    };
    primaryPosition: {
        name: string;
    };
    height: string;
    weight: number;
    currentAge: number;
    birthCity: string;
    birthStateProvince: string;
    birthCountry: string;
    draftYear: number;
    mlbDebutDate: string;
};

export default function Players() {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const data = await MoneyballApi.getMlbPlayers();
                setPlayers(data);
            } catch (error) {
                console.error("Failed to fetch players:", error);
            }
        }
        fetchPlayers();
    }, []);

    return (
        <div className="min-h-screen bg-white py-8 px-8">
            <h1 className="text-red-800 text-4xl font-bold text-center mb-8">
                MLB Players
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-10">
                {players.map((player, index) => (
                    <div
                        key={player.fullName}
                        className="bg-white text-red-800 text-base p-4 rounded-lg shadow-xl border border-gray-100"
                    >
                        <h2 className="text-2xl text-sky-900 font-bold text-center my-4">  {index + 1}.  {player.fullName}</h2>
                        <p>Team: <span className="text-sky-900">{player.currentTeam.name}</span></p>
                        <p>Position: <span className="text-sky-900">{player.primaryPosition.name}</span></p>
                        <p>Height: <span className="text-sky-900">{player.height}</span></p>
                        <p>Weight: <span className="text-sky-900">{player.weight} lbs</span></p>
                        <p>Age: <span className="text-sky-900">{player.currentAge}</span></p>
                        <p>Birth City: <span className="text-sky-900">{player.birthCity}</span></p>
                        <p>Birth State/Province: <span className="text-sky-900">{player.birthStateProvince}</span></p>
                        <p>Birth Country: <span className="text-sky-900">{player.birthCountry}</span></p>
                        <p>Debut: <span className="text-sky-900">{player.mlbDebutDate}</span></p>
                        <p>Draft: <span className="text-sky-900">{player.draftYear}</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
}
