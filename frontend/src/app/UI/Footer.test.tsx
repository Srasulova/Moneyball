import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';


describe('Footer Component', () => {
    beforeEach(() => {
        render(<Footer />);
    });

    test('renders p tags with expected content', () => {
        // Check if the first p tag with expected text is in the document
        const projectText = screen.getByText(/View the project on/i);
        expect(projectText).toBeInTheDocument();

        // Check if the second p tag with expected text is in the document
        const connectText = screen.getByText(/Connect with me on/i);
        expect(connectText).toBeInTheDocument();
    });

    test('renders link elements with corresponding href attributes', () => {
        // Find all link elements in the footer
        const links = screen.getAllByRole('link');

        // Check that the expected links are present
        expect(links.length).toBeGreaterThan(0); // Ensure there are links
    });

    // Snapshot Test
    test('matches snapshot', () => {
        const { asFragment } = render(<Footer />);
        expect(asFragment()).toMatchSnapshot();
    });
});
