import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Globe, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function GoalCard({ roadmap, onSelect }) {
  const navigate = useNavigate();

  const handleOpen = () => {
    if (onSelect) onSelect(roadmap);
    navigate(`/roadmap?id=${roadmap.id}`);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
            {roadmap.difficulty || 'Intermediate'}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium ${
            roadmap.progress === 100
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
              : 'bg-amber-950 text-amber-300 border border-amber-800/60'
          }`}>
            {roadmap.status || 'In Progress'}
          </span>
        </div>

        {/* Goal Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2 line-clamp-2">
          {roadmap.goal}
        </h3>

        {/* Constraints Info Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{roadmap.hours_per_week} hrs/wk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>{roadmap.budget}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>{roadmap.deadline}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-pink-400" />
            <span>{roadmap.language || 'English'}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={roadmap.progress} size="sm" />
      </div>

      {/* Footer CTA Button */}
      <button
        onClick={handleOpen}
        className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white text-xs font-semibold border border-slate-700/60 group-hover:border-indigo-500 transition-all duration-200 shadow-sm"
      >
        <span>Open Interactive Roadmap</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
