import { useEffect, useState } from "react";
import User from "../apiClient";
import MoneyballApi from "../api";
import { PlayerGeneralInfo, Team } from "../types";

const useFetchFavoritesSummary = (isLoggedIn: boolean) => {
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<number[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<Team[]>([]);
  const [favoritePlayerIds, setFavoritePlayerIds] = useState<number[]>([]);
  const [playerSummaries, setPlayerSummaries] = useState<PlayerGeneralInfo[]>(
    []
  );

  useEffect(() => {
    const fetchFavoritesSummary = async (isTeam: boolean) => {
      if (!isLoggedIn) return;

      try {
        const response = isTeam
          ? await User.getFavoriteTeams()
          : await User.getFavoritePlayers();

        console.log(`${isTeam ? "Team" : "Player"} API Response:`, response);

        // Parse IDs based on response type

        const rawIds = isTeam ? response.favoriteTeams : response;

        const ids = (Array.isArray(rawIds) ? rawIds : [])
          .map((id) => (typeof id === "string" ? parseInt(id, 10) : id))
          .filter((id) => !isNaN(id));

        console.log(`Parsed ${isTeam ? "team" : "player"} IDs:`, ids);

        if (isTeam) {
          setFavoriteTeamIds(ids);
          if (ids.length > 0) {
            const summaries = await Promise.all(
              ids.map((id: number) => MoneyballApi.getTeamInfo(id))
            );
            console.log("favorite team summaries are", summaries); // Debug log
            setTeamSummaries(summaries);
          }
        } else {
          setFavoritePlayerIds(ids);
          if (ids.length > 0) {
            const summaries = await Promise.all(
              ids.map((id: number) => MoneyballApi.getPlayerInfo(id))
            );
            console.log("favorite players summaries are", summaries); // Debug log
            setPlayerSummaries(summaries);
          }
        }
      } catch (err: any) {
        if (err.message.includes("404")) {
          console.warn(
            isTeam ? "No favorite teams found." : "No favorite players found."
          );
        } else {
          console.error(
            `Failed to fetch ${isTeam ? "team" : "player"} summaries:`,
            err
          );
        }
      }
    };

    const fetchFavorites = async () => {
      await fetchFavoritesSummary(true); // Fetch teams
      await fetchFavoritesSummary(false); // Fetch players
    };

    fetchFavorites();
  }, [isLoggedIn]);

  console.log(
    favoriteTeamIds,
    teamSummaries,
    favoritePlayerIds,
    playerSummaries
  );

  return { favoriteTeamIds, teamSummaries, favoritePlayerIds, playerSummaries };
};

export default useFetchFavoritesSummary;
