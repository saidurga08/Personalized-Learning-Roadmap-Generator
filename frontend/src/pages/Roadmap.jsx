import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layers, Plus, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Timeline from '../components/Timeline';
import { useRoadmap } from '../context/RoadmapContext';

export default function Roadmap() {
  const { roadmaps, activeRoadmap, setActiveRoadmap } = useRoadmap();
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');

  useEffect(() => {
    if (targetId && roadmaps.length > 0) {
      const found = roadmaps.find(r => r.id.toString() === targetId.toString());
      if (found) setActiveRoadmap(found);
    }
  }, [targetId, roadmaps, setActiveRoadmap]);

  const targetRoadmap = activeRoadmap || roadmaps[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 overflow-x-hidden">
          
          {/* Parallel Roadmap Switcher Header */}
          {roadmaps.length > 1 && (
            <div className="glass-card p-3 rounded-2xl border border-slate-800 flex items-center justify-between overflow-x-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Switch Active Path:</span>
              </div>
              <div className="flex items-center gap-2">
                {roadmaps.map((rm) => (
                  <button
                    key={rm.id}
                    onClick={() => setActiveRoadmap(rm)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      targetRoadmap?.id === rm.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {rm.goal} ({rm.progress}%)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Core Interactive Timeline View */}
          {targetRoadmap ? (
            <Timeline roadmap={targetRoadmap} />
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
              <h2 className="text-xl font-bold text-white">No Learning Roadmaps Found</h2>
              <p className="text-xs text-slate-400">Create your first AI personalized goal to get started.</p>
              <Link
                to="/create-goal"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Create Goal
              </Link>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
