"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext.js';
import { LogIn, LogOut, UserPlus, UserCircle, Home, LayoutDashboard, Menu } from 'lucide-react';

const Header = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Header: Initiating user logout.");
    await logout();
    console.log("Header: Logout complete. Redirecting to homepage.");
    router.push('/');
  };

  // Component for desktop authentication links
  const AuthLinksDesktop = () => {
    if (loading) {
      return <span className="loading loading-ring loading-md text-primary"></span>;
    }

    if (user) {
      return (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar online transition-transform duration-300 hover:scale-110">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={`https://picsum.photos/80/80?u=${user.id}`} alt="User Avatar" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-64">
            <li className="p-2 font-semibold border-b border-base-300/50 flex flex-row items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" />
              <span className="truncate">{user.email}</span>
            </li>
            <li>
              <Link href="/dashboard" className="justify-between">
                Dashboard
                <span className="badge badge-primary">New</span>
              </Link>
            </li>
            <div className="divider my-1"></div>
            <li>
              <button onClick={handleLogout} className="text-error">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      );
    }

    return (
      <div className="hidden lg:flex items-center gap-2">
        <Link href="/login" className="btn btn-ghost">
          <LogIn className="w-5 h-5 mr-1" />
          Login
        </Link>
        <Link href="/register" className="btn btn-primary btn-outline">
          <UserPlus className="w-5 h-5 mr-1" />
          Register
        </Link>
      </div>
    );
  };

  // Component for mobile authentication links
  const AuthLinksMobile = () => {
    if (loading) {
      return <li><span className="loading loading-dots loading-sm mx-auto"></span></li>;
    }

    if (user) {
      return (
        <>
          <li className="menu-title"><span>Logged in as:</span></li>
          <li className="font-semibold text-primary-focus px-4 py-2 truncate">{user.email}</li>
          <div className="divider my-0"></div>
          <li>
            <Link href="/dashboard"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="text-error"><LogOut className="w-4 h-4" /> Logout</button>
          </li>
        </>
      );
    }

    return (
      <>
        <li>
          <Link href="/login"><LogIn className="w-4 h-4" /> Login</Link>
        </li>
        <li>
          <Link href="/register"><UserPlus className="w-4 h-4" /> Register</Link>
        </li>
      </>
    );
  };

  return (
    <header className="bg-base-100/80 backdrop-blur-lg shadow-md sticky top-0 z-50 transition-all duration-300">
      <nav className="navbar container mx-auto px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <Menu className="h-5 w-5" />
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
              <li><Link href="/"><Home className="w-4 h-4" /> Home</Link></li>
              <div className="divider my-1"></div>
              <AuthLinksMobile />
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost normal-case text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hover:bg-transparent transition-all duration-300 hover:scale-105">
            AuthSecure
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-medium">
            <li><Link href="/"><Home className="w-4 h-4" /> Home</Link></li>
            {user && <li><Link href="/dashboard"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link></li>}
          </ul>
        </div>
        <div className="navbar-end">
          <AuthLinksDesktop />
        </div>
      </nav>
    </header>
  );
};

export default Header;