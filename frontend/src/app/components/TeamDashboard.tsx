import Image from "next/image";

interface TeamDashboardProps {
    teamId: number;
    season: string;
    teamSummary: {
        teamName: string;
        leagueName: string;
        division: string;
        leagueRank: string;
    } | null;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamId, teamSummary }) => {
    if (!teamSummary) {
        return <div className="text-center text-sky-900 mt-20">Loading...</div>;
    }

    return (

        <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto my-4">
            <div className="mb-6">
                <div className="flex mb-4 items-center">
                    <Image src={`https://www.mlbstatic.com/team-logos/team-cap-on-light/${teamId}.svg`} alt={`${teamSummary.teamName} logo`} width={40}
                        height={40}
                        className="mr-2" />
                    <h2 className="text-2xl font-medium text-red-800">{teamSummary.teamName}</h2>
                </div>
                <p className="text-base  text-red-800">League: <span className="text-sky-900">{teamSummary.leagueName}</span> </p>
                <p className="text-base  text-red-800">Division: <span className="text-sky-900">{teamSummary.division}</span> </p>
                <p className="ttext-base  text-red-800">League Rank: <span className="text-sky-900">{teamSummary.leagueRank}</span> </p>
            </div>
        </div>
    );
};

export default TeamDashboard;
