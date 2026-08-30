import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Target, 
  Clock, 
  DollarSign, 
  Calendar, 
  Globe, 
  Award, 
  ArrowRight,
  Bot
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useRoadmap } from '../context/RoadmapContext';

export default function CreateGoal() {
  const { createRoadmap, loading } = useRoadmap();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    goal: '',
    skill_level: 'Intermediate',
    hours_per_week: 15,
    budget: '$50',
    weeks_duration: 8,
    deadline: '2026-06-30',
    language: 'English',
    prior_experience: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goal.trim()) return;

    const newRm = await createRoadmap(formData);
    navigate(`/roadmap?id=${newRm.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 max-w-3xl space-y-6">
          
          {/* Header Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Constraint Planning</span>
                <h1 className="text-2xl font-extrabold text-white">Create AI Learning Goal</h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Specify your constraints below. The Groq AI engine will formulate a structured JSON roadmap calculated specifically around your available study time, budget, and experience.
            </p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            
            {/* Goal Input */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" /> Learning Goal / Topic
              </label>
              <input
                type="text"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="e.g. Master Full-Stack FastAPI & React, Machine Learning Engineering, System Design..."
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                required
              />
            </div>

            {/* Skill Level & Weekly Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" /> Current Skill Level
                </label>
                <select
                  name="skill_level"
                  value={formData.skill_level}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner (Zero prior experience)</option>
                  <option value="Intermediate">Intermediate (Some foundational knowledge)</option>
                  <option value="Advanced">Advanced (Looking for deep mastery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-pink-400" /> Available Study Hours / Week
                </label>
                <input
                  type="number"
                  name="hours_per_week"
                  value={formData.hours_per_week}
                  onChange={handleChange}
                  min={2}
                  max={60}
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Budget & Target Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Budget Constraint
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Free">Free Resources Only ($0)</option>
                  <option value="$50">Low Budget (&lt; $50)</option>
                  <option value="$200">Moderate Budget (&lt; $200)</option>
                  <option value="Unlimited">No Budget Limit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" /> Preferred Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Hindi">Hindi</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            {/* Target Duration & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" /> Target Duration (Weeks)
                </label>
                <input
                  type="number"
                  name="weeks_duration"
                  value={formData.weeks_duration}
                  onChange={handleChange}
                  min={2}
                  max={52}
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-400" /> Completion Target Date
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Optional Prior Experience */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                Prior Relevant Experience / Background (Optional)
              </label>
              <textarea
                name="prior_experience"
                value={formData.prior_experience}
                onChange={handleChange}
                placeholder="e.g. Know basic Python syntax, familiar with SQL queries..."
                rows={3}
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
              />
            </div>

            {/* Submit Action Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all"
              >
                {loading ? (
                  <>
                    <Bot className="w-5 h-5 animate-spin" />
                    <span>Groq AI Generating Personal Roadmap...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate AI Personalized Roadmap</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

          </form>

        </main>
      </div>
    </div>
  );
}
