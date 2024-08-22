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

  /** Get National League standings */
  static async getLeagueNames(): Promise<any> {
    const endpoint = "leagues";
    // const params = { leagueId: "104" };
    const standings = await this.request(endpoint);
    return standings;
  }

  /** Get National League standings */
  static async getNationalLeagueStandings(): Promise<any> {
    const endpoint = "standings";
    const params = { leagueId: "104" };
    const standings = await this.request(endpoint, params);
    return standings;
  }

  /** Get National League standings */
  static async getAmericanLeagueStandings(): Promise<any> {
    const endpoint = "standings";
    const params = { leagueId: "103" };
    const standings = await this.request(endpoint, params);
    return standings;
  }
}

export default MoneyballApi;
