import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Map, Award, User, Sparkles, Calendar, BookOpen } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';

export default function Sidebar() {
  const { roadmaps, activeRoadmap } = useRoadmap();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Create AI Goal', path: '/create-goal', icon: PlusCircle, highlight: true },
    { label: 'Active Roadmap', path: '/roadmap', icon: Map },
    { label: 'Badges & Rewards', path: '/profile', icon: Award },
    { label: 'Profile Settings', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 bg-slate-900/50 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        
        {/* Navigation Group */}
        <div>
          <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
            Menu
          </h3>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-purple-400 animate-pulse' : ''}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Active Roadmaps List */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Active Paths ({roadmaps.length})
            </h3>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {roadmaps.map((rm) => (
              <NavLink
                key={rm.id}
                to={`/roadmap?id=${rm.id}`}
                className={`block p-2.5 rounded-xl border text-xs transition-all ${
                  activeRoadmap?.id === rm.id
                    ? 'bg-slate-800/90 border-indigo-500/50 text-white shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between font-medium truncate mb-1">
                  <span className="truncate">{rm.goal}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
                    {rm.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                    style={{ width: `${rm.progress}%` }}
                  />
                </div>
              </NavLink>
            ))}
          </div>
        </div>

      </div>

      {/* AI Assistant Banner Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-purple-950/50 to-slate-900 border border-indigo-800/40 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-200">Groq AI Engine</span>
        </div>
        <p className="text-slate-400 leading-relaxed mb-2.5">
          Roadmaps dynamically adapt to your weekly budget & available hours.
        </p>
        <div className="flex items-center justify-between text-[11px] text-indigo-300 font-mono">
          <span>Model: Llama-3 70B</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

    </aside>
  );
}
