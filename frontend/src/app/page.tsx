"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MoneyballApi from "@/app/api";
import LeagueStandings from "./components/LeagueStandings";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo-no.png"

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

export default function Home() {
  const [standings, setStandings] = useState<{ [key: string]: LeagueStanding[] }>({});
  const [leagues, setLeagues] = useState<LeagueName[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check login status from localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    async function fetchStandings() {
      try {
        // Fetch league names
        const leagueData = await MoneyballApi.getLeagueNames();

        // Filter for American and National League
        const filteredLeagues = leagueData.leagues.filter(league => [103, 104].includes(league.id));
        setLeagues(filteredLeagues);

        // Fetch standings for each league
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
    return <p>Loading...</p>;
  }

  return (
    <main>
      {isLoggedIn ? (
        leagues.map((league) => (
          <LeagueStandings
            key={league.id}
            leagueName={league.name}
            teams={standings[league.name] || []}
          />
        ))
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
