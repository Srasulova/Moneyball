import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Players from './page';
import MoneyballApi from '../api';
import User from '../apiClient';


// Mock the MoneyballApi and User API calls
jest.mock('../api');
jest.mock('../apiClient');

describe('Players Component', () => {
    const mockPlayers = [
        {
            id: 1,
            fullName: 'Player One',
            currentTeam: { name: 'Team A' },
            primaryPosition: { name: 'Pitcher' },
            height: '6\'0"',
            weight: 200,
            currentAge: 30,
            birthCity: 'City A',
            birthStateProvince: 'State A',
            birthCountry: 'Country A',
            mlbDebutDate: '2010-01-01',
            draftYear: 2008,
        },
        {
            id: 2,
            fullName: 'Player Two',
            currentTeam: { name: 'Team B' },
            primaryPosition: { name: 'Catcher' },
            height: '5\'10"',
            weight: 180,
            currentAge: 28,
            birthCity: 'City B',
            birthStateProvince: 'State B',
            birthCountry: 'Country B',
            mlbDebutDate: '2012-06-01',
            draftYear: 2010,
        },
    ];

    beforeEach(() => {
        (MoneyballApi.getMlbPlayers as jest.Mock).mockResolvedValue(mockPlayers);
        (User.getFavoritePlayers as jest.Mock).mockResolvedValue({ favoritePlayers: [] });
    });

    test('renders loading state initially', () => {
        render(<Players />);
        expect(screen.getByText(/Loading players.../i)).toBeInTheDocument();
    });

    test('renders player cards after fetching players', async () => {
        render(<Players />);
        await waitFor(() => {
            expect(screen.getByText(/Player One/i)).toBeInTheDocument();
            expect(screen.getByText(/Player Two/i)).toBeInTheDocument();
        });
    });

    test('search functionality filters players', async () => {
        render(<Players />);
        await waitFor(() => {
            expect(screen.getByText(/Player One/i)).toBeInTheDocument();
            expect(screen.getByText(/Player Two/i)).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/Search teams.../i);
        fireEvent.change(searchInput, { target: { value: 'One' } });

        expect(await screen.findByText(/Player One/i)).toBeInTheDocument();
        expect(screen.queryByText(/Player Two/i)).not.toBeInTheDocument();
    });

    test('adds a player to favorites', async () => {
        // Mock the favorite players as empty initially
        (User.getFavoritePlayers as jest.Mock).mockResolvedValueOnce({ favoritePlayers: [] });

        // Mock the addFavoritePlayer to resolve successfully
        (User.addFavoritePlayer as jest.Mock).mockResolvedValueOnce({});

        render(<Players />);
        await waitFor(() => {
            expect(screen.getByText(/Player One/i)).toBeInTheDocument();
        });

        // Find all the Follow buttons
        const favoriteButtons = screen.getAllByRole('button', { name: /Follow/i });

        // Debugging output
        console.log('Favorite buttons found:', favoriteButtons.length);
        screen.debug(); // Outputs the DOM structure

        // Ensure we have at least one button
        expect(favoriteButtons.length).toBeGreaterThan(0); // Check if buttons are found

        // Click the first Follow button
        fireEvent.click(favoriteButtons[0]);

        // Wait for the mock function to be called
        await waitFor(() => {
            // Verify that addFavoritePlayer was called with the correct player ID
            expect(User.addFavoritePlayer).toHaveBeenCalledWith(mockPlayers[0].id); // Use the ID of the first mock player
        });
    });




    test('removes a player from favorites', async () => {
        (User.getFavoritePlayers as jest.Mock).mockResolvedValueOnce({ favoritePlayers: [1] });
        (User.deleteFavoritePlayer as jest.Mock).mockResolvedValueOnce({});

        render(<Players />);
        await waitFor(() => {
            expect(screen.getByText(/Player One/i)).toBeInTheDocument();
        });

        const favoriteButton = screen.getByRole('button', { name: /Unfollow/i });
        fireEvent.click(favoriteButton);

        expect(User.deleteFavoritePlayer).toHaveBeenCalledWith(1);
    });

    // Snapshot test
    test('matches snapshot', async () => {
        const { container } = render(<Players />);
        await waitFor(() => {
            expect(screen.getByText(/Player One/i)).toBeInTheDocument();
        });
        expect(container).toMatchSnapshot();
    });
});
