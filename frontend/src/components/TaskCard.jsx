import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function TaskCard({ task, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
        task.completed
          ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
          : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-200 hover:border-indigo-500/40'
      }`}
    >
      <button
        type="button"
        className="mt-0.5 text-slate-400 group-hover:text-indigo-400 transition-colors focus:outline-none"
      >
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
        ) : (
          <Circle className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        )}
      </button>

      <div className="flex-1">
        <p className={`text-sm font-medium transition-all ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
          {task.title}
        </p>
      </div>

      {task.completed && (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
          Done
        </span>
      )}
    </div>
  );
}
