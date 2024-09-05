"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Load user data from localStorage when the component mounts
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');

        if (storedName && storedEmail) {
            setName(storedName);
            setEmail(storedEmail);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validate password confirmation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        // Update user data in localStorage
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);

        if (password) {
            localStorage.setItem('userPassword', password);
        }

        setIsLoading(false);
        router.push('/profile'); // Redirect or show success message after update
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="bg-white p-8 rounded-lg shadow-2xl sm:w-96 w-full">
                <h2 className="text-3xl font-bold mb-8 text-red-800 text-center">
                    Edit Profile
                </h2>

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
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
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
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
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
                            placeholder="Enter your new password"
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
                            placeholder="Confirm your new password"
                        />
                    </div>

                    {error && (
                        <p className="mt-4 text-red-600 text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className={`w-full px-4 py-2 bg-sky-900 text-white font-semibold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>

                <div className="flex flex-col mt-8">
                    <a href="/" className="text-center text-xs text-sky-700 hover:underline">
                        Go back to Home page
                    </a>
                </div>
            </div>
        </div>
    );
}
