import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Flame, Plus, User, LogOut, Award, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { roadmaps } = useRoadmap();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                LearnPath <span className="gradient-text font-black">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase -mt-1">Personalized Roadmaps</span>
            </div>
          </Link>

          {/* Active Branch Indicator Tag */}
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
            <Layers className="w-3 h-3 text-indigo-400" /> feature/frontend
          </span>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            to="/dashboard" 
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/dashboard' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/create-goal" 
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/create-goal' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Create Goal
          </Link>
          <Link 
            to="/roadmap" 
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/roadmap' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            My Roadmap
          </Link>
          <Link 
            to="/profile" 
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/profile' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Profile & Badges
          </Link>
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center space-x-3">
          {/* Study Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
            <span>{user?.study_streak || 12} Day Streak</span>
          </div>

          {/* Create New Goal Button CTA */}
          <Link
            to="/create-goal"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal</span>
          </Link>

          {/* User Avatar Menu */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <Link to="/profile" className="flex items-center gap-2 group">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={user?.name}
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/40 group-hover:ring-indigo-400 transition-all"
              />
              <span className="hidden lg:inline text-xs font-medium text-slate-200 group-hover:text-white">
                {user?.name || 'Alex Rivera'}
              </span>
            </Link>
            
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
