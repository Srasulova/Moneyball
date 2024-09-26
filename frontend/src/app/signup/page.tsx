'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import User from "../apiClient";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [signupError, setSignupError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false); // New state for registering status

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignupError(null);
        setSuccessMessage(null);

        // Reset field-specific errors
        setNameError(null);
        setEmailError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);

        // Basic validation
        if (!name) setNameError("Name is required");
        if (!email) setEmailError("Email is required");
        if (!password) setPasswordError("Password is required");
        if (!confirmPassword) setConfirmPasswordError("Confirm Password is required");

        if (password !== confirmPassword) {
            setSignupError("Passwords do not match");
            return;
        }

        if (nameError || emailError || passwordError || confirmPasswordError) {
            return; // Exit early if there are validation errors
        }

        setIsRegistering(true); // Set registering status to true

        try {
            const response = await User.register(name, email, password);
            localStorage.setItem("token", response.token);
            setSuccessMessage("Registration successful! Redirecting to home page...");

            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (error) {
            if (error instanceof Error) {
                const errorMessage = error.message;
                if (errorMessage.includes("email")) {
                    if (errorMessage.includes("Duplicate email")) {
                        setEmailError("This email is already registered");
                    } else {
                        setEmailError("Please enter a valid email address");
                    }
                } else if (errorMessage.includes("password")) {
                    setPasswordError("Password must be at least 6 characters long");
                } else {
                    setSignupError('An error occurred during signup');
                }
            } else {
                setSignupError('An unexpected error occurred');
            }
        } finally {
            setIsRegistering(false); // Reset registering status after the request
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="bg-white p-8 rounded-lg shadow-2xl sm:w-96 w-full">
                <h2 className="text-3xl font-bold mb-8 text-sky-900 text-center">
                    Sign Up
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
                        {nameError && <p className="mt-2 text-red-600">{nameError}</p>}
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
                        {emailError && <p className="mt-2 text-red-600">{emailError}</p>}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-sky-900"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
                            placeholder="Enter your password"
                        />
                        {passwordError && <p className="mt-2 text-red-600">{passwordError}</p>}
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
                            placeholder="Confirm your password"
                        />
                        {confirmPasswordError && <p className="mt-2 text-red-600">{confirmPasswordError}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-sky-900 text-white font-semibold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2"
                    >
                        {isRegistering ? "Registering..." : "Register"} {/* Conditional button text */}
                    </button>

                    {signupError && (
                        <p className="mt-4 text-red-600 text-center">{signupError}</p>
                    )}

                    {successMessage && (
                        <p className="mt-4 text-green-600 text-center">{successMessage}</p>
                    )}
                </form>

                <div className="flex flex-col">
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-red-800 font-medium hover:underline">
                            Log In
                        </Link>
                    </p>
                    <Link href="/" className="mt-4 text-center text-xs text-sky-700 hover:underline">
                        Go back to Home page
                    </Link>
                </div>
            </div>
        </div>
    );
}
