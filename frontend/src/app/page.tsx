"use client";

import { useEffect, useState } from "react";
import LeagueStandings from "./components/LeagueStandings";
import MoneyballApi from "./api";

export type LeagueStanding = {
  name: string;
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

export default function Home() {
  const [americanLeague, setAmericanLeague] = useState<LeagueStanding[]>([]);
  const [nationalLeague, setNationalLeague] = useState<LeagueStanding[]>([]);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const americanData = await MoneyballApi.getAmericanLeagueStandings();
        const nationalData = await MoneyballApi.getNationalLeagueStandings();

        console.log("American League Data:", americanData.records);
        console.log("National League Data:", nationalData.records);

        // Ensure that americanData.records and nationalData.records are arrays before mapping
        if (!Array.isArray(americanData.records) || !Array.isArray(nationalData.records)) {
          throw new Error("API response is not an array");
        }

        const extractTeamStandings = (teamRecords: any): LeagueStanding => {
          const name = teamRecords.team.name;
          const { wins, losses, pct } = teamRecords.leagueRecord || {}; // Ensure leagueRecord exists
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

        // Map over each team's records and sort the result
        const transformedAmericanData = americanData.records
          .flatMap((record: any) => (record.teamRecords || []).map(extractTeamStandings))
          .sort((a: LeagueStanding, b: LeagueStanding) => b.pct - a.pct);  // Sort in descending order by pct

        const transformedNationalData = nationalData.records
          .flatMap((record: any) => (record.teamRecords || []).map(extractTeamStandings))
          .sort((a: LeagueStanding, b: LeagueStanding) => b.pct - a.pct);  // Sort in descending order by pct

        setAmericanLeague(transformedAmericanData);
        setNationalLeague(transformedNationalData);

        console.log(transformedAmericanData);
        console.log(transformedNationalData);
      } catch (err) {
        console.error("Failed to fetch standings:", err);
      }
    }

    fetchStandings();
  }, []);


  return (
    <main>
      <LeagueStandings leagueName="American League" teams={americanLeague} />
      <LeagueStandings leagueName="National League" teams={nationalLeague} />
    </main>
  );
}
