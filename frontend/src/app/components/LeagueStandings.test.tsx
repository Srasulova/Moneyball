import { render, screen, fireEvent } from '@testing-library/react';
import LeagueStandings from './LeagueStandings';
import User from '../apiClient';
import { LeagueStanding } from "../types";

// Define types for the User methods
type UserApiMethods = {
    getFavoriteTeams: jest.Mock;
    addFavoriteTeam: jest.Mock;
    deleteFavoriteTeam: jest.Mock;
};

// Mock User API client methods with type
jest.mock('../apiClient', () => ({
    getFavoriteTeams: jest.fn(),
    addFavoriteTeam: jest.fn(),
    deleteFavoriteTeam: jest.fn(),
}));

// Cast the mocked User to the type defined
const mockUser = User as unknown as UserApiMethods;

const mockTeams: LeagueStanding[] = [
    {
        teamId: 1,
        teamName: 'Team A',
        leagueId: 101,
        leagueName: 'American League',
        logoUrl: 'https://example.com/logoA.png',
        W: 10,
        L: 5,
        pct: 0.667,
        gamesBack: "0",
        wildCardGamesBack: "0",
        streakCode: 'W',
        runsScored: 50,
        runsAllowed: 40,
        runDifferential: 10,
        HOME: "5",
        AWAY: "5",
    },
    {
        teamId: 2,
        teamName: 'Team B',
        leagueId: 101,
        leagueName: 'American League',
        logoUrl: 'https://example.com/logoB.png',
        W: 8,
        L: 7,
        pct: 0.533,
        gamesBack: "2",
        wildCardGamesBack: "1",
        streakCode: 'L',
        runsScored: 45,
        runsAllowed: 50,
        runDifferential: -5,
        HOME: "4",
        AWAY: "4",
    },
];

describe('LeagueStandings Component', () => {
    beforeEach(() => {
        mockUser.getFavoriteTeams.mockResolvedValue({ favoriteTeams: [1] }); // Simulating that Team A is a favorite
    });

    it('renders the league standings correctly', () => {
        render(<LeagueStandings leagueName="AL East" teams={mockTeams} />);

        // Check if league name is rendered
        const leagueNames = screen.getAllByText(/al east/i);
        expect(leagueNames.length).toBeGreaterThan(0); // Check that at least one instance exists

        // Check if Team A is rendered
        expect(screen.getByText(/team a/i)).toBeInTheDocument();

        // Check if Team B is rendered
        expect(screen.getByText(/team b/i)).toBeInTheDocument();
    });

    it('calls handleFavoriteClick when favorite button is clicked for Team A', async () => {
        render(<LeagueStandings leagueName="AL East" teams={mockTeams} />);

        // Click the favorite button for Team A
        const favoriteButtons = screen.getAllByRole('button', { name: /follow/i });
        fireEvent.click(favoriteButtons[0]);

        // Check if the addFavoriteTeam was called with the correct teamId
        expect(mockUser.addFavoriteTeam).toHaveBeenCalledWith(1);
    });

    it('calls handleFavoriteClick when favorite button is clicked for Team B', async () => {
        render(<LeagueStandings leagueName="AL East" teams={mockTeams} />);

        // Click the favorite button for Team B
        const favoriteButtons = screen.getAllByRole('button', { name: /follow/i });
        fireEvent.click(favoriteButtons[1]);

        // Check if the addFavoriteTeam was called with the correct teamId
        expect(mockUser.addFavoriteTeam).toHaveBeenCalledWith(2);
    });

    it('matches the snapshot', () => {
        const { asFragment } = render(<LeagueStandings leagueName="AL East" teams={mockTeams} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
