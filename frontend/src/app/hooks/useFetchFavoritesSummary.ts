import { useEffect, useState } from "react";
import User from "../apiClient";
import MoneyballApi from "../api";

const useFetchFavoritesSummary = (isLoggedIn: boolean) => {
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<number[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<any[]>([]);
  const [favoritePlayerIds, setFavoritePlayerIds] = useState<number[]>([]);
  const [playerSummaries, setPlayerSummaries] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavoritesSummary = async (isTeam: boolean) => {
      if (!isLoggedIn) return;

      try {
        const response = isTeam
          ? await User.getFavoriteTeams()
          : await User.getFavoritePlayers();
        const ids = isTeam
          ? response.favoriteTeams || []
          : response.favoritePlayers || [];

        if (isTeam) {
          setFavoriteTeamIds(ids);
          if (ids.length > 0) {
            const summaries = await Promise.all(
              ids.map((id: number) => MoneyballApi.getTeamInfo(id))
            );
            setTeamSummaries(summaries);
          }
        } else {
          setFavoritePlayerIds(ids);
          if (ids.length > 0) {
            const summaries = await Promise.all(
              ids.map((id: number) => MoneyballApi.getPlayerInfo(id))
            );
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

  return { favoriteTeamIds, teamSummaries, favoritePlayerIds, playerSummaries };
};

export default useFetchFavoritesSummary;
