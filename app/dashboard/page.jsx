"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext.js';
import { User, DollarSign, ShoppingCart } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(`DashboardPage: Auth state check. Loading: ${loading}, User: ${!!user}`);
    // Redirect if auth check is complete and no user is found
    if (!loading && !user) {
      console.log("DashboardPage: No authenticated user found, redirecting to /auth.");
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Loading state: Show a full-screen loader while checking auth status.
  // This is crucial to prevent flashing the dashboard content to unauthenticated users before redirection.
  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-base-200/50">
        <div className="text-center p-8 bg-base-100 rounded-2xl shadow-xl">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <h2 className="text-2xl font-semibold text-base-content">Securing your session...</h2>
            <p className="mt-2 text-base-content/70">Please wait while we verify your credentials.</p>
        </div>
      </div>
    );
  }

  // Authenticated view: Render the dashboard content if the user is logged in.
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg text-primary-content">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">Dashboard</h1>
          <p className="mt-2 text-primary-content/90">
            Welcome back, <span className="font-semibold">{user.email}</span>!
          </p>
        </div>
        <div className="flex items-center gap-2">
            <div className="avatar online">
                <div className="w-12 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
                    <img src={`https://picsum.photos/80/80?u=${user.id}`} alt="User Avatar" />
                </div>
            </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats shadow-lg w-full stats-vertical lg:stats-horizontal border border-base-300/20">
        <div className="stat group hover:bg-primary/10 transition-colors duration-300">
          <div className="stat-figure text-primary group-hover:scale-110 transition-transform duration-300">
            <User className="inline-block w-8 h-8" />
          </div>
          <div className="stat-title">New Users</div>
          <div className="stat-value text-primary">31K</div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>
        
        <div className="stat group hover:bg-secondary/10 transition-colors duration-300">
          <div className="stat-figure text-secondary group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="inline-block w-8 h-8" />
          </div>
          <div className="stat-title">Revenue</div>
          <div className="stat-value text-secondary">$4,200</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>
        
        <div className="stat group hover:bg-accent/10 transition-colors duration-300">
          <div className="stat-figure text-accent group-hover:scale-110 transition-transform duration-300">
            <ShoppingCart className="inline-block w-8 h-8" />
          </div>
          <div className="stat-title">New Orders</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>

      {/* Content Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl col-span-1 lg:col-span-2 border border-base-300/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <figure className="px-10 pt-10">
            <img src="https://picsum.photos/800/400?random=1" alt="Sales Chart" className="rounded-xl" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              Sales Analytics
              <div className="badge badge-secondary">LIVE</div>
            </h2>
            <p>An overview of sales performance for the current quarter. The trend is positive, with a significant increase in the last month.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">View Report</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <ul className="space-y-4 mt-4">
              <li className="flex items-start gap-4">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img src="https://picsum.photos/60/60?random=2" alt="User avatar" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">New user registered</p>
                  <p className="text-sm text-base-content/60">jane.doe@example.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img src="https://picsum.photos/60/60?random=3" alt="User avatar" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Order #12345 shipped</p>
                  <p className="text-sm text-base-content/60">2 minutes ago</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img src="https://picsum.photos/60/60?random=4" alt="User avatar" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Password updated</p>
                  <p className="text-sm text-base-content/60">john.smith@example.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Placeholder Table */}
      <div className="card bg-base-100 shadow-xl border border-base-300/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div className="card-body">
          <h2 className="card-title">Project Status</h2>
          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Project Name</th>
                  <th>Team</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover">
                  <th>1</th>
                  <td>AuthSecure Frontend</td>
                  <td>React Devs</td>
                  <td><span className="badge badge-success badge-outline">Completed</span></td>
                </tr>
                <tr className="hover">
                  <th>2</th>
                  <td>API Integration</td>
                  <td>Backend Team</td>
                  <td><span className="badge badge-warning badge-outline">In Progress</span></td>
                </tr>
                <tr className="hover">
                  <th>3</th>
                  <td>UI/UX Redesign</td>
                  <td>Designers</td>
                  <td><span className="badge badge-info badge-outline">Planning</span></td>
                </tr>
                <tr className="hover">
                  <th>4</th>
                  <td>Database Migration</td>
                  <td>DB Admins</td>
                  <td><span className="badge badge-error badge-outline">Stalled</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}