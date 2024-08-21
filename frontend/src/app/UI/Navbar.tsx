'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import logo from "../../../public/logo-no.png"

export function Navbar() {
    const pathname = usePathname()

    return (
        <>
            <nav className="bg-sky-900">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* <!-- Mobile menu button--> */}
                            <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-orange-100 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                {/* <!--
                                Icon when menu is closed.

                                Menu open: "hidden", Menu closed: "block"
          --> */}
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                {/* <!--
                                Icon when menu is open.

                                Menu open: "block", Menu closed: "hidden"
          --> */}
                                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-center sm:justify-center">
                            <div className="flex flex-shrink-0 items-center">
                                <Image className="h-32 w-auto" src={logo} alt="logo" />
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <Link
                                        href="/"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                            }`}
                                        aria-current="page"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/teams"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/teams' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                            }`}
                                    >
                                        Teams
                                    </Link>
                                    <Link
                                        href="/players"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/players' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                            }`}
                                    >
                                        Players
                                    </Link>
                                    <Link
                                        href="/login"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/login' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                            }`}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/signup' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                            }`}
                                    >
                                        Sign up
                                    </Link>
                                    <Link
                                        href="/logout"
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/logout' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                            }`}
                                    >
                                        Log out
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* <!-- Mobile menu, show/hide based on menu state. --> */}
                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link
                            href="/"
                            className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/' ? 'bg-orange-50 text-sky-900' : 'bg-sky-900 text-orange-100hover:decoration-1 hover:underline'
                                }`}
                            aria-current="page"
                        >
                            Home
                        </Link>
                        <Link
                            href="/teams"
                            className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/teams' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                }`}
                        >
                            Teams
                        </Link>
                        <Link
                            href="/players"
                            className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/players' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                }`}
                        >
                            Players
                        </Link>
                        <Link
                            href="/login"
                            className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/login' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                }`}
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/signup' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                }`}
                        >
                            Sign up
                        </Link>
                        <Link
                            href="/logout"
                            className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/logout' ? 'bg-orange-50 text-sky-900' : 'text-orange-100 hover:decoration-1 hover:underline'
                                }`}
                        >
                            Log out
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}