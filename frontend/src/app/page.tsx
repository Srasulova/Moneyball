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
  leagueName: string;
  leagueRank: number;
  recentScores: { date: string; opponent: string; result: string; score: string }[];
  playerLeaders: { name: string; statistic: string; value: string }[];
};

const getFavoriteTeamIds = (): number[] => {
  const storedTeams = localStorage.getItem("favoriteTeams");
  return storedTeams ? JSON.parse(storedTeams) : [];
};

export default function Home() {
  const [standings, setStandings] = useState<{ [key: string]: LeagueStanding[] }>({});
  const [leagues, setLeagues] = useState<LeagueName[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<number[]>([]);
  const [teamSummary, setTeamSummary] = useState<TeamSummary | null>(null);

  const router = useRouter();
  const season = "2024"; // Define the season

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    async function fetchStandings() {
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

        const favoriteTeamId = getFavoriteTeamIds()[0]; // Assuming single favorite team for simplicity
        if (favoriteTeamId) {
          const summary = await MoneyballApi.getTeamSummary(favoriteTeamId, season);
          setTeamSummary(summary);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }

    const extractTeamStandings = (teamRecords: any): LeagueStanding => {
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

  if (loading) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  return (
    <main>
      {isLoggedIn ? (
        <>
          {leagues.map((league) => (
            <LeagueStandings
              key={league.id}
              leagueName={league.name}
              teams={standings[league.name] || []}
            />
          ))}
          {teamSummary && (
            <TeamDashboard
              teamId={getFavoriteTeamIds()[0]} // Pass favorite team ID
              season={season} // Pass the season
              teamSummary={teamSummary} // Pass the team summary
            />
          )}
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
