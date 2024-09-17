"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import User from "../apiClient";

export default function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null); // New success state
    const router = useRouter();

    // Load the user's current data when the component mounts
    useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = await User.getUser();
                console.log(userData);
                setName(userData.user.firstName);
                setEmail(userData.user.email);
            } catch (err: any) {
                setError(err.message);
            }
        }
        fetchUserData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null); // Reset success message

        // Validate password confirmation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            // Prepare data to be updated
            const updatedData: { firstName?: string; password?: string } = {};
            if (name) updatedData.firstName = name;
            if (password) updatedData.password = password;

            // Call the backend API to update the user's profile
            await User.updateUser(email, updatedData);

            setIsLoading(false);
            setSuccess("Your profile has been updated successfully!"); // Set success message
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="bg-white p-8 rounded-lg shadow-2xl sm:w-96 w-full">
                <h2 className="text-3xl font-bold mb-8 text-red-800 text-center">
                    Edit Profile
                </h2>

                {error && (
                    <div className="text-red-600 text-center mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-green-600 text-center mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-sky-900"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sky-900 focus:ring-red-800 focus:border-red-800"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-sky-900"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sky-900 focus:ring-red-800 focus:border-red-800"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-sky-900"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                            placeholder="Enter new password (optional)"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-sky-900"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-red-800 text-white rounded-md hover:bg-red-900 transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Profile"}
                    </button>
                </form>

                <button
                    type="submit"
                    className="w-full mt-2 py-2 px-4 bg-sky-900 text-white rounded-md hover:bg-sky-800 transition duration-200"

                >
                    Delete Profile
                </button>

                <div className="flex flex-col mt-8">
                    <a href="/" className="text-center text-xs text-sky-700 hover:underline hover:text-red-800">
                        Go back to Home page
                    </a>
                </div>
            </div>
        </div>
    );
}
