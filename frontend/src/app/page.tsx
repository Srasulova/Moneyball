"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo-no.png";
import MoneyballApi from "@/app/api";
import LeagueStandings from "./components/LeagueStandings";
import TeamDashboard from "./components/TeamDashboard";

export type LeagueStanding = {
  id: number;
  name: string;
  logoUrl: string;
  W: number;
  L: number;
  pct: number;
  gamesBack: string;
  wildCardGamesBack: string;
  streakCode: string;
  runsScored: number;
  runsAllowed: number;
  runDifferential: number;
  HOME: string;
  AWAY: string;
};

type LeagueName = {
  id: number;
  name: string;
};

type TeamSummary = {
  teamName: string;
  leagueName: string;
  division: string;
  leagueRank: string;
};

export default function Home() {
  const [standings, setStandings] = useState<{ [key: string]: LeagueStanding[] }>({});
  const [leagues, setLeagues] = useState<LeagueName[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<number[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);

  const router = useRouter();
  const season = "2024"; // Define the season

  // Fetch league standings
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const fetchStandings = async () => {
      try {
        const leagueData = await MoneyballApi.getLeagueNames();
        const filteredLeagues = leagueData.leagues.filter(league => [103, 104].includes(league.id));
        setLeagues(filteredLeagues);

        const standingsData: { [key: string]: LeagueStanding[] } = {};
        for (const league of filteredLeagues) {
          const leagueStandings = await MoneyballApi.getStandings(league.id);
          const transformedData = leagueStandings.records
            .flatMap((record: any) => (record.teamRecords || []).map(extractTeamStandings))
            .sort((a: LeagueStanding, b: LeagueStanding) => b.pct - a.pct);
          standingsData[league.name] = transformedData;
        }
        setStandings(standingsData);
      } catch (err) {
        console.error("Failed to fetch standings:", err);
      } finally {
        setLoading(false);
      }
    };

    const extractTeamStandings = (teamRecords: any): LeagueStanding => {
      const id = teamRecords.team.id;
      const name = teamRecords.team.name;
      const logoUrl = `https://www.mlbstatic.com/team-logos/team-cap-on-light/${teamRecords.team.id}.svg`;
      const { wins, losses, pct } = teamRecords.leagueRecord || {};
      const gamesBack = teamRecords.gamesBack || "-";
      const wildCardGamesBack = teamRecords.wildCardGamesBack || "-";
      const streakCode = teamRecords.streak?.streakCode || "-";
      const runsScored = teamRecords.runsScored || 0;
      const runsAllowed = teamRecords.runsAllowed || 0;
      const runDifferential = teamRecords.runDifferential || 0;

      let HOME = "";
      let AWAY = "";

      (teamRecords.records?.overallRecords || []).forEach((record: any) => {
        if (record.type === "home") {
          HOME = `${record.wins}-${record.losses}`;
        }
        if (record.type === "away") {
          AWAY = `${record.wins}-${record.losses}`;
        }
      });

      return {
        id,
        name,
        logoUrl,
        W: wins,
        L: losses,
        pct,
        gamesBack,
        wildCardGamesBack,
        streakCode,
        runsScored,
        runsAllowed,
        runDifferential,
        HOME,
        AWAY
      };
    };

    fetchStandings();
  }, []);

  // Fetch team summaries for favorite teams
  useEffect(() => {
    const fetchFavoriteTeamsSummary = async () => {
      try {
        const storedTeams = localStorage.getItem("favoriteTeams");
        const ids = storedTeams ? JSON.parse(storedTeams) : [];
        setFavoriteTeamIds(ids);

        if (ids.length > 0) {
          console.log("Fetching summaries for teams:", ids);
          const summaries = await Promise.all(
            ids.map((id: number) => MoneyballApi.getTeamInfo(id))
          );
          console.log("Fetched team summaries:", summaries);
          setTeamSummaries(summaries); // Store summaries for all favorite teams
        }
      } catch (err) {
        console.error("Failed to fetch team summaries:", err);
      }
    };

    fetchFavoriteTeamsSummary();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  return (
    <main>
      {isLoggedIn ? (
        <>
          {teamSummaries.length > 0 && (
            <div className="w-full mt-16 ">
              <h2 className="text-2xl font-bold text-center text-sky-900 my-4">Favorite Teams Dashboard</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 max-w-7xl mx-auto">
                {teamSummaries.map((summary, index) => (
                  <TeamDashboard
                    key={index}
                    teamId={favoriteTeamIds[index]}
                    season={season}
                    teamSummary={summary}
                  />
                ))}
              </div>

            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-center text-sky-900 mt-10">League Standings</h2>
            {leagues.map((league) => (
              <LeagueStandings
                key={league.id}
                leagueName={league.name}
                teams={standings[league.name] || []}
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
            <Link href="/login" className="px-6 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800">Log In</Link>
            <Link href="/signup" className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700">Sign Up</Link>
          </div>
        </div>
      )}
    </main>
  );
}
