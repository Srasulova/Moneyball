import {
  Player,
  League,
  Team,
  TeamInfo,
  TeamStats,
  PlayerGeneralInfo,
} from "./types";

const BASE_URL = "https://statsapi.mlb.com/api/v1/";

/** API Class for interacting with the MLB API */
class MoneyballApi {
  /** Helper method to make a fetch request */
  static async request<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.search = new URLSearchParams(params).toString();

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data as T;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  /** Get league names */
  static async getLeagueNames(): Promise<{ leagues: League[] }> {
    const endpoint = "leagues";
    return this.request(endpoint);
  }

  /** Get standings for a specific league */
  static async getStandings(leagueId: number): Promise<any> {
    const endpoint = "standings";
    const params = { leagueId: leagueId.toString() };
    return this.request(endpoint, params);
  }

  /** Get MLB teams with specific fields */
  static async getMlbTeams(): Promise<Team[]> {
    const endpoint = "teams";
    const params = { sportId: "1" }; // MLB

    const data = await this.request<{ teams: Team[] }>(endpoint, params);

    return data.teams
      .map((team) => ({
        id: team.id,
        name: team.name,
        firstYearOfPlay: team.firstYearOfPlay,
        league: team.league, // Directly using the object
        division: team.division, // Directly using the object
        locationName: team.locationName,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Get players for MLB teams */
  static async getMlbPlayers(): Promise<Player[]> {
    const endpoint = "sports/1/players"; // All players endpoint

    try {
      // Fetch all players
      const data = await this.request<{ people: Player[] }>(endpoint);

      // Fetch MLB teams to filter players
      const teams = await this.getMlbTeams();
      const mlbTeamIds = new Set(teams.map((team) => team.id));

      // Filter players whose teams are in MLB and have valid team information
      return data.people
        .filter(
          (player) =>
            player.currentTeam &&
            player.currentTeam.id &&
            player.currentTeam.name &&
            mlbTeamIds.has(player.currentTeam.id) &&
            player.currentTeam.name.trim() !== "" // Ensure team name is not empty
        )
        .sort((a, b) => a.fullName.localeCompare(b.fullName)); // Sort alphabetically
    } catch (error) {
      console.error("Failed to fetch MLB players:", error);
      throw error;
    }
  }

  /** Get general information on a specific player by ID */
  static async getPlayerInfo(playerId: number): Promise<PlayerGeneralInfo> {
    const endpoint = "sports/1/players";
    try {
      // Fetch all players from the API
      const data = await this.request<{ people: Player[] }>(endpoint);

      // Find the player by ID
      const player = data.people.find((p) => p.id === playerId);

      if (!player) {
        throw new Error(`Player with ID ${playerId} not found`);
      }

      // Extract the required player details
      const playerInfo: PlayerGeneralInfo = {
        id: player.id,
        fullName: player.fullName,
        currentTeam: {
          name: player.currentTeam.name,
          id: player.currentTeam.id,
        },
        primaryNumber: player.primaryNumber,
        primaryPosition: player.primaryPosition.name,
        batSide: player.batSide?.description,
        pitchingHand: player.pitchingHand?.description,
      };

      return playerInfo;
    } catch (error) {
      console.error("Failed to fetch player information:", error);
      throw error;
    }
  }

  /** Get team general information and league rank */
  static async getTeamInfo(teamId: number): Promise<TeamInfo> {
    try {
      // Fetch team general information
      const teamResponse = await fetch(`${BASE_URL}teams/${teamId}`);
      const teamData = await teamResponse.json();
      const team = teamData.teams[0];

      const teamName = team.name;
      const leagueName = team.league.name;
      const division = team.division.name;

      // Fetch league standings to get team ranking
      const leagueId = team.league.id;
      const standingsResponse = await fetch(
        `${BASE_URL}standings?leagueId=${leagueId}`
      );
      const standingsData = await standingsResponse.json();

      // Find the team's rank in the league
      const teamRecord = standingsData.records
        .flatMap((record: any) => record.teamRecords)
        .find((record: any) => record.team.id === teamId);

      const leagueRank = teamRecord ? teamRecord.leagueRank : "N/A";

      return {
        teamName,
        leagueName,
        division,
        leagueRank,
      };
    } catch (error) {
      console.error("Failed to fetch team information:", error);
      throw error;
    }
  }

  /** Get stats for a specific team and group */
  static async getTeamStats(
    teamId: number,
    group: "hitting" | "pitching" | "fielding"
  ): Promise<any> {
    const endpoint = `teams/${teamId}/stats`;
    const params = { stats: "season", group };
    const response = await this.request<TeamStats>(endpoint, params);

    // Extract relevant stats based on group
    const stats = response.stats[0].splits[0].stat; // Adjust if needed based on actual structure

    return stats;
  }

  /** Get hitting stats for a specific team */
  static async getHittingStats(teamId: number): Promise<any> {
    const stats = await this.getTeamStats(teamId, "hitting");
    return {
      avg: stats.avg, // Batting average
      homeRuns: stats.homeRuns, // Number of home runs
      obp: stats.obp, // On-base percentage
      slg: stats.slg, // Slugging percentage
      ops: stats.ops, // On-base plus slugging percentage
      runs: stats.runs, // Number of runs
      hits: stats.hits, // Number of hits
      strikeOuts: stats.strikeOuts, // Number of strikeouts
      stolenBases: stats.stolenBases, // Number of stolen bases
      rbi: stats.rbi, // Runs batted in
    };
  }

  /** Get pitching stats for a specific team */
  static async getPitchingStats(teamId: number): Promise<any> {
    const stats = await this.getTeamStats(teamId, "pitching");
    return {
      era: stats.era, // Earned Run Average
      so: stats.strikeOuts, // Strikeouts
      bb: stats.baseOnBalls, // Base on Balls (Walks)
      whip: stats.whip, // Walks plus Hits per Inning Pitched
      ip: stats.inningsPitched, // Innings Pitched
      wins: stats.wins, // Wins
      losses: stats.losses, // Losses
      saves: stats.saves, // Saves
      blownSaves: stats.blownSaves, // Blown Saves
      strikeoutWalkRatio: stats.strikeoutWalkRatio, // Strikeout-to-Walk Ratio
    };
  }

  /** Get fielding stats for a specific team */
  static async getFieldingStats(teamId: number): Promise<any> {
    const stats = await this.getTeamStats(teamId, "fielding");
    return {
      fpct: stats.fielding || "N/A",
      errors: stats.errors || "N/A",
      assists: stats.assists || "N/A",
      putOuts: stats.putOuts || "N/A",
      chances: stats.chances || "N/A",
      doublePlays: stats.doublePlays || "N/A",
      triplePlays: stats.triplePlays || "N/A",
      passedBall: stats.passedBall || "N/A",
      throwingErrors: stats.throwingErrors || "N/A",
      rangeFactorPerGame: stats.rangeFactorPerGame || "N/A",
    };
  }

  /** Get hitting stats for a specific player */
  static async getPlayerHittingStats(playerId: number): Promise<any> {
    const endpoint = `people/${playerId}/stats`;
    const params = { stats: "season", group: "hitting" };
    const response = await this.request<{
      stats: Array<{ splits: Array<{ stat: any }> }>;
    }>(endpoint, params);

    // Extract the relevant stats from the response
    const stats = response.stats[0]?.splits[0]?.stat;
    if (!stats) {
      throw new Error(`No hitting stats found for player`);
    }

    return {
      gamesPlayed: stats.gamesPlayed,
      atBats: stats.atBats,
      hits: stats.hits,
      homeRuns: stats.homeRuns,
      avg: stats.avg,
      obp: stats.obp,
      slg: stats.slg,
      ops: stats.ops,
      rbi: stats.rbi,
      strikeOuts: stats.strikeOuts,
    };
  }

  /** Get pitching stats for a specific player */
  static async getPlayerPitchingStats(playerId: number): Promise<any> {
    const endpoint = `people/${playerId}/stats`;
    const params = { stats: "season", group: "pitching" };
    const response = await this.request<{
      stats: Array<{ splits: Array<{ stat: any }> }>;
    }>(endpoint, params);

    // Extract the relevant stats from the response
    const stats = response.stats[0]?.splits[0]?.stat;
    if (!stats) {
      throw new Error(`No pitching stats found for player`);
    }

    return {
      era: parseFloat(stats.era), // Convert ERA to a float
      strikeOuts: stats.strikeOuts,
      whip: parseFloat(stats.whip), // Convert WHIP to a float
      inningsPitched: parseFloat(stats.inningsPitched), // Convert innings pitched to a float
      wins: stats.wins,
      losses: stats.losses,
      saves: stats.saves,
      homeRunsAllowed: stats.homeRuns,
      earnedRuns: stats.earnedRuns,
      strikeoutsPer9Inn: parseFloat(stats.strikeoutsPer9Inn), // Convert strikeouts per 9 innings to a float
    };
  }

  /** Get fielding stats for a specific player */
  static async getPlayerFieldingStats(playerId: number): Promise<any> {
    const endpoint = `people/${playerId}/stats`;
    const params = { stats: "season", group: "fielding" };
    const response = await this.request<{
      stats: Array<{ splits: Array<{ stat: any }> }>;
    }>(endpoint, params);

    // Extract the relevant stats from the response
    const stats = response.stats[0]?.splits[0]?.stat;
    if (!stats) {
      throw new Error(`No fielding stats found for player`);
    }

    return {
      gamesPlayed: stats.gamesPlayed,
      gamesStarted: stats.gamesStarted,
      assists: stats.assists,
      putOuts: stats.putOuts,
      errors: stats.errors,
      chances: stats.chances,
      fieldingPercentage: parseFloat(stats.fielding),
      rangeFactorPerGame: parseFloat(stats.rangeFactorPerGame),
      rangeFactorPer9Inn: parseFloat(stats.rangeFactorPer9Inn),
      innings: parseFloat(stats.innings),
      doublePlays: stats.doublePlays,
      triplePlays: stats.triplePlays,
      throwingErrors: stats.throwingErrors,
    };
  }

  /** Get general information on a specific player by ID */
  // static async getPlayerInfo(playerId: number): Promise<{
  //   id: number;
  //   fullName: string;
  //   currentTeam: {
  //     name: string;
  //     id: number;
  //   };

  //   primaryNumber: string;
  //   primaryPosition: string;
  //   batSide: string;
  //   pitchHand: string;
  // }> {
  //   const endpoint = "sports/1/players";
  //   try {
  //     // Fetch all players from the API
  //     const data = await this.request<{ people: any[] }>(endpoint);

  //     // Find the player by ID
  //     const player = data.people.find((p) => p.id === playerId);

  //     if (!player) {
  //       throw new Error(`Player with ID ${playerId} not found`);
  //     }

  //     // Extract the required player details
  //     const playerInfo = {
  //       id: player.id,
  //       fullName: player.fullName,
  //       currentTeam: {
  //         name: player.currentTeam.name,
  //         id: player.currentTeam.id,
  //       },
  //       primaryNumber: player.primaryNumber,
  //       primaryPosition: player.primaryPosition.name,
  //       batSide: player.batSide.description,
  //       pitchHand: player.pitchHand.description,
  //     };

  //     return playerInfo;
  //   } catch (error) {
  //     console.error("Failed to fetch player information:", error);
  //     throw error;
  //   }
  // }
}

export default MoneyballApi;
