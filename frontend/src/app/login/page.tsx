"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import User from "../apiClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null); // Reset the error before attempting login

    try {
      // Call the User class login method
      const response = await User.login(email, password);

      // Store the token in localStorage upon successful login
      localStorage.setItem("token", response.token);

      // Redirect to home page upon successful login
      router.push('/');
    } catch (error) {
      // Handle login errors
      setLoginError((error as Error).message || 'An error occurred during login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-lg shadow-2xl sm:w-96 w-full">
        <h2 className="text-3xl font-bold mb-8 text-sky-900 text-center">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-sky-900">Email</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-sky-900">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-800 focus:border-red-800"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-sky-900 text-white font-semibold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2"
          >
            Login
          </button>

          {loginError && (
            <p className="mt-4 text-red-600 text-center">{loginError}</p>
          )}
        </form>

        <div className="flex flex-col">
          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-red-800 font-medium hover:underline">Sign up here</Link>
          </p>
          <Link href="/" className="mt-4 text-center text-xs text-sky-700 hover:underline">Go back to Home page</Link>
        </div>
      </div>
    </div>
  );
}