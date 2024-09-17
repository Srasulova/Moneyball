'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo-no.png";
import MoneyballApi from "@/app/api";
import LeagueStandings from "./components/LeagueStandings";
import TeamDashboard from "./components/TeamDashboard";
import PlayerDashboard from "./components/PlayerDashboard";
import { Player, Team, LeagueStanding } from "./types";
import User from "./apiClient";

export default function Home() {
  const [leagueStandings, setLeagueStandings] = useState<{ leagueId: number; leagueName: string; teams: LeagueStanding[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<number[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<Team[]>([]);
  const [favoritePlayerIds, setFavoritePlayerIds] = useState<number[]>([]);
  const [playerSummaries, setPlayerSummaries] = useState<Player[]>([]);

  // Check if the user is logged in based on the presence of a token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      const fetchUserName = async () => {
        try {
          const userData = await User.getUser();
          if (userData && userData.user && userData.user.firstName) {
            setUserName(userData.user.firstName);
          } else {
            console.warn("No firstName found in user data.");
            setIsLoggedIn(false);  // If user data is invalid, consider the user as logged out
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
          setIsLoggedIn(false);  // Handle error by logging out the user
        }
      };

      fetchUserName();
    } else {
      setIsLoggedIn(false);
    }
  }, []);



  // Fetch league standings
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const leagueIds = [103, 104];
        const leagues = [];

        for (const leagueId of leagueIds) {
          const standingsData = await MoneyballApi.getStandings(leagueId);
          if (standingsData.length > 0) {
            const leagueName = standingsData[0].leagueName;
            leagues.push({
              leagueId,
              leagueName,
              teams: standingsData.sort((a, b) => b.pct - a.pct),
            });
          }
        }
        console.log(leagues);
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
        if (!isLoggedIn) return;

        const response = await User.getFavoriteTeams();
        // console.log("Favorite Teams Response:", response);
        const ids = response.favoriteTeams || [];
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
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchFavoritePlayersSummary = async () => {
      try {
        if (!isLoggedIn) return;

        const response = await User.getFavoritePlayers();
        const ids = response.favoritePlayers || [];
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
  }, [isLoggedIn]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  return (
    <main>
      {isLoggedIn ? (
        <>
          <div className="text-center mt-10">
            <h1 className="text-4xl font-bold text-sky-900">
              Welcome, <span className="text-red-800">{userName ? userName : "User"}</span> !
            </h1>
          </div>

          {teamSummaries.length > 0 && (
            <div className="w-full mt-16 border-b-2 border-dashed border-red-800 pb-16">
              <h2 className="text-2xl font-bold text-center text-sky-900 my-4">Favorite Teams Dashboard</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 max-w-7xl mx-auto">
                {teamSummaries.map((summary) => (
                  <TeamDashboard key={summary.id} teamSummary={summary} />
                ))}
              </div>
            </div>
          )}

          {teamSummaries.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-lg text-sky-900 underline decoration-dashed decoration-2 decoration-red-800">You don&apos;t have any favorite teams yet.</p>
              <p className="text-lg text-sky-900">Go to{" "}
                <Link href="/teams" className="text-red-800 underline">
                  Teams
                </Link> page to pick your favorite teams.</p>
            </div>
          )}

          {playerSummaries.length > 0 && (
            <div className="w-full mt-16 border-b-2 border-dashed border-red-800 pb-16">
              <h2 className="text-2xl font-bold text-center text-sky-900 my-4">Favorite Players Dashboard</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 max-w-7xl mx-auto">
                {playerSummaries.map((summary) => (
                  <PlayerDashboard key={summary.id} playerSummary={summary} statsType="hitting" />
                ))}
              </div>
            </div>
          )}

          {playerSummaries.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-lg text-sky-900 underline decoration-dashed decoration-2 decoration-red-800">You don&apos;t have any favorite players yet.</p>
              <p className="text-lg text-sky-900">Go to{" "}
                <Link href="/players" className="text-red-800 underline">
                  Players
                </Link> page to pick your favorite players.</p>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-center text-sky-900 mt-10">League Standings</h2>
            {leagueStandings.map(({ leagueId, leagueName, teams }) => (
              <LeagueStandings key={leagueId} leagueName={leagueName} teams={teams} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-start min-h-screen mt-28">
          <Image className="sm:h-60 h-40 w-auto mb-10" src={logo} alt="logo" />
          <h1 className="text-4xl font-bold text-sky-900">Welcome to Moneyball</h1>
          <p className="mt-4 text-lg text-zinc-600">Please log in or sign up to access league standings.</p>
          <div className="mt-6 flex gap-2">
            <Link href="/login" className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900">
              Log In
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
