import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './page';
import User from '../apiClient';
import { useRouter } from 'next/navigation';


// Mock the next/navigation module
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../apiClient');

describe('Profile Component', () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    });

    test('renders Profile component', () => {
        (User.getUser as jest.Mock).mockResolvedValueOnce({
            user: {
                firstName: 'John Doe',
                email: 'john.doe@example.com',
            }
        });

        render(<Profile />);

        expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
        expect(screen.getByText(/Update Profile/i)).toBeInTheDocument();
        expect(screen.getByText(/Delete Profile/i)).toBeInTheDocument();
    });

    test('displays error message on user data fetch failure', async () => {
        (User.getUser as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch user data'));

        render(<Profile />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch user data/i)).toBeInTheDocument();
        });
    });

    test('updates user profile successfully', async () => {
        (User.getUser as jest.Mock).mockResolvedValueOnce({
            user: {
                firstName: 'John Doe',
                email: 'john.doe@example.com',
            }
        });

        (User.updateUser as jest.Mock).mockResolvedValueOnce({ success: true });

        render(<Profile />);

        // Wait for the user data to load
        await waitFor(() => {
            expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newpassword' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'newpassword' } });

        fireEvent.click(screen.getByText(/Update Profile/i));

        await waitFor(() => {
            expect(screen.getByText(/Your profile has been updated successfully/i)).toBeInTheDocument();
        });
    });

    test('displays error message if passwords do not match', async () => {
        render(<Profile />);

        fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'differentpassword' } });

        fireEvent.click(screen.getByText(/Update Profile/i));

        await waitFor(() => {
            expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        });
    });

    test('deletes user profile', async () => {
        (User.getUser as jest.Mock).mockResolvedValueOnce({
            user: {
                firstName: 'John Doe',
                email: 'john.doe@example.com',
            }
        });

        (User.deleteUser as jest.Mock).mockResolvedValueOnce({ success: true });

        render(<Profile />);

        // Wait for the user data to load
        await waitFor(() => {
            expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Delete Profile/i));

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/");
        });
    });
});
