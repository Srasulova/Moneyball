import { LeagueStanding } from "../page";

interface LeagueStandingsProps {
    leagueName: string;
    teams: LeagueStanding[]; // Ensure this matches the type used in Home
}

export default function LeagueStandings({ leagueName, teams }: LeagueStandingsProps) {
    return (
        <div className="px-6 sm:px-14 lg:px-20">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-medium text-red-800 sm:pl-0"
                                    >
                                        {leagueName}
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-red-800">
                                        W
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        L
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        PCT
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        GB
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        WCGB
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        STRK
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        RS
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        RA
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        DIFF
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        HOME
                                    </th>
                                    <th className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-medium text-sky-900">
                                        AWAY
                                    </th>
                                    <th className="relative whitespace-nowrap py-3.5 px-2 text-left text-sm font-medium text-sky-900">
                                        Add to favorites
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sky-200 bg-white">
                                {teams.map((team, idx) => (
                                    <tr key={idx}>
                                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-sky-900 sm:pl-0">
                                            {team.name}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-red-800">
                                            {team.W}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-sky-900 font-medium">
                                            {team.L}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {team.pct}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {team.gamesBack}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {team.wildCardGamesBack}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {team.streakCode}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {team.runsScored}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {team.runsAllowed}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {team.runDifferential}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {team.HOME}
                                        </td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                            {team.AWAY}
                                        </td>
                                        <td className="relative whitespace-nowrap py-2 pl-12 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <a href="#" className="text-red-800 hover:text-red-900">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2.5}
                                                    stroke="currentColor"
                                                    className="size-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 4.5v15m7.5-7.5h-15"
                                                    />
                                                </svg>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
