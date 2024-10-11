import { render, screen, fireEvent } from '@testing-library/react';
import UnfollowButton from './UnfollowButton';

// Mock the removeFromFavorites function
const mockRemoveFromFavorites = jest.fn();

describe('UnfollowButton Component', () => {
    it('renders the button with correct text', () => {
        render(<UnfollowButton removeFromFavorites={mockRemoveFromFavorites} />);

        // Check if the button is rendered with the correct text
        const buttonElement = screen.getByRole('button', { name: /unfollow/i });
        expect(buttonElement).toBeInTheDocument();
    });

    it('calls removeFromFavorites when clicked', async () => {
        render(<UnfollowButton removeFromFavorites={mockRemoveFromFavorites} />);

        // Get the button element
        const buttonElement = screen.getByRole('button', { name: /unfollow/i });

        // Simulate a button click
        fireEvent.click(buttonElement);

        // Ensure the mock function is called
        expect(mockRemoveFromFavorites).toHaveBeenCalledTimes(1);
    });
});
