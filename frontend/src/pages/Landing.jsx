import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Zap, Target, Award, Calendar, FileText, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              LearnPath <span className="gradient-text font-black">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 left-1/3 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-mono mb-8">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Powered by Groq AI & Llama 70B</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
          Stop Following Generic Guides. <br />
          <span className="gradient-text">Generate Your AI Roadmap.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Tailored learning paths calculated strictly around your available study hours, budget, skill level, and deadline. Tracks progress, awards badges, and syncs to Google Calendar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all"
          >
            <span>Create Your First Roadmap</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-base border border-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>View Demo Dashboard</span>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-8">
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <Target className="w-4 h-4 text-indigo-400" /> Constraint-Based Planning
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <Zap className="w-4 h-4 text-purple-400" /> AI Roadmap Modifier
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <Award className="w-4 h-4 text-amber-400" /> Gamification & Badges
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <Calendar className="w-4 h-4 text-emerald-400" /> Calendar & PDF Sync
          </div>
        </div>
      </section>

      {/* Primary Features Showcase Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            A Complete Full-Stack Learning SaaS
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Not just an AI prompt box. A persistent database-driven ecosystem designed for deep retention and continuous achievement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Structured Groq AI Generation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Receives your skill level, weekly hours, budget, and language to formulate structured JSON modules with resources, milestones, and assignments.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Dynamic AI Roadmap Modifier</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Need to slow down or add advanced Docker topics? Simply request an adjustment, and the AI re-optimizes your existing roadmap instantly.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-800 hover:border-pink-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Programmatic Gamification</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Earn badges for completing 25%, 50%, 75%, and 100% of your targets, alongside maintaining active study streak records.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6 text-center text-xs font-mono text-slate-500">
        <p>LearnPath AI — Personalized Learning Roadmap Generator. Built on feature/frontend.</p>
      </footer>

    </div>
  );
}
