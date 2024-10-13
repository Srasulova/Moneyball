import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlayerStats from '../components/PlayerStats';
import MoneyballApi from '../api'; // mock the API
import { StatsType } from '../types';


// Mock MoneyballApi
jest.mock('../api');

// Define mock data
const mockHittingStats = {
    games: 50,
    ab: 200,
    h: 50,
    hr: 5,
    avg: .250,
    obp: .320,
    slg: .400,
    ops: .720,
    rbi: 20,
    so: 30
};

const mockPitchingStats = {
    era: 3.5,
    so: 50,
    whip: 1.2,
    ip: 30,
    wins: 3,
    losses: 1,
    saves: 2,
    hrAllowed: 3,
    earnedRuns: 15,
    soPer9: 9
};

describe('PlayerStats Component', () => {
    const playerId = 12345;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('renders loading state initially', () => {
        render(<PlayerStats playerId={playerId} statsType={'hitting' as StatsType} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders hitting stats after data is loaded', async () => {
        (MoneyballApi.getPlayerHittingStats as jest.Mock).mockResolvedValue(mockHittingStats);

        render(<PlayerStats playerId={playerId} statsType={'hitting' as StatsType} />);

        await waitFor(() => {
            expect(screen.getByText('Games')).toBeInTheDocument();
            const statElements = screen.getAllByText('50');
            expect(statElements).toHaveLength(2);
        });

        expect(MoneyballApi.getPlayerHittingStats).toHaveBeenCalledTimes(1);
        expect(MoneyballApi.getPlayerHittingStats).toHaveBeenCalledWith(playerId);
    });

    test('renders error message if fetching stats fails', async () => {
        (MoneyballApi.getPlayerHittingStats as jest.Mock).mockRejectedValue(new Error('API error'));

        render(<PlayerStats playerId={playerId} statsType={'hitting' as StatsType} />);

        await waitFor(() => {
            expect(screen.getByText('API error')).toBeInTheDocument();
        });

        expect(MoneyballApi.getPlayerHittingStats).toHaveBeenCalledTimes(1);
    });

    test('renders pitching stats when pitching tab is clicked', async () => {
        (MoneyballApi.getPlayerHittingStats as jest.Mock).mockResolvedValue(mockHittingStats);
        (MoneyballApi.getPlayerPitchingStats as jest.Mock).mockResolvedValue(mockPitchingStats);

        render(<PlayerStats playerId={playerId} statsType={'hitting' as StatsType} />);

        // Wait for initial hitting stats to load
        await waitFor(() => {
            expect(screen.getByText('Games')).toBeInTheDocument();
        });

        // Click the pitching tab
        fireEvent.click(screen.getByText('Pitching'));

        // Wait for pitching stats to load
        await waitFor(() => {
            expect(screen.getByText('ERA')).toBeInTheDocument();
            expect(screen.getByText('3.5')).toBeInTheDocument(); // first value from mock pitching stats
        });

        expect(MoneyballApi.getPlayerPitchingStats).toHaveBeenCalledTimes(1);
        expect(MoneyballApi.getPlayerPitchingStats).toHaveBeenCalledWith(playerId);
    });

    test('matches snapshot', async () => {
        (MoneyballApi.getPlayerHittingStats as jest.Mock).mockResolvedValue(mockHittingStats);

        const { asFragment } = render(<PlayerStats playerId={playerId} statsType={'hitting' as StatsType} />);

        // Wait for hitting stats to load
        await waitFor(() => {
            expect(screen.getByText('Games')).toBeInTheDocument();
        });

        expect(asFragment()).toMatchSnapshot();
    });
});
