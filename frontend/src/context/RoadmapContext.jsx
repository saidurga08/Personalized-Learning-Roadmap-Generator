import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { roadmapService, taskService, dashboardService } from '../services/api';
import { mockRoadmaps, mockBadges, mockDashboard } from '../services/mockData';

const RoadmapContext = createContext(null);

export const RoadmapProvider = ({ children }) => {
  const [roadmaps, setRoadmaps] = useState(mockRoadmaps);
  const [badges, setBadges] = useState(mockBadges);
  const [activeRoadmap, setActiveRoadmap] = useState(mockRoadmaps[0]);
  const [loading, setLoading] = useState(false);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState(null);

  // Trigger confetti effect on milestones & badge unlocks
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Helper to re-evaluate badge logic deterministically
  const checkBadgeTriggers = (updatedRoadmaps) => {
    if (!updatedRoadmaps || updatedRoadmaps.length === 0) return;

    let highestProgress = 0;
    updatedRoadmaps.forEach(r => {
      if (r.progress > highestProgress) highestProgress = r.progress;
    });

    let unlockedBadge = null;

    const updatedBadges = badges.map(badge => {
      let shouldUnlock = badge.unlocked;

      if (!shouldUnlock) {
        if (badge.badge_name === '25% Complete' && highestProgress >= 25) shouldUnlock = true;
        if (badge.badge_name === '50% Complete' && highestProgress >= 50) shouldUnlock = true;
        if (badge.badge_name === '75% Complete' && highestProgress >= 75) shouldUnlock = true;
        if (badge.badge_name === '100% Mastered' && highestProgress >= 100) shouldUnlock = true;
        
        if (shouldUnlock) {
          unlockedBadge = badge;
        }
      }

      return {
        ...badge,
        unlocked: shouldUnlock,
        earned_at: shouldUnlock && !badge.earned_at ? new Date().toISOString() : badge.earned_at
      };
    });

    setBadges(updatedBadges);

    if (unlockedBadge) {
      setNewBadgeUnlocked(unlockedBadge);
      triggerCelebration();
      setTimeout(() => setNewBadgeUnlocked(null), 5000);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = (roadmapId, weekIndex, taskId) => {
    const updatedRoadmaps = roadmaps.map(rm => {
      if (rm.id !== roadmapId) return rm;

      let totalTasks = 0;
      let completedTasksCount = 0;

      const updatedWeeks = rm.roadmap_json.weeks.map((week, idx) => {
        const isTargetWeek = idx === weekIndex;
        
        const updatedTasks = (week.tasks || []).map(task => {
          const isTargetTask = task.id === taskId;
          const isCompleted = isTargetTask ? !task.completed : task.completed;

          if (isCompleted) completedTasksCount++;
          totalTasks++;

          return { ...task, completed: isCompleted };
        });

        const allWeekTasksCompleted = updatedTasks.length > 0 && updatedTasks.every(t => t.completed);

        return {
          ...week,
          completed: allWeekTasksCompleted,
          tasks: updatedTasks
        };
      });

      const newProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : rm.progress;

      const updatedRm = {
        ...rm,
        progress: newProgress,
        status: newProgress === 100 ? 'Completed' : 'In Progress',
        roadmap_json: {
          ...rm.roadmap_json,
          weeks: updatedWeeks
        }
      };

      if (activeRoadmap && activeRoadmap.id === roadmapId) {
        setActiveRoadmap(updatedRm);
      }

      return updatedRm;
    });

    setRoadmaps(updatedRoadmaps);
    checkBadgeTriggers(updatedRoadmaps);

    // Call backend async without blocking UI
    taskService.updateTaskStatus(taskId, true).catch(() => {});
  };

  // Generate a new AI roadmap
  const createRoadmap = async (formData) => {
    setLoading(true);
    try {
      const data = await roadmapService.generateRoadmap(formData);
      const newRm = data.roadmap || data;
      setRoadmaps(prev => [newRm, ...prev]);
      setActiveRoadmap(newRm);
      triggerCelebration();
      return newRm;
    } catch (error) {
      console.warn('Backend Groq generation offline, simulating AI roadmap generation:', error);
      const newDemoRoadmap = {
        id: Date.now(),
        goal_id: Date.now(),
        goal: formData.goal || 'Custom AI Learning Goal',
        difficulty: formData.skill_level || 'Intermediate',
        hours_per_week: formData.hours_per_week || 10,
        budget: formData.budget || 'Free',
        deadline: formData.deadline || '2026-06-30',
        language: formData.language || 'English',
        progress: 0,
        status: 'In Progress',
        updated_at: new Date().toISOString(),
        roadmap_json: {
          goal: formData.goal || 'Custom AI Learning Goal',
          duration: `${formData.weeks_duration || 8} Weeks`,
          total_hours: (formData.hours_per_week || 10) * (formData.weeks_duration || 8),
          weeks: Array.from({ length: formData.weeks_duration || 6 }).map((_, idx) => ({
            week: idx + 1,
            title: `Module ${idx + 1}: ${formData.goal} Core Concepts Part ${idx + 1}`,
            description: `Comprehensive study plan tailored for ${formData.skill_level || 'Intermediate'} level learners in ${formData.language || 'English'}.`,
            completed: false,
            topics: [
              `Fundamental architecture & key patterns`,
              `Hands-on practical exercise #${idx + 1}`,
              `Industry best practices & performance tuning`,
              `Debugging & automated unit testing`
            ],
            resources: [
              { title: `${formData.goal} Reference Documentation`, url: 'https://developer.mozilla.org/', type: 'Documentation' },
              { title: `Mastering ${formData.goal} Video Course`, url: 'https://youtube.com', type: 'Video' }
            ],
            assignment: `Build a functional ${formData.goal} mini-project for Week ${idx + 1}.`,
            milestone: `Milestone ${idx + 1}: Pass Week ${idx + 1} practical assessment.`,
            tasks: [
              { id: Date.now() + idx * 10 + 1, title: `Read module guide for Week ${idx + 1}`, completed: false },
              { id: Date.now() + idx * 10 + 2, title: `Complete hands-on coding lab #${idx + 1}`, completed: false },
              { id: Date.now() + idx * 10 + 3, title: `Submit weekly assignment project`, completed: false }
            ]
          }))
        }
      };

      setRoadmaps(prev => [newDemoRoadmap, ...prev]);
      setActiveRoadmap(newDemoRoadmap);
      triggerCelebration();
      return newDemoRoadmap;
    } finally {
      setLoading(false);
    }
  };

  // Modify an existing AI roadmap
  const modifyRoadmap = async (roadmapId, modificationPrompt) => {
    setLoading(true);
    try {
      const updated = await roadmapService.modifyRoadmap(roadmapId, { modification_prompt: modificationPrompt });
      
      const current = roadmaps.find(r => r.id.toString() === roadmapId.toString()) || activeRoadmap;
      let normalizedRm = updated;

      if (updated && (updated.roadmap || updated.weeks || updated.roadmap_json)) {
        const rawWeeks = updated.roadmap?.weeks || updated.weeks || updated.roadmap_json?.weeks || [];
        
        normalizedRm = {
          ...current,
          updated_at: new Date().toISOString(),
          roadmap_json: {
            ...current.roadmap_json,
            weeks: rawWeeks.map((w, idx) => ({
              week: w.week_number || w.week || idx + 1,
              title: w.title,
              description: w.description || `Module re-optimized for: "${modificationPrompt}"`,
              completed: false,
              topics: (w.topics || []).map(t => typeof t === 'string' ? t : t.title),
              resources: (w.resources || []).map(r => ({ title: r.title || 'Documentation', url: r.url || 'https://fastapi.tiangolo.com/', type: r.type || 'Guide' })),
              assignment: w.assignment || `Complete Week ${idx + 1} practical exercise`,
              milestone: w.milestone || `Milestone ${idx + 1}`,
              tasks: [
                { id: Date.now() + idx * 20 + 1, title: `Study ${w.title}`, completed: false },
                { id: Date.now() + idx * 20 + 2, title: `Complete assignment: ${w.assignment || 'Practical Exercise'}`, completed: false }
              ]
            }))
          }
        };
      }

      setActiveRoadmap(normalizedRm);
      setRoadmaps(prev => prev.map(r => r.id.toString() === roadmapId.toString() ? normalizedRm : r));
      triggerCelebration();
      return normalizedRm;
    } catch (error) {
      console.warn('API modification error, applying local AI adaptation:', error);
      const current = roadmaps.find(r => r.id.toString() === roadmapId.toString()) || activeRoadmap;
      const modifiedWeeks = (current.roadmap_json.weeks || []).map(w => ({
        ...w,
        title: `${w.title} (Re-planned)`,
        description: `Modified workload: "${modificationPrompt}"`
      }));

      const modifiedRm = {
        ...current,
        updated_at: new Date().toISOString(),
        roadmap_json: {
          ...current.roadmap_json,
          weeks: modifiedWeeks
        }
      };

      setActiveRoadmap(modifiedRm);
      setRoadmaps(prev => prev.map(r => r.id.toString() === roadmapId.toString() ? modifiedRm : r));
      triggerCelebration();
      return modifiedRm;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoadmapContext.Provider value={{
      roadmaps,
      badges,
      activeRoadmap,
      setActiveRoadmap,
      loading,
      newBadgeUnlocked,
      toggleTaskCompletion,
      createRoadmap,
      modifyRoadmap
    }}>
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};
