import Image from "next/image";
import TeamStats from "./TeamStats";
import { Team } from "../types";
import User from "../apiClient";
import UnfollowButton from "./UnfollowButton";

interface TeamDashboardProps {
    teamSummary: Team | null;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamSummary }) => {

    if (!teamSummary) {
        return <div className="text-center text-sky-900 mt-20">Loading...</div>;
    }

    const handleRemoveFromFavorites = async () => {
        try {
            await User.deleteFavoriteTeam(teamSummary.id);
            // Force a page reload
            window.location.reload();
        } catch (error) {
            console.error("Failed to remove from favorites:", error);
        }
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg max-w-3xl mx-auto my-2 border border-gray-100 flex flex-col items-center w-full">
            <div className="flex">
                <div className="mb-6">
                    <div className="flex mb-4 items-center">
                        <Image
                            src={`https://www.mlbstatic.com/team-logos/team-cap-on-light/${teamSummary.id}.svg`}
                            alt={`${teamSummary.name} logo`}
                            width={40}
                            height={40}
                            className="mr-2"
                        />
                        <h2 className="text-2xl font-medium text-red-800">{teamSummary.name}</h2>
                    </div>
                    <div>
                        <p className="text-base text-red-800">League: <span className="text-sky-900">{teamSummary.league.name}</span></p>
                        <p className="text-base text-red-800">Division: <span className="text-sky-900">{teamSummary.division.name}</span></p>
                        <p className="text-base text-red-800">League Rank: <span className="text-sky-900">{teamSummary.leagueRank}</span></p>
                    </div>
                </div>
                <TeamStats teamId={teamSummary.id} season="season" />
            </div>
            <UnfollowButton removeFromFavorites={handleRemoveFromFavorites} />
        </div>
    );
};

export default TeamDashboard;
