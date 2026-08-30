import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  ExternalLink, 
  CheckCircle, 
  Sparkles, 
  FileText, 
  Sliders, 
  Flag,
  Lightbulb,
  Clock,
  Layers
} from 'lucide-react';
import TaskCard from './TaskCard';
import ProgressBar from './ProgressBar';
import CalendarWidget from './CalendarWidget';
import { useRoadmap } from '../context/RoadmapContext';
import { integrationService } from '../services/api';

export default function Timeline({ roadmap }) {
  const { toggleTaskCompletion, modifyRoadmap, loading } = useRoadmap();
  const [openWeeks, setOpenWeeks] = useState({ 0: true, 1: true });
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [modifyPrompt, setModifyPrompt] = useState('');

  if (!roadmap || !roadmap.roadmap_json) {
    return (
      <div className="p-12 text-center text-slate-400 glass-card rounded-2xl">
        <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p>No active roadmap selected.</p>
      </div>
    );
  }

  const { roadmap_json, progress, id } = roadmap;
  const weeks = roadmap_json.weeks || [];

  const toggleWeek = (index) => {
    setOpenWeeks(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleExportPdf = () => {
    window.open(integrationService.exportPdfUrl(id), '_blank');
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();
    if (!modifyPrompt.trim()) return;
    await modifyRoadmap(id, modifyPrompt);
    setModifyPrompt('');
    setShowModifyModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                {roadmap.difficulty} Level
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-950 text-purple-300 border border-purple-800/60 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {roadmap_json.duration || '12 Weeks'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {roadmap_json.goal}
            </h1>
          </div>

          {/* Top Actions: Export PDF & Modify Roadmap */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModifyModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold border border-purple-500/40 transition-all shadow-sm"
            >
              <Sliders className="w-4 h-4" />
              <span>Modify Roadmap (AI)</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Export Guidebook (PDF)</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Key Details */}
        <div className="pt-4 border-t border-slate-800/80">
          <ProgressBar progress={progress} size="md" />
        </div>
      </div>

      {/* Calendar Widget Integration */}
      <CalendarWidget roadmap={roadmap} />

      {/* Timeline Breakdown Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Weekly Curriculum & Tasks ({weeks.length} Modules)
        </h2>
        <span className="text-xs font-mono text-slate-400">
          Click modules to expand/collapse
        </span>
      </div>

      {/* Weekly Accordion Modules */}
      <div className="space-y-4">
        {weeks.map((week, weekIdx) => {
          const isOpen = openWeeks[weekIdx];
          const tasks = week.tasks || [];
          const completedCount = tasks.filter(t => t.completed).length;

          return (
            <div
              key={weekIdx}
              className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                week.completed
                  ? 'border-emerald-800/50 bg-emerald-950/10'
                  : isOpen
                  ? 'border-indigo-500/40 bg-slate-900/80'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
              }`}
            >
              {/* Module Accordion Header */}
              <div
                onClick={() => toggleWeek(weekIdx)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl font-mono text-sm font-bold flex items-center justify-center border shrink-0 ${
                    week.completed
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                  }`}>
                    W{week.week}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {week.title}
                      {week.completed && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {week.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    {completedCount}/{tasks.length} Done
                  </span>
                  <button className="p-1 rounded-lg text-slate-400 hover:text-white">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Module Expanded Content */}
              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 space-y-4">
                  
                  {/* Topics List */}
                  {week.topics && week.topics.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-2">
                        Key Topics Covered
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {week.topics.map((topic, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700/60">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks Checkboxes */}
                  {tasks.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-2">
                        Actionable Tasks
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={() => toggleTaskCompletion(id, weekIdx, task.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Resources */}
                  {week.resources && week.resources.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-2">
                        Curated Learning Resources
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {week.resources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-950 text-indigo-300 text-xs border border-indigo-800/40 transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{res.title}</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Milestone & Assignment Banner */}
                  {(week.assignment || week.milestone) && (
                    <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 flex items-start gap-3">
                      <Flag className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        {week.milestone && (
                          <p className="font-bold text-purple-200">{week.milestone}</p>
                        )}
                        {week.assignment && (
                          <p className="text-slate-400 mt-0.5"><span className="text-purple-300 font-mono">Assignment:</span> {week.assignment}</p>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Roadmap Modifier Modal */}
      {showModifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-indigo-500/40 bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Modify Roadmap with AI</h3>
              </div>
              <button
                onClick={() => setShowModifyModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Tell the Groq AI engine how you want to adjust this roadmap. The existing schedule will be dynamically re-optimized.
            </p>

            <form onSubmit={handleModifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Modification Request
                </label>
                <textarea
                  value={modifyPrompt}
                  onChange={(e) => setModifyPrompt(e.target.value)}
                  placeholder="e.g. Increase workload to 20 hours/week, add Docker and Kubernetes topics, or slow down Python basics module..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Preset Shortcuts */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setModifyPrompt('Increase difficulty and add advanced exercises')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    🔥 Increase Difficulty
                  </button>
                  <button
                    type="button"
                    onClick={() => setModifyPrompt('Reduce weekly workload for a busy schedule')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    🐢 Reduce Workload
                  </button>
                  <button
                    type="button"
                    onClick={() => setModifyPrompt('Add hands-on practical project assignments to every week')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    💻 More Projects
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModifyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {loading ? 'Re-optimizing...' : 'Apply AI Modification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
