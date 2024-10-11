import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TeamStats from './TeamStats';
import MoneyballApi from '../api';
import { HittingStats, PitchingStats, FieldingStats } from '../types';
import renderer from 'react-test-renderer';

jest.mock('../api');

// Mock data for each stats type
const mockHittingStats: HittingStats = {
    avg: '0.250',
    homeRuns: '20',
    obp: '0.300',
    slg: '0.450',
    ops: '0.750',
    runs: '50',
    hits: '100',
    strikeOuts: '80',
    stolenBases: '10',
    rbi: '40',
};

const mockPitchingStats: PitchingStats = {
    era: '3.50',
    strikeOuts: '200',
    baseOnBalls: '70',
    whip: '1.25',
    inningsPitched: '180',
    wins: '15',
    losses: '5',
    saves: '25',
    blownSaves: '5',
    strikeoutWalkRatio: '2.5',
};

const mockFieldingStats: FieldingStats = {
    fieldingPercentage: '0.980',
    errors: '10',
    assists: '150',
    putOuts: '120',
    chances: '160',
    doublePlays: '20',
    triplePlays: '5',
    passedBall: '2',
    throwingErrors: '3',
    rangeFactorPerGame: '2.5',
};

describe('TeamStats Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state', () => {
        (MoneyballApi.getHittingStats as jest.Mock).mockResolvedValueOnce(new Promise(() => { }));

        render(<TeamStats teamId={1} season="2023" />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders error message when stats fetch fails', async () => {
        (MoneyballApi.getHittingStats as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch stats'));

        render(<TeamStats teamId={1} season="2023" />);

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch stats')).toBeInTheDocument();
        });
    });

    test('renders hitting stats after data is loaded', async () => {
        (MoneyballApi.getHittingStats as jest.Mock).mockResolvedValueOnce(mockHittingStats);

        render(<TeamStats teamId={1} season="2023" />);

        await waitFor(() => {
            expect(screen.getByText('BA')).toBeInTheDocument();
            expect(screen.getByText('0.250')).toBeInTheDocument(); // First value from hitting stats
        });
    });

    test('renders pitching stats after switching tabs', async () => {
        (MoneyballApi.getHittingStats as jest.Mock).mockResolvedValueOnce(mockHittingStats);
        (MoneyballApi.getPitchingStats as jest.Mock).mockResolvedValueOnce(mockPitchingStats);

        render(<TeamStats teamId={1} season="2023" />);

        await waitFor(() => {
            expect(screen.getByText('BA')).toBeInTheDocument(); // Check if hitting stats are rendered
        });

        // Simulate changing to pitching stats
        fireEvent.click(screen.getByText('Pitching'));

        await waitFor(() => {
            expect(screen.getByText('ERA')).toBeInTheDocument();
            expect(screen.getByText('3.50')).toBeInTheDocument(); // First value from pitching stats
        });
    });

    test('renders fielding stats after switching tabs', async () => {
        (MoneyballApi.getHittingStats as jest.Mock).mockResolvedValueOnce(mockHittingStats);
        (MoneyballApi.getFieldingStats as jest.Mock).mockResolvedValueOnce(mockFieldingStats);

        render(<TeamStats teamId={1} season="2023" />);

        await waitFor(() => {
            expect(screen.getByText('BA')).toBeInTheDocument(); // Check if hitting stats are rendered
        });

        // Simulate changing to fielding stats
        fireEvent.click(screen.getByText('Fielding'));

        await waitFor(() => {
            expect(screen.getByText('FPCT')).toBeInTheDocument();
            expect(screen.getByText('0.980')).toBeInTheDocument(); // First value from fielding stats
        });
    });

    test('changes stats type on tab click and fetches correct data', async () => {
        (MoneyballApi.getHittingStats as jest.Mock).mockResolvedValueOnce(mockHittingStats);
        (MoneyballApi.getPitchingStats as jest.Mock).mockResolvedValueOnce(mockPitchingStats);

        render(<TeamStats teamId={1} season="2023" />);

        await waitFor(() => {
            expect(screen.getByText('BA')).toBeInTheDocument(); // Check if hitting stats are rendered
        });

        // Simulate changing to pitching stats
        fireEvent.click(screen.getByText('Pitching'));

        expect(MoneyballApi.getPitchingStats).toHaveBeenCalledWith(1); // Check if the API is called for pitching stats
    });

    test('matches snapshot', async () => {
        (MoneyballApi.getHittingStats as jest.Mock).mockResolvedValueOnce(mockHittingStats);

        const component = renderer.create(<TeamStats teamId={1} season="2023" />);
        await waitFor(() => {
            expect(component.toJSON()).toMatchSnapshot(); // Wait for rendering
        });
    });
});
