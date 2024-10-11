import { render, screen, fireEvent } from "@testing-library/react";
import TeamStandingsCard from "./TeamStandingsCard";
import { LeagueStanding } from "../types";

// Mock data for testing
const mockTeam: LeagueStanding = {
    teamId: 1,
    teamName: "Test Team",
    leagueId: 1,
    leagueName: "Test League",
    logoUrl: "/path/to/logo.png",
    W: 10,
    L: 5,
    pct: 0.667,
    gamesBack: "2",
    wildCardGamesBack: "1",
    streakCode: "W3",
    runsScored: 100,
    runsAllowed: 80,
    runDifferential: 20,
    HOME: "5-2",
    AWAY: "5-3",
};

describe("TeamStandingsCard", () => {
    const onFavoriteClick = jest.fn(); // Mock function for favorite click

    beforeEach(() => {
        render(<TeamStandingsCard team={mockTeam} onFavoriteClick={onFavoriteClick} isFavorite={false} />);
    });

    it("renders team information correctly", () => {
        expect(screen.getByText("Test Team")).toBeInTheDocument();
        expect(screen.getByText(/Wins:/)).toHaveTextContent(`Wins: ${mockTeam.W}`);
        expect(screen.getByText(/Losses:/)).toHaveTextContent(`Losses: ${mockTeam.L}`);
        expect(screen.getByText(/PCT:/)).toHaveTextContent(`PCT: ${mockTeam.pct}`);

        // Use getAllByText for "GB:"
        const gbElements = screen.getAllByText(/GB:/);
        expect(gbElements[0]).toHaveTextContent(`GB: ${mockTeam.gamesBack}`);

        expect(screen.getByText(/WCGB:/)).toHaveTextContent(`WCGB: ${mockTeam.wildCardGamesBack}`);
    });

    it("calls onFavoriteClick when favorite button is clicked", () => {
        const favoriteButton = screen.getByRole("button");
        fireEvent.click(favoriteButton);
        expect(onFavoriteClick).toHaveBeenCalledWith(mockTeam.teamId);
    });

    it("matches the snapshot", () => {
        const { asFragment } = render(<TeamStandingsCard team={mockTeam} onFavoriteClick={onFavoriteClick} isFavorite={false} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
