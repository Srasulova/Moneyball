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

// type League = {
//   id: number;
//   name: string;
// };

type LeagueStanding = {
  teamId: number;
  teamName: string;
  leagueId: number;
  leagueName: string;
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

type Team = {
  id: number;
  name: string;
  season: string;
  firstYearOfPlay: string;
  league: {
    name: string;
    id: number;
  };
  division: {
    name: string;
    id: number;
  };
  locationName: string;
  leagueRank?: number | string;
};

type TeamStats = {
  stats: Array<{
    splits: Array<{
      stat: Record<string, any>;
    }>;
  }>;
};

type HittingStats = {
  avg: string;
  homeRuns: string;
  obp: string;
  slg: string;
  ops: string;
  runs: string;
  hits: string;
  strikeOuts: string;
  stolenBases: string;
  rbi: string;
};

type PitchingStats = {
  era: string;
  strikeOuts: string;
  baseOnBalls: string;
  whip: string;
  inningsPitched: string;
  wins: string;
  losses: string;
  saves: string;
  blownSaves: string;
  strikeoutWalkRatio: string;
};

type FieldingStats = {
  fieldingPercentage: string;
  errors: string;
  assists: string;
  putOuts: string;
  chances: string;
  doublePlays: string;
  triplePlays: string;
  passedBall: string;
  throwingErrors: string;
  rangeFactorPerGame: string;
};

type Stats = HittingStats | PitchingStats | FieldingStats;

type StatsType = "hitting" | "pitching" | "fielding";

export type {
  Player,
  PlayerGeneralInfo,
  Team,
  TeamStats,
  Stats,
  PitchingStats,
  HittingStats,
  FieldingStats,
  LeagueStanding,
  StatsType,
};
