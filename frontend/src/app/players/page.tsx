"use client"

import { useEffect, useState } from "react";
import MoneyballApi from "../api";
import Image from "next/image";

type Player = {
    id: number;
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
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchPlayers(page: number) {
            try {
                setIsLoading(true);
                const data = await MoneyballApi.getMlbPlayers(page);
                setPlayers(prevPlayers => [...prevPlayers, ...data]);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch players:", error);
                setIsLoading(false);
            }
        }

        fetchPlayers(page);
    }, [page]);

    useEffect(() => {
        function handleScroll() {
            if (
                window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
                isLoading
            ) {
                return;
            }
            setPage(prevPage => prevPage + 1);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoading]);

    return (
        <div className="min-h-screen bg-white py-8 px-8">
            <h1 className="text-red-800 text-4xl font-bold text-center mb-8">
                MLB Players
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
                {players.map((player, index) => {
                    const imgUrl = `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${player.id}/headshot/67/current`;

                    return (
                        <div
                            key={player.fullName}
                            className="bg-white text-red-800 text-sm p-4 rounded-lg shadow-xl border border-gray-100 flex hover:shadow-2xl"
                        >
                            <Image
                                src={imgUrl}
                                alt={`${player.fullName}`}
                                className="rounded-lg"
                                width={200}
                                height={0}
                            />
                            <div className="ml-8">
                                <h2 className="text-2xl text-sky-900 font-bold text-center my-4">
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
                })}
            </div>
            {isLoading && <p className="text-center text-gray-500">Loading players...</p>}
        </div>
    );
}
