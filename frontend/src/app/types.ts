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
  batSide?: {
    code: string;
    description: string;
  };
  pitchingHand?: {
    code: string;
    description: string;
  };
  height?: string;
  weight?: number;
  currentAge?: number;
  birthCity?: string;
  birthStateProvince?: string;
  birthCountry?: string;
  draftYear?: number;
  mlbDebutDate?: string;
};

type PlayerGeneralInfo = {
  id: number;
  fullName: string;
  currentTeam: {
    name: string;
    id?: number;
  };
  primaryNumber?: number;
  primaryPosition: string;
  batSide?: string;
  pitchingHand?: string;
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

// Define types for player stats
type HittingStats = {
  gamesPlayed: number;
  atBats: number;
  hits: number;
  homeRuns: number;
  avg: number;
  obp: number;
  slg: number;
  ops: number;
  rbi: number;
  strikeOuts: number;
};

type PitchingStats = {
  era: number;
  strikeOuts: number;
  whip: number;
  inningsPitched: number;
  wins: number;
  losses: number;
  saves: number;
  homeRunsAllowed: number;
  earnedRuns: number;
  strikeoutsPer9Inn: number;
};

type FieldingStats = {
  gamesPlayed: number;
  gamesStarted: number;
  assists: number;
  putOuts: number;
  errors: number;
  chances: number;
  fieldingPercentage: number;
  rangeFactorPerGame: number;
  rangeFactorPer9Inn: number;
  innings: number;
  doublePlays: number;
  triplePlays: number;
  throwingErrors: number;
};

type Stats = HittingStats | PitchingStats | FieldingStats;

export type {
  Player,
  PlayerGeneralInfo,
  League,
  Team,
  TeamInfo,
  TeamStats,
  Stats,
  PitchingStats,
  HittingStats,
  FieldingStats,
};
