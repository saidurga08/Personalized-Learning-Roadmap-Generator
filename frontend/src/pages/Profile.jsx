import React from 'react';
import { Award, Flame, User, Mail, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BadgeCard from '../components/BadgeCard';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';

export default function Profile() {
  const { user } = useAuth();
  const { badges } = useRoadmap();

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-x-hidden">
          
          {/* User Profile Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={user?.name}
                className="w-24 h-24 rounded-2xl ring-4 ring-indigo-500/40 shadow-xl object-cover shrink-0"
              />

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold text-white">{user?.name || 'Alex Rivera'}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Active Learner
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> {user?.email || 'alex@example.com'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> Member since Jan 2026
                  </span>
                </div>

                {/* Streak Counter Highlight */}
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
                    <span>{user?.study_streak || 12} Day Active Study Streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge Collection Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" /> Gamification Trophy Case
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Badges are awarded programmatically based on completion progress and study streaks.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                {unlockedCount} / {badges.length} Badges Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
