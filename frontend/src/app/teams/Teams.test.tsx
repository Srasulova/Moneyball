import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Teams from './page';
import MoneyballApi from '../api';
import User from '../apiClient';
import FavoriteButton from '../components/FavoriteButton';


// Mock the MoneyballApi and User API calls
jest.mock('../api');
jest.mock('../apiClient');

describe('Teams Component', () => {
    const mockTeams = [
        {
            id: 1,
            name: 'Team A',
            locationName: 'Location A',
            firstYearOfPlay: 1901,
            league: { name: 'AL' },
            division: { name: 'East' },
        },
        {
            id: 2,
            name: 'Team B',
            locationName: 'Location B',
            firstYearOfPlay: 1901,
            league: { name: 'NL' },
            division: { name: 'West' },
        },
    ];

    beforeEach(() => {
        (MoneyballApi.getMlbTeams as jest.Mock).mockResolvedValue(mockTeams);
        (User.getFavoriteTeams as jest.Mock).mockResolvedValue({ favoriteTeams: [] });
    });

    test('renders team cards after fetching teams', async () => {
        render(<Teams />);

        // Ensure team cards are displayed after fetching
        await waitFor(() => {
            expect(screen.getByText(/Team A/i)).toBeInTheDocument();
            expect(screen.getByText(/Team B/i)).toBeInTheDocument();
        });
    });

    test('search functionality filters teams', async () => {
        render(<Teams />);
        await waitFor(() => {
            expect(screen.getByText(/Team A/i)).toBeInTheDocument();
            expect(screen.getByText(/Team B/i)).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/Search teams.../i);
        fireEvent.change(searchInput, { target: { value: 'Team A' } });

        // Check that only Team A is displayed after filtering
        expect(await screen.findByText(/Team A/i)).toBeInTheDocument();
        expect(screen.queryByText(/Team B/i)).not.toBeInTheDocument();
    });

    test('adds a team to favorites', async () => {
        (User.getFavoriteTeams as jest.Mock).mockResolvedValueOnce({ favoriteTeams: [] });
        (User.addFavoriteTeam as jest.Mock).mockResolvedValueOnce({});

        render(<Teams />);
        await waitFor(() => {
            expect(screen.getByText(/Team A/i)).toBeInTheDocument();
        });

        const favoriteButton = screen.getAllByRole('button', { name: /Follow/i })[0];
        fireEvent.click(favoriteButton); // Click the Follow button for Team A

        // Check that the addFavoriteTeam API was called with the right team ID
        expect(User.addFavoriteTeam).toHaveBeenCalledWith(mockTeams[0].id);
    });

    test('removes a team from favorites', async () => {
        (User.getFavoriteTeams as jest.Mock).mockResolvedValueOnce({ favoriteTeams: [1] });
        (User.deleteFavoriteTeam as jest.Mock).mockResolvedValueOnce({});

        render(<Teams />);

        // Wait for the team to be rendered
        await waitFor(() => {
            expect(screen.getByText(/Team A/i)).toBeInTheDocument();
        });

        // Click the unfollow button for Team A
        const unfollowButton = screen.getAllByRole('button', { name: /Unfollow/i })[0];
        fireEvent.click(unfollowButton); // Click the first Unfollow button

        await waitFor(() => {
            expect(User.deleteFavoriteTeam).toHaveBeenCalledWith(1); // Ensure delete was called with the right team ID
        });

        // After unfollowing, wait for the Follow button specific to Team A
        await waitFor(() => {
            const followButtons = screen.getAllByRole('button', { name: /Follow/i });
            expect(followButtons).toHaveLength(2); // Ensure both Follow buttons are present
            expect(followButtons[0]).toBeInTheDocument(); // Check the Follow button for Team A
        });
    });

    // Snapshot test
    test('matches snapshot', async () => {
        const { container } = render(<Teams />);
        await waitFor(() => {
            expect(screen.getByText(/Team A/i)).toBeInTheDocument();
        });
        expect(container).toMatchSnapshot();
    });
});
