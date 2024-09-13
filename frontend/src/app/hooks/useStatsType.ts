import { useState } from "react";
import { StatsType } from "../types";

export const useStatsType = (initialType: StatsType) => {
  const [statsType, setStatsType] = useState<StatsType>(initialType);

  const handleTabClick = (type: StatsType) => {
    setStatsType(type);
  };

  return { statsType, handleTabClick };
};
