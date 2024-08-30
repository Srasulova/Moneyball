const BASE_URL = "https://statsapi.mlb.com/api/v1/";

/** Types for API responses */
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

type Player = {
  id: number;
  fullName: string;
  currentTeam: {
    id: number;
    name: string;
  };
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
  static async getMlbTeams(): Promise<
    Array<{
      id: number;
      name: string;
      firstYearOfPlay: string;
      leagueName: string;
      divisionName: string;
      locationName: string;
    }>
  > {
    const endpoint = "teams";
    const params = { sportId: "1" }; // MLB

    const data = await this.request<{ teams: Team[] }>(endpoint, params);

    // Extract the necessary fields from the response
    return data.teams
      .map((team) => ({
        id: team.id,
        name: team.name,
        firstYearOfPlay: team.firstYearOfPlay,
        leagueName: team.league.name,
        divisionName: team.division.name,
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
      avg: stats.avg,
      hr: stats.homeRuns,
      obp: stats.obp,
      slg: stats.slg,
      ops: stats.ops,
      r: stats.runs,
      h: stats.hits,
      so: stats.strikeOuts,
      sb: stats.stolenBases,
      rbi: stats.rbi,
      bb: stats.baseOnBalls,
      babip: stats.babip,
    };
  }

  /** Get pitching stats for a specific team */
  static async getPitchingStats(teamId: number): Promise<any> {
    const stats = await this.getTeamStats(teamId, "pitching");
    return {
      era: stats.era,
      so: stats.strikeOuts,
      bb: stats.baseOnBalls,
      whip: stats.whip,
      ip: stats.inningsPitched,
      wins: stats.wins,
      losses: stats.losses,
      saves: stats.saves,
      holds: stats.holds,
      blownSaves: stats.blownSaves,
      strikePercentage: stats.strikePercentage,
      strikeoutWalkRatio: stats.strikeoutWalkRatio,
      strikeoutsPer9Inn: stats.strikeoutsPer9Inn,
      walksPer9Inn: stats.walksPer9Inn,
      hitsPer9Inn: stats.hitsPer9Inn,
      homeRunsPer9: stats.homeRunsPer9,
      winPercentage: stats.winPercentage,
    };
  }

  /** Get fielding stats for a specific team */
  static async getFieldingStats(teamId: number): Promise<any> {
    const stats = await this.getTeamStats(teamId, "fielding");
    return {
      fpct: stats.fielding,
      errors: stats.errors,
      assists: stats.assists,
      putOuts: stats.putOuts,
      chances: stats.chances,
      doublePlays: stats.doublePlays,
      triplePlays: stats.triplePlays,
      passedBall: stats.passedBall,
      throwingErrors: stats.throwingErrors,
      rangeFactorPerGame: stats.rangeFactorPerGame,
      rangeFactorPer9Inn: stats.rangeFactorPer9Inn,
    };
  }
}

export default MoneyballApi;
