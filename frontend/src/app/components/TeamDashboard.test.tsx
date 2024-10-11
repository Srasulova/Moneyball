
import { render, screen } from '@testing-library/react';
import TeamDashboard from './TeamDashboard';
import { Team } from '../types';

// Mock team data to be used across tests
const mockTeamSummary: Team = {
    id: 123,
    name: 'New York Yankees',
    season: '2024',
    firstYearOfPlay: '1901',
    league: { name: 'American League', id: 1 },
    division: { name: 'East Division', id: 101 },
    locationName: 'New York',
    leagueRank: 1,
};

describe('TeamDashboard Component', () => {

    // Test case 1: Loading state
    it('renders loading message when teamSummary is null', () => {
        render(<TeamDashboard teamSummary={null} />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    // Test case 2: Renders team information correctly
    it('renders team information correctly', () => {
        render(<TeamDashboard teamSummary={mockTeamSummary} />);

        // Assert the team's name is rendered
        expect(screen.getByText(/new york yankees/i)).toBeInTheDocument();
        // Assert the league and division names
        expect(screen.getByText(/american league/i)).toBeInTheDocument();
        expect(screen.getByText(/east division/i)).toBeInTheDocument();
        // Assert the league rank is rendered
        expect(screen.getByText(/league rank/i)).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    // Test case 3: Snapshot test to ensure the component renders as expected
    it('matches the snapshot', () => {
        const { asFragment } = render(<TeamDashboard teamSummary={mockTeamSummary} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
