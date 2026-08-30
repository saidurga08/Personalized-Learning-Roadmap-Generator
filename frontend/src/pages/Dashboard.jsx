import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Flame, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Sparkles, 
  Calendar,
  Clock,
  TrendingUp,
  Layers
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GoalCard from '../components/GoalCard';
import BadgeCard from '../components/BadgeCard';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { roadmaps, badges, setActiveRoadmap, newBadgeUnlocked } = useRoadmap();

  // Aggregate stats
  const totalTasks = roadmaps.reduce((acc, r) => {
    const weeks = r.roadmap_json?.weeks || [];
    return acc + weeks.reduce((wAcc, w) => wAcc + (w.tasks?.length || 0), 0);
  }, 0);

  const completedTasks = roadmaps.reduce((acc, r) => {
    const weeks = r.roadmap_json?.weeks || [];
    return acc + weeks.reduce((wAcc, w) => wAcc + (w.tasks?.filter(t => t.completed).length || 0), 0);
  }, 0);

  const averageProgress = roadmaps.length > 0
    ? Math.round(roadmaps.reduce((acc, r) => acc + (r.progress || 0), 0) / roadmaps.length)
    : 0;

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      {/* Floating Badge Unlock Toast */}
      {newBadgeUnlocked && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="glass-panel p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl border border-white/20 flex items-center gap-3">
            <div className="text-3xl">{newBadgeUnlocked.icon}</div>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-pink-200">🎉 Badge Unlocked!</p>
              <h4 className="text-sm font-extrabold">{newBadgeUnlocked.badge_name}</h4>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-x-hidden">
          
          {/* Welcome Header Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                    SaaS Dashboard
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> AI Ready
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, {user?.name || 'Learner'}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  You have <strong className="text-indigo-300">{roadmaps.length} parallel roadmaps</strong> active. Your overall progress is at {averageProgress}%.
                </p>
              </div>

              <Link
                to="/create-goal"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create AI Roadmap</span>
              </Link>
            </div>
          </div>

          {/* Key Metrics Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase">Active Roadmaps</p>
                <p className="text-lg font-bold text-white">{roadmaps.length}</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase">Tasks Completed</p>
                <p className="text-lg font-bold text-white">{completedTasks} / {totalTasks}</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase">Study Streak</p>
                <p className="text-lg font-bold text-white">{user?.study_streak || 12} Days</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase">Badges Earned</p>
                <p className="text-lg font-bold text-white">{unlockedBadgesCount} / {badges.length}</p>
              </div>
            </div>

          </div>

          {/* Active Learning Roadmaps Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> Parallel Active Roadmaps ({roadmaps.length})
              </h2>
              <Link to="/create-goal" className="text-xs font-mono text-indigo-400 hover:underline">
                + Add New Goal
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmaps.map((rm) => (
                <GoalCard key={rm.id} roadmap={rm} onSelect={setActiveRoadmap} />
              ))}
            </div>
          </div>

          {/* Recent Badges Showcase Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Gamification Badges ({unlockedBadgesCount} Unlocked)
              </h2>
              <Link to="/profile" className="text-xs font-mono text-indigo-400 hover:underline">
                View All Badges →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.slice(0, 3).map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
