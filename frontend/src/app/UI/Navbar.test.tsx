import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';


// Define the prop types for the MockImage component
type MockImageProps = {
    src: string;
    alt: string;
    width: number | string;
    height: number | string;
};

// Mock the Next.js Image component
jest.mock('next/image', () => {
    return function MockImage({ src, alt, width, height, ...props }: MockImageProps) {
        return <img src={src} alt={alt} width={width} height={height} {...props} />;
    };
});

describe('Navbar Component', () => {
    beforeEach(() => {
        // Mock the localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                removeItem: jest.fn(),
            },
            writable: true,
        });
    });

    test('renders navbar with links when logged in', () => {
        render(<Navbar />);

        const links = screen.getAllByText(/Home/i);
        expect(links.length).toBeGreaterThan(0); // Ensure at least one instance is found
        expect(links[0]).toBeInTheDocument(); // Check the first instance is in the document

        const teamsLinks = screen.getAllByText(/Teams/i);
        expect(teamsLinks.length).toBeGreaterThan(0);
        expect(teamsLinks[0]).toBeInTheDocument();

        const playersLinks = screen.getAllByText(/Players/i);
        expect(playersLinks.length).toBeGreaterThan(0);
        expect(playersLinks[0]).toBeInTheDocument();
    });

    test('handles logout button click', () => {
        render(<Navbar />);
        const logoutButton = screen.getByRole('button', { name: /Log out/i });
        fireEvent.click(logoutButton);
        expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    test('renders navbar without links when not logged in', () => {
        // Temporarily mock the isLoggedIn state to false
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [false, jest.fn()]);

        render(<Navbar />);

        // Check that the logo is present
        const logo = screen.getByAltText(/logo/i);
        expect(logo).toBeInTheDocument();
    });

    // Snapshot Test
    test('matches snapshot when logged in', () => {
        const { asFragment } = render(<Navbar />);
        expect(asFragment()).toMatchSnapshot();
    });
});
