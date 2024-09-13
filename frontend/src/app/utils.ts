import { HittingStats, PitchingStats, FieldingStats } from "./types";

export const formatHittingStats = (stats: any): HittingStats => ({
  avg: stats.avg || "0",
  homeRuns: stats.homeRuns || "0",
  obp: stats.obp || "0",
  slg: stats.slg || "0",
  ops: stats.ops || "0",
  runs: stats.runs || "0",
  hits: stats.hits || "0",
  strikeOuts: stats.strikeOuts || "0",
  stolenBases: stats.stolenBases || "0",
  rbi: stats.rbi || "0",
});

export const formatPitchingStats = (stats: any): PitchingStats => ({
  era: stats.era || "0",
  strikeOuts: stats.strikeOuts || "0",
  baseOnBalls: stats.baseOnBalls || "0",
  whip: stats.whip || "0",
  inningsPitched: stats.inningsPitched || "0",
  wins: stats.wins || "0",
  losses: stats.losses || "0",
  saves: stats.saves || "0",
  blownSaves: stats.blownSaves || "0",
  strikeoutWalkRatio: stats.strikeoutWalkRatio || "0",
});

export const formatFieldingStats = (stats: any): FieldingStats => ({
  fieldingPercentage: stats.fieldingPercentage || "0",
  errors: stats.errors || "0",
  assists: stats.assists || "0",
  putOuts: stats.putOuts || "0",
  chances: stats.chances || "0",
  doublePlays: stats.doublePlays || "0",
  triplePlays: stats.triplePlays || "0",
  passedBall: stats.passedBall || "0",
  throwingErrors: stats.throwingErrors || "0",
  rangeFactorPerGame: stats.rangeFactorPerGame || "0",
});
