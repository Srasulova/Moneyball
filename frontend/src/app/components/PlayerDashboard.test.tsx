import { render, screen } from '@testing-library/react';
import PlayerDashboard from './PlayerDashboard';
import { PlayerGeneralInfo } from '../types';

// Mock player data to be used across tests
const mockPlayerSummary: PlayerGeneralInfo = {
    id: 1,
    fullName: 'John Doe',
    currentTeam: { name: 'Yankees' },
    primaryNumber: 12,
    primaryPosition: 'Pitcher',
    batSide: 'Left',
    pitchHand: {
        description: 'Right',
        code: '123456'
    },
};

describe('PlayerDashboard Component', () => {

    // Test case 1: Loading state
    it('renders loading message when playerSummary is null', () => {
        render(<PlayerDashboard playerSummary={null} statsType="hitting" />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    // Test case 2: Renders player information correctly
    it('renders player information correctly', () => {
        render(<PlayerDashboard playerSummary={mockPlayerSummary} statsType="hitting" />);

        // Assert the player's name is rendered
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
        // Assert the player's team is rendered
        expect(screen.getByText(/yankees/i)).toBeInTheDocument();
        // Assert the player's number, position, bat side, and pitching hand
        expect(screen.getByText(/number/i)).toBeInTheDocument();
        expect(screen.getByText(/pitcher/i)).toBeInTheDocument();
        expect(screen.getByText(/left/i)).toBeInTheDocument();
        expect(screen.getByText(/right/i)).toBeInTheDocument();
    });

    // Test case 3: Snapshot test to ensure the component renders as expected
    it('matches the snapshot', () => {
        const { asFragment } = render(<PlayerDashboard playerSummary={mockPlayerSummary} statsType="hitting" />);
        expect(asFragment()).toMatchSnapshot();
    });
});