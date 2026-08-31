import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { roadmapService, taskService } from '../services/api';
import { mockBadges } from '../services/mockData';
import { useAuth } from './AuthContext';

const RoadmapContext = createContext(null);

export const RoadmapProvider = ({ children }) => {
  const { user } = useAuth();
  const [roadmaps, setRoadmapsState] = useState([]);
  const [activeRoadmap, setActiveRoadmapState] = useState(null);
  const [badges, setBadgesState] = useState(mockBadges);
  const [loading, setLoading] = useState(false);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState(null);

  // Sync roadmaps whenever user changes
  useEffect(() => {
    if (user) {
      const storageKey = `roadmaps_${user.id}`;
      const activeKey = `activeRoadmap_${user.id}`;
      const savedRoadmaps = localStorage.getItem(storageKey);
      const savedActive = localStorage.getItem(activeKey);

      if (savedRoadmaps) {
        const parsed = JSON.parse(savedRoadmaps);
        setRoadmapsState(parsed);
        if (savedActive) {
          setActiveRoadmapState(JSON.parse(savedActive));
        } else if (parsed.length > 0) {
          setActiveRoadmapState(parsed[0]);
        } else {
          setActiveRoadmapState(null);
        }
      } else {
        setRoadmapsState([]);
        setActiveRoadmapState(null);
      }
    } else {
      setRoadmapsState([]);
      setActiveRoadmapState(null);
    }
  }, [user]);

  const setRoadmaps = (updater) => {
    setRoadmapsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (user?.id) {
        localStorage.setItem(`roadmaps_${user.id}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const setActiveRoadmap = (updater) => {
    setActiveRoadmapState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (user?.id) {
        localStorage.setItem(`activeRoadmap_${user.id}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const setBadges = (updater) => {
    setBadgesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (user?.id) {
        localStorage.setItem(`badges_${user.id}`, JSON.stringify(next));
      }
      return next;
    });
  };

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
        if (badge.badge_name === 'First Roadmap' && updatedRoadmaps.length >= 1) shouldUnlock = true;
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

      const rawWeeks = rm.roadmap_json?.weeks || rm.roadmap_json?.roadmap?.weeks || [];

      const updatedWeeks = rawWeeks.map((week, idx) => {
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

    taskService.updateTaskStatus(taskId, true).catch(() => {});
  };

  // Generate a new AI roadmap with full nested unpacking
  const createRoadmap = async (formData) => {
    setLoading(true);
    try {
      const data = await roadmapService.generateRoadmap(formData);
      
      const rawObj = data.roadmap || data;
      const innerRoadmap = rawObj.roadmap || rawObj.roadmap_json || rawObj;
      const goalTitle = innerRoadmap.goal || innerRoadmap.title || formData.goal || 'Custom AI Learning Goal';
      
      const rawWeeks = innerRoadmap.weeks || rawObj.weeks || [];
      const targetWeeksCount = formData.weeks_duration || 6;
      
      const weeksToFormat = rawWeeks.length > 0 ? rawWeeks : Array.from({ length: targetWeeksCount });

      const formattedWeeks = weeksToFormat.map((w = {}, idx) => {
        const weekNum = w.week_number || w.week || idx + 1;
        const moduleTitle = w.title || `Module ${weekNum}: ${goalTitle} Core Concepts`;
        const moduleDesc = w.description || `Comprehensive study module tailored for ${formData.skill_level || 'Intermediate'} level learners.`;
        
        const topics = (w.topics || []).map(t => typeof t === 'string' ? t : (t.title || t.name || 'Core Topic'));
        if (topics.length === 0) {
          topics.push(`Architecture & Patterns for ${goalTitle}`, `Hands-on Practical Lab #${weekNum}`, `Best Practices & Testing`);
        }

        const resources = (w.resources || []).map(r => ({
          title: r.title || `${goalTitle} Reference Docs`,
          url: r.url || 'https://developer.mozilla.org/',
          type: r.type || 'Documentation'
        }));
        if (resources.length === 0) {
          resources.push(
            { title: `${goalTitle} Official Documentation`, url: 'https://developer.mozilla.org/', type: 'Documentation' },
            { title: `Mastering ${goalTitle} Video Guide`, url: 'https://youtube.com', type: 'Video' }
          );
        }

        const rawTasks = w.tasks || [];
        const tasks = rawTasks.map((t, tIdx) => ({
          id: t.id || Date.now() + idx * 10 + tIdx + 1,
          title: typeof t === 'string' ? t : (t.title || t.name || `Task ${tIdx + 1}`),
          completed: false
        }));
        if (tasks.length === 0) {
          tasks.push(
            { id: Date.now() + idx * 10 + 1, title: `Read module study guide for Week ${weekNum}`, completed: false },
            { id: Date.now() + idx * 10 + 2, title: `Complete hands-on coding lab #${weekNum}`, completed: false },
            { id: Date.now() + idx * 10 + 3, title: `Submit weekly assessment assignment`, completed: false }
          );
        }

        return {
          week: weekNum,
          title: moduleTitle,
          description: moduleDesc,
          completed: false,
          topics,
          resources,
          assignment: w.assignment || `Build functional ${goalTitle} mini-project for Week ${weekNum}.`,
          milestone: w.milestone || `Milestone ${weekNum}: Pass Week ${weekNum} practical assessment.`,
          tasks
        };
      });

      const formattedRm = {
        id: data.roadmap_id || Date.now(),
        goal_id: Date.now(),
        user_id: user?.id,
        goal: goalTitle,
        difficulty: formData.skill_level || 'Intermediate',
        hours_per_week: formData.hours_per_week || 10,
        budget: formData.budget || 'Free',
        deadline: formData.deadline || '2026-06-30',
        language: formData.language || 'English',
        progress: 0,
        status: 'In Progress',
        updated_at: new Date().toISOString(),
        roadmap_json: {
          goal: goalTitle,
          duration: `${formattedWeeks.length} Weeks`,
          total_hours: (formData.hours_per_week || 10) * formattedWeeks.length,
          weeks: formattedWeeks
        }
      };

      setRoadmaps(prev => [formattedRm, ...prev]);
      setActiveRoadmap(formattedRm);
      checkBadgeTriggers([formattedRm, ...roadmaps]);
      triggerCelebration();
      return formattedRm;
    } catch (error) {
      console.warn('Backend Groq generation offline, simulating AI roadmap generation:', error);
      const goalTitle = formData.goal || 'Custom AI Learning Goal';
      const targetWeeksCount = formData.weeks_duration || 6;

      const formattedWeeks = Array.from({ length: targetWeeksCount }).map((_, idx) => ({
        week: idx + 1,
        title: `Module ${idx + 1}: ${goalTitle} Core Concepts`,
        description: `Comprehensive study plan tailored for ${formData.skill_level || 'Intermediate'} level.`,
        completed: false,
        topics: [
          `Fundamental architecture & key patterns`,
          `Hands-on practical exercise #${idx + 1}`,
          `Industry best practices & performance tuning`,
          `Debugging & automated unit testing`
        ],
        resources: [
          { title: `${goalTitle} Reference Documentation`, url: 'https://developer.mozilla.org/', type: 'Documentation' },
          { title: `Mastering ${goalTitle} Video Course`, url: 'https://youtube.com', type: 'Video' }
        ],
        assignment: `Build a functional ${goalTitle} mini-project for Week ${idx + 1}.`,
        milestone: `Milestone ${idx + 1}: Pass Week ${idx + 1} practical assessment.`,
        tasks: [
          { id: Date.now() + idx * 10 + 1, title: `Read module guide for Week ${idx + 1}`, completed: false },
          { id: Date.now() + idx * 10 + 2, title: `Complete hands-on coding lab #${idx + 1}`, completed: false },
          { id: Date.now() + idx * 10 + 3, title: `Submit weekly assignment project`, completed: false }
        ]
      }));

      const newDemoRoadmap = {
        id: Date.now(),
        goal_id: Date.now(),
        user_id: user?.id,
        goal: goalTitle,
        difficulty: formData.skill_level || 'Intermediate',
        hours_per_week: formData.hours_per_week || 10,
        budget: formData.budget || 'Free',
        deadline: formData.deadline || '2026-06-30',
        language: formData.language || 'English',
        progress: 0,
        status: 'In Progress',
        updated_at: new Date().toISOString(),
        roadmap_json: {
          goal: goalTitle,
          duration: `${targetWeeksCount} Weeks`,
          total_hours: (formData.hours_per_week || 10) * targetWeeksCount,
          weeks: formattedWeeks
        }
      };

      setRoadmaps(prev => [newDemoRoadmap, ...prev]);
      setActiveRoadmap(newDemoRoadmap);
      checkBadgeTriggers([newDemoRoadmap, ...roadmaps]);
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
      
      const rawObj = updated.roadmap || updated;
      const innerRoadmap = rawObj.roadmap || rawObj.roadmap_json || rawObj;
      const rawWeeks = innerRoadmap.weeks || rawObj.weeks || current?.roadmap_json?.weeks || [];

      const formattedWeeks = rawWeeks.map((w, idx) => {
        const weekNum = w.week_number || w.week || idx + 1;
        const topics = (w.topics || []).map(t => typeof t === 'string' ? t : (t.title || t.name || 'Topic'));
        const resources = (w.resources || []).map(r => ({
          title: r.title || 'Guide',
          url: r.url || 'https://developer.mozilla.org/',
          type: r.type || 'Documentation'
        }));
        const rawTasks = w.tasks || [];
        const tasks = rawTasks.length > 0 ? rawTasks.map((t, tIdx) => ({
          id: t.id || Date.now() + idx * 20 + tIdx + 1,
          title: typeof t === 'string' ? t : (t.title || t.name || `Task ${tIdx + 1}`),
          completed: false
        })) : [
          { id: Date.now() + idx * 20 + 1, title: `Study ${w.title || 'Module'}`, completed: false },
          { id: Date.now() + idx * 20 + 2, title: `Complete assignment: ${w.assignment || 'Practical Exercise'}`, completed: false }
        ];

        return {
          week: weekNum,
          title: w.title || `Module ${weekNum}: Re-optimized Module`,
          description: w.description || `Module re-planned for request: "${modificationPrompt}"`,
          completed: false,
          topics,
          resources,
          assignment: w.assignment || `Complete Week ${weekNum} exercise`,
          milestone: w.milestone || `Milestone ${weekNum}`,
          tasks
        };
      });

      const normalizedRm = {
        ...current,
        updated_at: new Date().toISOString(),
        roadmap_json: {
          ...current.roadmap_json,
          weeks: formattedWeeks
        }
      };

      setActiveRoadmap(normalizedRm);
      setRoadmaps(prev => prev.map(r => r.id.toString() === roadmapId.toString() ? normalizedRm : r));
      triggerCelebration();
      return normalizedRm;
    } catch (error) {
      console.warn('API modification error, applying local AI adaptation:', error);
      const current = roadmaps.find(r => r.id.toString() === roadmapId.toString()) || activeRoadmap;
      const modifiedWeeks = (current.roadmap_json?.weeks || []).map(w => ({
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
