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
  static async getLeagueNames(): Promise<{
    leagues: Array<{ id: number; name: string }>;
  }> {
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

    const data = await this.request<{ teams: Array<any> }>(endpoint, params);

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
  static async getMlbPlayers(): Promise<Array<any>> {
    const endpoint = "sports/1/players"; // All players endpoint

    try {
      // Fetch all players
      const data = await this.request<{ people: Array<any> }>(endpoint);

      // Fetch MLB teams to filter players
      const teams = await this.getMlbTeams();
      const mlbTeamIds = new Set(teams.map((team) => team.id));

      // Filter players whose teams are in MLB and have valid team information
      const filteredPlayers = data.people
        .filter(
          (player) =>
            player.currentTeam &&
            player.currentTeam.id &&
            player.currentTeam.name &&
            mlbTeamIds.has(player.currentTeam.id) &&
            player.currentTeam.name.trim() !== "" // Ensure team name is not empty
        )
        .sort((a, b) => a.fullName.localeCompare(b.fullName)); // Sort alphabetically

      return filteredPlayers;
    } catch (error) {
      console.error("Failed to fetch MLB players:", error);
      throw error;
    }
  }

  /** Get team summary dashboard data */
  static async getTeamSummary(
    teamId: number,
    season: string
  ): Promise<{
    leagueName: string;
    leagueRank: number;
    recentScores: any[];
    playerLeaders: any[];
  }> {
    try {
      // Fetch league standings data
      const standingsData = await this.request<{ records: any[] }>("standings");

      // Find the league and team standings data
      const leagueStandings = standingsData.records.find((record) =>
        record.teamRecords.some((record: any) => record.team.id === teamId)
      );

      if (!leagueStandings) {
        throw new Error("Team not found in standings data.");
      }

      const leagueName = leagueStandings.league.name;
      const leagueId = leagueStandings.league.id;

      // Find the specific team's standing information
      const teamStanding = leagueStandings.teamRecords.find(
        (record: any) => record.team.id === teamId
      );

      const leagueRank = teamStanding
        ? leagueStandings.teamRecords.findIndex(
            (record: any) => record.team.id === teamId
          ) + 1
        : 0;

      // Fetch recent scores
      const recentScoresData = await this.request<any[]>("games", {
        teamId: teamId.toString(),
        season,
      });
      const recentScores = recentScoresData.slice(0, 5); // Last 5 scores, adjust as needed

      // Fetch player leaders
      const playerLeadersData = await this.request<{ leaders: any[] }>(
        `teams/${teamId}/leaders`,
        { season }
      );
      const playerLeaders = playerLeadersData.leaders;

      return { leagueName, leagueRank, recentScores, playerLeaders };
    } catch (error) {
      console.error("Failed to fetch team summary:", error);
      throw error;
    }
  }
}

export default MoneyballApi;
