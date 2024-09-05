'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from "../../../public/logo-no.png"

export function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()

    // Simulate a logged-in state 
    const [isLoggedIn, setIsLoggedIn] = useState(true)

    const handleLogout = () => {
        // Clear login status from localStorage
        localStorage.removeItem('isLoggedIn')

        // Update the local state
        setIsLoggedIn(false)

        // Redirect to the home page
        window.location.href = '/'
    }


    return (
        <>
            {isLoggedIn ? (
                <nav className="bg-sky-900">
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-20 items-center justify-between">
                            {/* Mobile menu button */}
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <button
                                    type="button"
                                    className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    aria-controls="mobile-menu"
                                    aria-expanded={mobileMenuOpen}
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {mobileMenuOpen ? (
                                        <svg
                                            className="block h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="block h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Left Side (Logo and Navigation Links) */}
                            <div className="flex flex-1 items-center justify-center space-x-4">
                                <Image className="h-16 w-auto" src={logo} alt="logo" />
                                <div className="hidden sm:flex space-x-4">
                                    <Link
                                        href="/"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/' ? 'bg-white text-sky-900' : 'text-white hover:decoration-1 hover:underline'
                                            }`}
                                        aria-current="page"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/teams"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/teams' ? 'bg-white text-sky-900' : 'text-white hover:decoration-1 hover:underline'
                                            }`}
                                    >
                                        Teams
                                    </Link>
                                    <Link
                                        href="/players"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/players' ? 'bg-white text-sky-900' : 'text-white hover:decoration-1 hover:underline'
                                            }`}
                                    >
                                        Players
                                    </Link>
                                </div>
                            </div>

                            {/* Right Side (Log out Button) */}
                            <div className="hidden sm:flex items-center">
                                {/* Logout btn */}
                                <button
                                    onClick={handleLogout}
                                    className={`rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-800`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>

                                </button>


                                {/* User Profile */}
                                <Link
                                    href="/profile"
                                    className={`rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sky-800`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu, show/hide based on menu state */}
                    <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            <Link
                                href="/"
                                className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/' ? 'bg-white text-sky-900' : 'bg-sky-900 text-white hover:decoration-1 hover:underline'
                                    }`}
                                aria-current="page"
                            >
                                Home
                            </Link>
                            <Link
                                href="/teams"
                                className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/teams' ? 'bg-white text-sky-900' : 'text-white hover:decoration-1 hover:underline'
                                    }`}
                            >
                                Teams
                            </Link>
                            <Link
                                href="/players"
                                className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/players' ? 'bg-white text-sky-900' : 'text-white hover:decoration-1 hover:underline'
                                    }`}
                            >
                                Players
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700`}
                            >
                                Log out
                            </button>

                        </div>
                    </div>
                </nav>
            ) : (
                <nav className="bg-sky-900">
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-20 items-center justify-between">
                            <div className="flex flex-1 items-center justify-center space-x-4">
                                <Image className="h-16 w-auto" src={logo} alt="logo" />
                            </div>
                        </div>
                    </div>
                </nav>
            )}
        </>
    )
}
