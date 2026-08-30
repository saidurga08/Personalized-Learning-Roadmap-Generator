import React from 'react';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

export default function BadgeCard({ badge }) {
  return (
    <div className={`relative p-4 rounded-2xl border transition-all duration-300 ${
      badge.unlocked
        ? 'bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
        : 'bg-slate-900/40 border-slate-800/60 opacity-60'
    }`}>
      {/* Unlock Indicator Badge */}
      <div className="absolute top-3 right-3">
        {badge.unlocked ? (
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3" /> Unlocked
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            <Lock className="w-3 h-3" /> Locked
          </span>
        )}
      </div>

      <div className="flex items-start gap-3.5">
        {/* Emoji Icon Container */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
          badge.unlocked
            ? 'bg-indigo-600/20 border border-indigo-500/40 shadow-inner'
            : 'bg-slate-800 border border-slate-700/50 grayscale'
        }`}>
          {badge.icon || '🏅'}
        </div>

        {/* Info Content */}
        <div className="pr-12">
          <h4 className={`text-sm font-bold ${badge.unlocked ? 'text-white' : 'text-slate-400'}`}>
            {badge.badge_name}
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {badge.description}
          </p>
          {badge.unlocked && badge.earned_at && (
            <p className="text-[10px] font-mono text-indigo-400 mt-2">
              Earned on {new Date(badge.earned_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
