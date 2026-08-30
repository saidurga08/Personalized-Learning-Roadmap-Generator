import React from 'react';

export default function ProgressBar({ progress = 0, size = 'md', showLabel = true }) {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
          <span>Overall Completion</span>
          <span className="font-bold text-indigo-400">{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50 ${heightClasses[size]}`}>
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm shadow-indigo-500/50"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
