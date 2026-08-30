export const mockUser = {
  id: 1,
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  created_at: '2026-01-15T08:00:00Z',
  study_streak: 12,
};

export const mockBadges = [
  {
    id: 1,
    badge_name: 'First Roadmap',
    description: 'Created your first AI learning roadmap',
    icon: '🚀',
    earned_at: '2026-02-01T10:00:00Z',
    category: 'milestone',
    unlocked: true,
  },
  {
    id: 2,
    badge_name: '25% Complete',
    description: 'Finished 25% of your target roadmap modules',
    icon: '🥉',
    earned_at: '2026-02-10T14:30:00Z',
    category: 'progress',
    unlocked: true,
  },
  {
    id: 3,
    badge_name: '50% Complete',
    description: 'Reached the halfway milestone!',
    icon: '🥈',
    earned_at: '2026-02-20T18:15:00Z',
    category: 'progress',
    unlocked: true,
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
    earned_at: '2026-02-07T09:00:00Z',
    category: 'streak',
    unlocked: true,
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

export const mockRoadmaps = [
  {
    id: 101,
    goal_id: 1,
    goal: 'Master Full-Stack Fast-API & React',
    difficulty: 'Intermediate',
    hours_per_week: 15,
    budget: '$50',
    deadline: '2026-04-30',
    language: 'English',
    progress: 58,
    status: 'In Progress',
    updated_at: '2026-08-28T12:00:00Z',
    roadmap_json: {
      goal: 'Master Full-Stack Fast-API & React',
      duration: '12 Weeks',
      total_hours: 180,
      weeks: [
        {
          week: 1,
          title: 'FastAPI Fundamentals & Pydantic Schemas',
          description: 'Learn modern Python API development, routing, and request validation.',
          completed: true,
          topics: [
            'FastAPI Application Instantiation & Routing',
            'Path & Query Parameters',
            'Pydantic Request/Response Models',
            'Dependency Injection System'
          ],
          resources: [
            { title: 'FastAPI Official Documentation', url: 'https://fastapi.tiangolo.com/', type: 'Documentation' },
            { title: 'Python Pydantic V2 Deep Dive', url: 'https://docs.pydantic.dev/', type: 'Guide' }
          ],
          assignment: 'Build a CRUD API for a Book Store using Pydantic validation.',
          milestone: 'Complete FastAPI Basics Project',
          tasks: [
            { id: 1001, title: 'Setup FastAPI environment & virtualenv', completed: true },
            { id: 1002, title: 'Create router for GET and POST endpoints', completed: true },
            { id: 1003, title: 'Add Pydantic schema validation for inputs', completed: true },
            { id: 1004, title: 'Write tests with TestClient', completed: true }
          ]
        },
        {
          week: 2,
          title: 'Database Persistence with SQLAlchemy & PostgreSQL',
          description: 'Connect Python to PostgreSQL using async SQLAlchemy ORM and Alembic migrations.',
          completed: true,
          topics: [
            'Relational Database Modeling',
            'SQLAlchemy 2.0 Async Session Management',
            'Alembic Migration Scripts',
            'Database Relationships & Foreign Keys'
          ],
          resources: [
            { title: 'SQLAlchemy 2.0 Unified Tutorial', url: 'https://docs.sqlalchemy.org/', type: 'Documentation' },
            { title: 'PostgreSQL Architecture Overview', url: 'https://www.postgresql.org/docs/', type: 'Reference' }
          ],
          assignment: 'Design User and Goal schema tables with relationships.',
          milestone: 'Database Migration Pipeline Operational',
          tasks: [
            { id: 1005, title: 'Install psycopg2 and asyncpg', completed: true },
            { id: 1006, title: 'Write SQLAlchemy models for User and Goal', completed: true },
            { id: 1007, title: 'Generate Alembic migration scripts', completed: true },
            { id: 1008, title: 'Test CRUD operations against PostgreSQL', completed: true }
          ]
        },
        {
          week: 3,
          title: 'Authentication & Security (JWT & Password Hashing)',
          description: 'Implement secure user authentication, password hashing with bcrypt, and JWT middleware.',
          completed: true,
          topics: [
            'Passlib & Bcrypt Hashing',
            'PyJWT Token Generation & Decoding',
            'OAuth2 Password Bearer Scheme',
            'Role-Based Authorization Guards'
          ],
          resources: [
            { title: 'FastAPI Security & OAuth2 Guide', url: 'https://fastapi.tiangolo.com/tutorial/security/', type: 'Documentation' }
          ],
          assignment: 'Implement /register, /login, and protected /profile route.',
          milestone: 'Secure Authentication System Live',
          tasks: [
            { id: 1009, title: 'Implement password hashing helper functions', completed: true },
            { id: 1010, title: 'Build token encoding/decoding utilities', completed: true },
            { id: 1011, title: 'Create /auth/login and /auth/register routers', completed: true },
            { id: 1012, title: 'Add get_current_user dependency guard', completed: true }
          ]
        },
        {
          week: 4,
          title: 'Groq AI Integration & Prompt Engineering',
          description: 'Connect Groq Llama models to generate structured JSON learning roadmaps dynamically.',
          completed: false,
          topics: [
            'Groq Python SDK Initialization',
            'Structured JSON Output Enforcement',
            'Prompt Construction for Constraint Planning',
            'Error Handling & Retry Mechanics'
          ],
          resources: [
            { title: 'Groq Cloud API Documentation', url: 'https://console.groq.com/docs', type: 'API Ref' }
          ],
          assignment: 'Build roadmap generator service taking goal, budget, and time constraints.',
          milestone: 'AI Roadmap Generation Engine Working',
          tasks: [
            { id: 1013, title: 'Configure GROQ_API_KEY environment variables', completed: true },
            { id: 1014, title: 'Create Groq prompt template for JSON output', completed: true },
            { id: 1015, title: 'Implement Pydantic JSON parser for Groq response', completed: false },
            { id: 1016, title: 'Add retry logic for API rate limits', completed: false }
          ]
        },
        {
          week: 5,
          title: 'React 19 + Vite Frontend SPA Setup',
          description: 'Build modern responsive single-page web app with TailwindCSS and React Router.',
          completed: false,
          topics: [
            'Vite Build Tooling & HMR',
            'TailwindCSS V4 Design System',
            'React Router V7 Client-Side Navigation',
            'Axios Client with JWT Interceptors'
          ],
          resources: [
            { title: 'React Documentation', url: 'https://react.dev/', type: 'Docs' },
            { title: 'TailwindCSS Documentation', url: 'https://tailwindcss.com/', type: 'Docs' }
          ],
          assignment: 'Build Landing, Dashboard, and Roadmap interactive views.',
          milestone: 'Frontend Application Scaffold Complete',
          tasks: [
            { id: 1017, title: 'Scaffold React Vite frontend with Tailwind', completed: false },
            { id: 1018, title: 'Create AuthContext for JWT management', completed: false },
            { id: 1019, title: 'Build Dashboard with active goals grid', completed: false },
            { id: 1020, title: 'Implement interactive Roadmap timeline component', completed: false }
          ]
        }
      ]
    }
  },
  {
    id: 102,
    goal_id: 2,
    goal: 'Machine Learning & Neural Networks',
    difficulty: 'Beginner',
    hours_per_week: 10,
    budget: 'Free',
    deadline: '2026-06-15',
    language: 'English',
    progress: 25,
    status: 'In Progress',
    updated_at: '2026-08-25T16:00:00Z',
    roadmap_json: {
      goal: 'Machine Learning & Neural Networks',
      duration: '8 Weeks',
      total_hours: 80,
      weeks: [
        {
          week: 1,
          title: 'NumPy, Pandas & Data Preprocessing',
          description: 'Master data structures, array manipulation, and cleaning datasets.',
          completed: true,
          topics: ['NumPy Arrays', 'Pandas DataFrames', 'Handling Missing Data', 'Feature Scaling'],
          resources: [{ title: 'Pandas User Guide', url: 'https://pandas.pydata.org/', type: 'Guide' }],
          assignment: 'Clean and transform the Iris dataset.',
          milestone: 'Data Preprocessing Completed',
          tasks: [
            { id: 1021, title: 'Install Jupyter Notebook & Scikit-Learn', completed: true },
            { id: 1022, title: 'Load CSV dataset with Pandas', completed: true },
            { id: 1023, title: 'Perform feature normalization', completed: true }
          ]
        },
        {
          week: 2,
          title: 'Supervised Learning (Regression & Classification)',
          description: 'Train Linear Regression, Decision Trees, and Random Forests.',
          completed: false,
          topics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Model Evaluation Metrics'],
          resources: [{ title: 'Scikit-Learn Machine Learning Course', url: 'https://scikit-learn.org/', type: 'Tutorial' }],
          assignment: 'Predict house prices using Linear Regression.',
          milestone: 'First Model Trained',
          tasks: [
            { id: 1024, title: 'Split data into train and test sets', completed: false },
            { id: 1025, title: 'Evaluate MSE and R2 score', completed: false }
          ]
        }
      ]
    }
  }
];

export const mockDashboard = {
  user: mockUser,
  stats: {
    active_roadmaps_count: 2,
    completed_tasks_count: 14,
    total_tasks_count: 24,
    overall_progress_percentage: 58,
    study_streak_days: 12,
    upcoming_deadlines: [
      { id: 1, title: 'Implement Pydantic JSON parser', deadline: '2026-09-02', roadmap: 'Master Full-Stack FastAPI' },
      { id: 2, title: 'Evaluate MSE and R2 score', deadline: '2026-09-05', roadmap: 'Machine Learning' }
    ]
  },
  active_roadmaps: mockRoadmaps,
  badges: mockBadges,
};
