"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext.js';
import { ShieldCheck, Zap, Layers, LogIn, LayoutDashboard, ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("HomePage: Auth status updated.", { user: !!user, loading });
  }, [user, loading]);

  const features = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-primary" />,
      title: 'Secure by Design',
      description: 'Utilizes modern security practices without the complexity. User data is handled safely using a local JSON file for simplicity.',
    },
    {
      icon: <Zap className="w-10 h-10 text-secondary" />,
      title: 'Blazing Fast & Lightweight',
      description: 'No database overhead means faster response times. Perfect for small to medium-sized applications, prototypes, and demos.',
    },
    {
      icon: <Layers className="w-10 h-10 text-accent" />,
      title: 'Modern Stack',
      description: 'Built with Next.js App Router, React Hooks, and styled with DaisyUI for a beautiful, responsive, and maintainable codebase.',
    },
  ];

  const renderCTAButton = () => {
    if (loading) {
      return (
        <button className="btn btn-primary btn-lg shadow-lg" disabled>
          <span className="loading loading-spinner"></span>
          Checking Status...
        </button>
      );
    }
    if (user) {
      return (
        <Link href="/dashboard" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1">
          Go to Dashboard <LayoutDashboard className="w-5 h-5" />
        </Link>
      );
    }
    return (
      <Link href="/auth" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1">
        Get Started <ArrowRight className="w-5 h-5" />
      </Link>
    );
  };

  return (
    <div className="space-y-20 md:space-y-32 pb-20 bg-base-200/50">
      {/* Hero Section */}
      <div className="hero min-h-[calc(80vh-80px)] bg-base-100" style={{backgroundImage: 'radial-gradient(circle at top right, hsla(var(--p)/0.1) 0%, transparent 40%), radial-gradient(circle at bottom left, hsla(var(--s)/0.1) 0%, transparent 40%)'}}>
        <div className="hero-content text-center">
          <div className="max-w-3xl py-10">
            <div className="badge badge-primary badge-outline mb-4 font-semibold">v1.0.0 - Stable Release</div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary pb-2">
              Secure & Simple Authentication
            </h1>
            <p className="py-6 text-lg md:text-xl text-base-content/80 max-w-2xl mx-auto">
              A lightweight, database-free authentication system for your Next.js projects. Built with modern tools for a seamless developer and user experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {renderCTAButton()}
              <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg group">
                View on GitHub
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Why AuthSecure?</h2>
          <p className="text-lg text-base-content/70 mt-4 max-w-2xl mx-auto">Everything you need for a robust authentication flow, without the bloat.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-xl border border-base-300/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div className="card-body items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="card-title text-2xl font-bold">{feature.title}</h3>
                <p className="text-base-content/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Up and Running in Minutes</h2>
          <p className="text-lg text-base-content/70 mt-4 max-w-2xl mx-auto">A straightforward process to get you started.</p>
        </div>
        <div className="max-w-4xl mx-auto">
            <ul className="steps steps-vertical lg:steps-horizontal w-full">
                <li data-content="1" className="step step-primary">
                    <div className="p-4 text-left lg:text-center">
                        <h3 className="font-bold text-lg">Register Account</h3>
                        <p className="text-sm text-base-content/70">Create a new account with your email and a secure password.</p>
                    </div>
                </li>
                <li data-content="2" className="step step-primary">
                    <div className="p-4 text-left lg:text-center">
                        <h3 className="font-bold text-lg">Sign In</h3>
                        <p className="text-sm text-base-content/70">Log in to your account to get a persistent session.</p>
                    </div>
                </li>
                <li data-content="✓" className={`step ${user ? 'step-primary' : ''}`}>
                    <div className="p-4 text-left lg:text-center">
                        <h3 className="font-bold text-lg">Access Dashboard</h3>
                        <p className="text-sm text-base-content/70">Explore your personal dashboard and protected content.</p>
                    </div>
                </li>
            </ul>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://picsum.photos/1200/400?random=cta" alt="Abstract background" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
            <div className="relative p-8 md:p-16 text-center text-primary-content">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Secure Your App?</h2>
                <p className="max-w-2xl mx-auto mb-8 text-lg opacity-90">
                    Integrate AuthSecure in minutes and provide your users with a safe and simple login experience.
                </p>
                {renderCTAButton()}
            </div>
        </div>
      </div>
    </div>
  );
}