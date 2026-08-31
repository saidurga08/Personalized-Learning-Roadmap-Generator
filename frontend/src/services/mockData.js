export const mockUser = {
  id: 1,
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  created_at: '2026-01-15T08:00:00Z',
  study_streak: 0,
};

export const mockBadges = [
  {
    id: 1,
    badge_name: 'First Roadmap',
    description: 'Created your first AI learning roadmap',
    icon: '🚀',
    earned_at: null,
    category: 'milestone',
    unlocked: false,
  },
  {
    id: 2,
    badge_name: '25% Complete',
    description: 'Finished 25% of your target roadmap modules',
    icon: '🥉',
    earned_at: null,
    category: 'progress',
    unlocked: false,
  },
  {
    id: 3,
    badge_name: '50% Complete',
    description: 'Reached the halfway milestone!',
    icon: '🥈',
    earned_at: null,
    category: 'progress',
    unlocked: false,
  },
  {
    id: 4,
    badge_name: '75% Complete',
    description: '3/4 of the way to mastery!',
    icon: '🥇',
    earned_at: null,
    category: 'progress',
    unlocked: false,
  },
  {
    id: 5,
    badge_name: '100% Mastered',
    description: 'Completed an entire learning roadmap',
    icon: '👑',
    earned_at: null,
    category: 'mastery',
    unlocked: false,
  },
  {
    id: 6,
    badge_name: '7-Day Streak',
    description: 'Maintained a 7-day active study streak',
    icon: '🔥',
    earned_at: null,
    category: 'streak',
    unlocked: false,
  },
  {
    id: 7,
    badge_name: '30-Day Streak',
    description: 'Unstoppable! 30 days of consecutive learning',
    icon: '⚡',
    earned_at: null,
    category: 'streak',
    unlocked: false,
  },
];

export const mockRoadmaps = [];

export const mockDashboard = {
  user: mockUser,
  stats: {
    active_roadmaps_count: 0,
    completed_tasks_count: 0,
    total_tasks_count: 0,
    overall_progress_percentage: 0,
    study_streak_days: 0,
    upcoming_deadlines: []
  },
  active_roadmaps: [],
  badges: mockBadges,
};
