'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo-no.png";
import MoneyballApi from "@/app/api";
import LeagueStandings from "./components/LeagueStandings";
import TeamDashboard from "./components/TeamDashboard";
import PlayerDashboard from "./components/PlayerDashboard";
import { Player, Team, LeagueStanding } from "./types";

export default function Home() {
  const [leagueStandings, setLeagueStandings] = useState<{ leagueId: number; leagueName: string; teams: LeagueStanding[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<number[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<Team[]>([]);
  const [favoritePlayerIds, setFavoritePlayerIds] = useState<number[]>([]);
  const [playerSummaries, setPlayerSummaries] = useState<Player[]>([]);

  const router = useRouter();
  const season = "2024";

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const fetchStandings = async () => {
      try {
        const leagueIds = [103, 104];
        const leagues = [];

        for (const leagueId of leagueIds) {
          const standingsData = await MoneyballApi.getStandings(leagueId);
          if (standingsData.length > 0) {
            const leagueName = standingsData[0].leagueName;
            leagues.push({ leagueId, leagueName, teams: standingsData.sort((a, b) => b.pct - a.pct) });
          }
        }
        console.log(leagues)
        setLeagueStandings(leagues);
      } catch (err) {
        console.error("Failed to fetch standings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  useEffect(() => {
    const fetchFavoriteTeamsSummary = async () => {
      try {
        const storedTeams = localStorage.getItem("favoriteTeams");
        const ids = storedTeams ? JSON.parse(storedTeams) : [];
        setFavoriteTeamIds(ids);

        if (ids.length > 0) {
          const summaries = await Promise.all(
            ids.map((id: number) => MoneyballApi.getTeamInfo(id))
          );
          setTeamSummaries(summaries);
        }
      } catch (err) {
        console.error("Failed to fetch team summaries:", err);
      }
    };

    fetchFavoriteTeamsSummary();
  }, []);

  useEffect(() => {
    const fetchFavoritePlayersSummary = async () => {
      try {
        const storedPlayers = localStorage.getItem("favoritePlayers");
        const ids = storedPlayers ? JSON.parse(storedPlayers) : [];
        setFavoritePlayerIds(ids);

        if (ids.length > 0) {
          const summaries = await Promise.all(
            ids.map((id: number) => MoneyballApi.getPlayerInfo(id))
          );
          setPlayerSummaries(summaries);
        }
      } catch (err) {
        console.error("Failed to fetch player summaries:", err);
      }
    };

    fetchFavoritePlayersSummary();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  return (
    <main>
      {isLoggedIn ? (
        <>
          {teamSummaries.length > 0 && (
            <div className="w-full mt-16">
              <h2 className="text-2xl font-bold text-center text-sky-900 my-4">Favorite Teams Dashboard</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 max-w-7xl mx-auto">
                {teamSummaries.map((summary) => (
                  <TeamDashboard
                    key={summary.id}
                    teamSummary={summary}
                  />
                ))}
              </div>
            </div>
          )}

          {playerSummaries.length > 0 && (
            <div className="w-full mt-16">
              <h2 className="text-2xl font-bold text-center text-sky-900 my-4">Favorite Players Dashboard</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 max-w-7xl mx-auto">
                {playerSummaries.map((summary) => (
                  <PlayerDashboard
                    key={summary.id}
                    playerSummary={summary}
                    statsType="hitting"
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-center text-sky-900 mt-10">League Standings</h2>
            {leagueStandings.map(({ leagueId, leagueName, teams }) => (
              <LeagueStandings
                key={leagueId}
                leagueName={leagueName}
                teams={teams}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-start min-h-screen mt-28">
          <Image className="sm:h-60 h-40 w-auto mb-10" src={logo} alt="logo" />
          <h1 className="text-4xl font-bold text-sky-900">Welcome to Moneyball</h1>
          <p className="mt-4 text-lg text-zinc-600">Please log in or sign up to access league standings.</p>
          <div className="mt-6 flex gap-2">
            <Link href="/login" className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900">Log In</Link>
            <Link href="/signup" className="px-6 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800">Sign Up</Link>
          </div>
        </div>
      )}
    </main>
  );
}
