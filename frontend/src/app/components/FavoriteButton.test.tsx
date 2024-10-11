import { render, screen, fireEvent } from '@testing-library/react';
import FavoriteButton from './FavoriteButton';
import renderer from 'react-test-renderer';

describe('FavoriteButton Component', () => {
    const mockOnClick = jest.fn();

    // Unit tests
    it('renders the button with correct text when isFavorite is false', () => {
        render(<FavoriteButton isFavorite={false} onClick={mockOnClick} />);
        const buttonElement = screen.getByRole('button', { name: /follow/i });
        expect(buttonElement).toBeInTheDocument();
    });

    it('renders the button with correct text when isFavorite is true', () => {
        render(<FavoriteButton isFavorite={true} onClick={mockOnClick} />);
        const buttonElement = screen.getByRole('button', { name: /unfollow/i });
        expect(buttonElement).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        render(<FavoriteButton isFavorite={false} onClick={mockOnClick} />);
        const buttonElement = screen.getByRole('button', { name: /follow/i });
        fireEvent.click(buttonElement);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    // Snapshot tests
    it('matches the snapshot when isFavorite is false', () => {
        const tree = renderer.create(<FavoriteButton isFavorite={false} onClick={mockOnClick} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('matches the snapshot when isFavorite is true', () => {
        const tree = renderer.create(<FavoriteButton isFavorite={true} onClick={mockOnClick} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
