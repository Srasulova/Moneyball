// src/types.ts

type Player = {
  id: number;
  fullName: string;
  currentTeam: {
    id?: number;
    name: string;
  };
  primaryPosition: {
    name: string;
  };
  primaryNumber?: number;
  batSide?: string;
  pitchingHand?: string;
  height?: string;
  weight?: number;
  currentAge?: number;
  birthCity?: string;
  birthStateProvince?: string;
  birthCountry?: string;
  draftYear?: number;
  mlbDebutDate?: string;
};

type League = {
  id: number;
  name: string;
};

type Team = {
  id: number;
  name: string;
  firstYearOfPlay: string;
  league: { name: string };
  division: { name: string };
  locationName: string;
};

type TeamInfo = {
  teamName: string;
  leagueName: string;
  division: string;
  leagueRank: number | string;
};

type TeamStats = {
  stats: Array<{
    splits: Array<{
      stat: Record<string, any>;
    }>;
  }>;
};

export type { Player, League, Team, TeamInfo, TeamStats };
