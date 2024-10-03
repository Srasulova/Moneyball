import Image from "next/image";
import { LeagueStanding } from "../types";
import FavoriteButton from "./FavoriteButton";

interface TeamStandingsCardProps {
    team: LeagueStanding;
    onFavoriteClick: (teamId: number) => void;
    isFavorite: boolean;
}

const TeamStandingsCard: React.FC<TeamStandingsCardProps> = ({ team, onFavoriteClick, isFavorite }) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
            <div className="flex items-center mb-2">
                <Image src={team.logoUrl} alt={team.teamName} width={40} height={40} className="mr-2" />
                <span className="text-lg font-semibold text-sky-900">{team.teamName}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-sky-900 my-4">
                <div>
                    <p className="text-red-800">Wins: <span className=" font-light text-gray-600">{team.W}</span> </p>
                    <p>Losses:<span className="font-light text-gray-600"> {team.L}</span></p>
                    <p>PCT:<span className="font-light text-gray-600"> {team.pct}</span></p>
                    <p>GB: <span className="font-light text-gray-600">{team.gamesBack}</span></p>
                </div>
                <div>
                    <p>WCGB:<span className="font-light text-gray-600"> {team.wildCardGamesBack}</span></p>
                    <p>STRK: <span className="font-light text-gray-600">{team.streakCode}</span></p>
                    <p>RS:<span className="font-light text-gray-600"> {team.runsScored}</span></p>
                </div>
                <div>
                    <p>RA:<span className="font-light text-gray-600"> {team.runsAllowed}</span></p>
                    <p>DIFF: <span className="font-light text-gray-600">{team.runDifferential}</span></p>
                    <p>HOME: <span className="font-light text-gray-600">{team.HOME}</span></p>
                    <p>AWAY: <span className="font-light text-gray-600">{team.AWAY}</span></p>
                </div>
            </div>
            <div className="flex justify-center">
                <FavoriteButton isFavorite={isFavorite} onClick={() => onFavoriteClick(team.teamId)} />
            </div>
        </div>
    );
};

export default TeamStandingsCard;
