'use client'
import { Coins, Moon, LogIn, Clock, LogOut, User, Menu, X, Zap, Star, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { useCredits } from '../hooks/useCredits';
import imgbtfly from "../../public/images/imgbtfly.png"
import Image from 'next/image';

export default function Navbar() {
    const [showLogout, setShowLogout] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const { user, loading } = useAuth();
    const { credits, loading: creditsLoading, refreshCredits } = useCredits();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowLogout(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
        }
        checkSession();
    }, []);

    useEffect(() => {
        if (openMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [openMenu]);

    if (loading) {
        return (
            <nav className="lg:h-[10vh] h-[8vh] z-50 backdrop-glass fixed right-0 top-0 left-0 w-full border-b border-primary-500/20">
                <div className="flex justify-center items-center h-full">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-300">Loading...</span>
                    </div>
                </div>
            </nav>
        );
    }

    const navItems = [
        { link: "Home", path: "/" },
        { link: "Image Editor", path: "/editor" },
        
    ];

    const handleNavClick = (path: string) => {
        if (path === "/editor") {
            if (user) {
                router.push('/editor');
            } else {
                router.push('/signup');
            }
        } else {
            router.push(path);
        }
        setOpenMenu(false);
    };

    const toggleProfile = () => {
        setShowLogout(!showLogout);
    };

    const toggleMobileMenu = () => {
        setOpenMenu(!openMenu);
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error);
                return;
            }
            
            setShowLogout(false);
            setOpenMenu(false);
            router.push('/');
            
            console.log('User logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            <nav className={`lg:h-[10vh] h-[8vh] z-50 fixed right-0 top-0 left-0 w-full transition-all duration-300 ${
                scrolled ? 'backdrop-glass border-b border-primary-500/30' : 'bg-dark-bg/80 border-b border-primary-500/20'
            }`}>
                <div className='flex justify-between items-center px-6 lg:px-8 h-full'>
                    {/* Mobile menu button */}
                    <button 
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200" 
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        <div className="relative w-6 h-6">
                            <Menu 
                                color="white" 
                                size={24} 
                                className={`absolute inset-0 transition-all duration-300 ${openMenu ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}
                            />
                            <X 
                                color="white" 
                                size={24} 
                                className={`absolute inset-0 transition-all duration-300 ${openMenu ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}
                            />
                        </div>
                    </button>

                    {/* Mobile logo */}
                    <div className='lg:hidden flex items-center gap-2'>
                        <Image src={imgbtfly} alt="able logo" height={32} width={32} className="animate-float" />
                        <h1 className="logo text-xl">able</h1>
                    </div>

                    {/* Desktop navigation */}
                    <div className='hidden lg:flex justify-between items-center w-full'>
                        {/* Logo */}
                        <div className='flex items-center gap-3 hover-lift'>
                            <Image src={imgbtfly} alt="able logo" height={40} width={40} className="animate-float" />
                            <h1 className="logo text-2xl">able</h1>
                        </div>

                        {/* Navigation links */}
                        <div className='flex items-center'>
                            <ul className='flex items-center gap-8'>
                                {navItems.map((navItem) => (
                                    <li key={navItem.path}>
                                        <button 
                                            onClick={() => handleNavClick(navItem.path)}
                                            className={`nav-link px-3 py-2 rounded-lg transition-all duration-200 ${
                                                isActive(navItem.path) 
                                                    ? 'text-primary-400 bg-primary-500/10' 
                                                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                            }`}
                                        >
                                            {navItem.link}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right side items */}
                        <div className='flex items-center gap-4'>
                            {/* Theme toggle */}
                            {/* <button 
                                className='p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200'
                                aria-label="Toggle dark mode"
                            >
                                <Moon stroke="white" size={20} />
                            </button> */}

                            {user ? (
                                <>
                                    {/* Credits display */}
                                    <div className="glass-light rounded-full px-4 py-2 flex items-center gap-3 hover-glow">
                                        <Zap color="#cb50ff" size={18} />
                                        <span className="text-white text-sm font-medium">
                                            {creditsLoading ? (
                                                <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                `${credits ?? 0} credits`
                                            )}
                                        </span>
                                    </div>

                                    {/* Profile dropdown */}
                                    <div className="relative" ref={profileRef}>
                                        <button 
                                            onClick={toggleProfile} 
                                            className='w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-500 flex justify-center items-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-glow'
                                        >
                                            <span className="text-white font-semibold">
                                                {user.email?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        </button>
                                        
                                        {showLogout && (
                                            <div className='absolute right-0 top-14 glass-card min-w-[180px] animate-scale-in'>
                                                <div className='p-4 border-b border-gray-700'>
                                                    <p className='text-white font-medium truncate'>{user.email}</p>
                                                    {/* <p className='text-gray-400 text-sm flex items-center gap-1 mt-1'>
                                                        <Star size={14} className="text-primary-500" />
                                                        Pro Member
                                                    </p> */}
                                                </div>
                                                <ul className='p-2'>
                                                    {/* <li>
                                                        <button className='w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors py-2 px-3 rounded-lg'> 
                                                            <User size={16} /> Profile
                                                        </button>
                                                    </li> */}
                                                    {/* <li>
                                                        <button className='w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors py-2 px-3 rounded-lg'> 
                                                            <Clock size={16} /> History
                                                        </button>
                                                    </li> */}
                                                    <li className='border-t border-gray-700 mt-2 pt-2'>
                                                        <button 
                                                            onClick={handleLogout}
                                                            className='w-full flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors py-2 px-3 rounded-lg'
                                                        > 
                                                            <LogOut size={16} /> Logout
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <Link href="/signup" className="btn-secondary flex items-center gap-2">
                                    <LogIn size={18} />
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile sign in button */}
                    {!user && (
                        <div className="lg:hidden">
                            <Link href="/signup" className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                                <LogIn color="#cb50ff" size={20} />
                            </Link>
                        </div>
                    )}

                    {/* Mobile user avatar */}
                    {user && (
                        <div className="lg:hidden">
                            <button 
                                onClick={toggleProfile}
                                className='w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-500 flex justify-center items-center rounded-full text-white text-sm font-semibold'
                            >
                                {user.email?.[0]?.toUpperCase() || 'U'}
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile menu overlay */}
            {openMenu && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
                        onClick={toggleMobileMenu}
                    />
                    
                    <div className='fixed top-[8vh] left-0 w-full h-[calc(100vh-8vh)] backdrop-glass z-50 lg:hidden animate-slide-in'>
                        <div className='p-6 space-y-6'>
                            {/* Navigation items */}
                            <div className='space-y-2'>
                                {navItems.map((navItem) => (
                                    <button
                                        key={navItem.path}
                                        onClick={() => handleNavClick(navItem.path)}
                                        className={`w-full text-left py-4 px-6 rounded-xl transition-all duration-200 ${
                                            isActive(navItem.path)
                                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="text-lg font-medium">{navItem.link}</span>
                                    </button>
                                ))}
                            </div>

                            {user && (
                                <>
                                    {/* Credits display */}
                                    <div className="glass-light rounded-xl p-4 flex items-center gap-3 ">
                                        <Zap color="#cb50ff" size={20} />
                                        <span className="text-white font-medium">
                                            {creditsLoading ? 'Loading...' : `${credits ?? 0} credits available`}
                                        </span>
                                    </div>

                                    {/* Profile actions */}
                                    <div className='space-y-2'>
                                        {/* <button className='w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors py-3 px-4 rounded-lg'> 
                                            <User size={18} /> 
                                            <span>Profile Settings</span>
                                        </button> */}
                                        {/* <button onClick={()=> router.push('/profile/my-generations')} className='w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors py-3 px-4 rounded-lg'> 
                                            <Clock size={18} /> 
                                            <span>Generation History</span>
                                        </button> */}
                                        <button 
                                            onClick={handleLogout}
                                            className='w-full flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors py-3 px-4 rounded-lg'
                                        > 
                                            <LogOut size={18} /> 
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}

                            {!user && (
                                <div className='space-y-3 flex flex-col justify-center items-center'>
                                    <Link href="/signup" className="btn-primary w-full flex justify-center items-center gap-2" onClick={() => setOpenMenu(false)}>
                                        <UserPlus size={18} />
                                        Create Account
                                    </Link>
                                    <Link href="/login" className="btn-secondary w-full flex justify-center items-center gap-2" onClick={() => setOpenMenu(false)}>
                                        <LogIn size={18} />
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}