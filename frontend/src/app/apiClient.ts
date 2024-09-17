const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class User {
  // Helper method for making requests
  private static async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
    data?: any
  ): Promise<T> {
    const token = localStorage.getItem("token"); // Use token if authenticated
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config: RequestInit = {
      method,
      headers,
      ...(method !== "GET" && { body: JSON.stringify(data) }),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const responseData = await res.json();

    if (!res.ok)
      throw new Error(responseData.error.message || "Request failed");
    return responseData;
  }

  // Authentication endpoints
  static async login(email: string, password: string): Promise<any> {
    return this.request("/auth/login", "POST", { email, password });
  }

  static async register(
    firstName: string,
    email: string,
    password: string
  ): Promise<any> {
    return this.request("/auth/register", "POST", {
      firstName,
      email,
      password,
    });
  }

  // User and favorites endpoints
  static async getUser(): Promise<any> {
    // return this.request("/user");
    const userData = await this.request("/user");
    console.log("User Data: ", userData);
    return userData;
  }

  static async updateUser(email: string, data: object): Promise<any> {
    return this.request(`/user/${email}`, "PATCH", data);
  }

  static async deleteUser(email: string): Promise<any> {
    return this.request(`/user/${email}`, "DELETE");
  }

  static async getFavoriteTeams(): Promise<any> {
    return this.request("/favorites/teams");
  }

  static async addFavoriteTeam(teamId: number): Promise<any> {
    return this.request(`/favorites/teams/${teamId}`, "POST");
  }

  static async deleteFavoriteTeam(teamId: number): Promise<any> {
    return this.request(`/favorites/teams/${teamId}`, "DELETE");
  }

  static async getFavoritePlayers(): Promise<any> {
    return this.request("/favorites/players");
  }

  static async addFavoritePlayer(playerId: number): Promise<any> {
    return this.request(`/favorites/players/${playerId}`, "POST");
  }

  static async deleteFavoritePlayer(playerId: number): Promise<any> {
    return this.request(`/favorites/players/${playerId}`, "DELETE");
  }
}

export default User;
