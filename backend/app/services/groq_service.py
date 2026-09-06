import json
import re
import urllib.parse
from groq import Groq
from app.config import GROQ_API_KEY


def generate_response(prompt: str, request=None):
    if GROQ_API_KEY and GROQ_API_KEY.strip() and not GROQ_API_KEY.startswith("gsk_placeholder"):
        try:
            client = Groq(api_key=GROQ_API_KEY)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_completion_tokens=8000
            )

            content = response.choices[0].message.content.strip()
            content = (
                content.replace("```json", "")
                       .replace("```", "")
                       .strip()
            )

            roadmap_json = json.loads(content)
            from app.schemas.roadmap_schema import ModifiedRoadmap
            try:
                return ModifiedRoadmap(**roadmap_json)
            except Exception:
                return roadmap_json
        except Exception as e:
            print("Notice: Groq API call exception, using intelligent domain generator:", e)

    # Dynamic fallback customized for user goal and requested duration
    goal_name = "Custom Learning Path"
    duration_weeks = 6
    hours_per_wk = 15

    # Extract goal from prompt or request
    if request and hasattr(request, 'goal') and request.goal:
        goal_name = request.goal
    else:
        goal_match = re.search(r"Goal:\s*\n?([^\n]+)", prompt, re.IGNORECASE)
        if goal_match:
            goal_name = goal_match.group(1).strip()

    # Extract weeks duration from prompt or request
    if request and hasattr(request, 'weeks_duration') and request.weeks_duration:
        duration_weeks = int(request.weeks_duration)
    else:
        weeks_match = re.search(r"(\d+)\s*week", prompt, re.IGNORECASE)
        if weeks_match:
            duration_weeks = int(weeks_match.group(1))

    # Extract hours per week
    if request and hasattr(request, 'hours_per_week') and request.hours_per_week:
        try:
            hours_per_wk = int(request.hours_per_week)
        except Exception:
            hours_per_wk = 15

    return generate_rich_roadmap(goal_name, duration_weeks, hours_per_wk)


def generate_rich_roadmap(goal_name: str, duration_weeks: int, hours_per_wk: int):
    goal_lower = goal_name.lower()
    
    # Topic templates based on domain
    if any(k in goal_lower for k in ["machine learning", "ml", "deep learning", "ai", "neural", "data science"]):
        modules = [
            {
                "title": "Python Data Stack & Exploratory Analysis",
                "desc": "Master NumPy arrays, Pandas DataFrames, data cleaning, and Matplotlib/Seaborn visualization.",
                "topics": ["NumPy Array Vectorization", "Pandas Data Wrangling & Handling Missing Values", "Exploratory Data Analysis (EDA)"],
                "tasks": [
                    "Install Jupyter Notebook, NumPy, Pandas, and Scikit-Learn",
                    "Perform data cleaning and handle missing values on a CSV dataset",
                    "Plot feature correlation heatmaps and distribution histograms"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' NumPy Pandas tutorial freecodecamp')}",
                "doc": "https://pandas.pydata.org/docs/user_guide/index.html",
                "course": "https://www.kaggle.com/learn/python"
            },
            {
                "title": "Supervised Learning: Regression & Classification",
                "desc": "Train Linear Regression, Logistic Regression, Decision Trees, and Support Vector Machines.",
                "topics": ["Supervised Learning Principles", "Linear & Logistic Regression Models", "Model Evaluation Metrics (MSE, Precision, Recall, ROC-AUC)"],
                "tasks": [
                    "Split dataset into Train/Test sets using train_test_split",
                    "Train Linear Regression model and compute MSE and R2 score",
                    "Build Logistic Regression classifier and evaluate confusion matrix"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' Supervised Learning Scikit Learn tutorial')}",
                "doc": "https://scikit-learn.org/stable/user_guide.html",
                "course": "https://www.coursera.org/learn/machine-learning"
            },
            {
                "title": "Ensemble Methods & Hyperparameter Tuning",
                "desc": "Boost accuracy with Random Forests, XGBoost, LightGBM, and Cross-Validation tuning.",
                "topics": ["Random Forest & Gradient Boosting Trees", "XGBoost & LightGBM Optimization", "GridSearchCV & RandomSearchCV Tuning"],
                "tasks": [
                    "Train Random Forest Classifier and inspect feature importance",
                    "Implement XGBoost with early stopping to prevent overfitting",
                    "Run 5-Fold Cross Validation and tune hyperparameters with GridSearchCV"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' XGBoost Random Forest tutorial')}",
                "doc": "https://xgboost.readthedocs.io/en/stable/",
                "course": "https://www.freecodecamp.org/news/tag/machine-learning/"
            },
            {
                "title": "Unsupervised Learning & Clustering",
                "desc": "Discover hidden structures using K-Means, Hierarchical Clustering, and PCA Dimension Reduction.",
                "topics": ["K-Means & DBSCAN Clustering", "Dimensionality Reduction with PCA", "Anomaly Detection Techniques"],
                "tasks": [
                    "Implement K-Means clustering and plot the Elbow Method curve",
                    "Reduce high-dimensional feature matrix using PCA to 2D scatter plot",
                    "Build customer segmentation model using unlabelled data"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' K-Means PCA clustering tutorial')}",
                "doc": "https://scikit-learn.org/stable/modules/clustering.html",
                "course": "https://developers.google.com/machine-learning/crash-course"
            },
            {
                "title": "Introduction to Neural Networks & PyTorch",
                "desc": "Build multi-layer perceptrons, activation functions, loss functions, and backpropagation in PyTorch.",
                "topics": ["Neural Network Architecture & Tensors", "Activation Functions (ReLU, Sigmoid, Softmax)", "PyTorch Training Loops & SGD Optimizers"],
                "tasks": [
                    "Setup PyTorch environment and verify CUDA/CPU execution",
                    "Build custom Neural Network subclass inheriting from torch.nn.Module",
                    "Write PyTorch training loop with Adam optimizer and CrossEntropy loss"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' PyTorch Neural Network tutorial for beginners')}",
                "doc": "https://pytorch.org/tutorials/",
                "course": "https://fast.ai"
            },
            {
                "title": "Model Deployment, API Serving & MLOps Capstone",
                "desc": "Deploy trained machine learning models to production using FastAPI, Docker, and MLflow monitoring.",
                "topics": ["Model Serialization with Joblib & ONNX", "Building Real-time Prediction Endpoints with FastAPI", "Model Monitoring & Containerization"],
                "tasks": [
                    "Serialize trained model weights to disk using joblib.dump()",
                    "Create FastAPI POST /predict endpoint serving live inference",
                    "Containerize ML inference service with Docker container"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' Deploy Machine Learning Model FastAPI Docker')}",
                "doc": "https://fastapi.tiangolo.com/deployment/",
                "course": "https://ml-ops.org/"
            }
        ]
    elif any(k in goal_lower for k in ["react", "frontend", "web", "fullstack", "javascript", "typescript", "next"]):
        modules = [
            {
                "title": "Modern JavaScript (ES6+) & React Fundamentals",
                "desc": "Master destructuring, async/await, JSX components, props, and state management.",
                "topics": ["ES6+ Syntax & Array Methods (map, filter, reduce)", "React JSX & Component Hierarchy", "useState & State Immutability Patterns"],
                "tasks": [
                    "Scaffold React application using Vite and configure TailwindCSS",
                    "Build reusable UI components accepting typed props",
                    "Implement interactive state toggles and form input handlers"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' React full course freecodecamp')}",
                "doc": "https://react.dev/learn",
                "course": "https://fullstackopen.com/en/"
            },
            {
                "title": "Side Effects, Data Fetching & Hooks",
                "desc": "Master useEffect, custom hooks, loading states, and HTTP integration with Axios.",
                "topics": ["useEffect Dependency Array Lifecycle", "Custom React Hooks Abstraction", "REST API Data Fetching with Axios"],
                "tasks": [
                    "Create custom hook useFetch for handling GET requests",
                    "Build dynamic data cards with loading spinners and error handling",
                    "Implement search bar filtering with debounced API calls"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' React useEffect Axios custom hooks tutorial')}",
                "doc": "https://react.dev/reference/react/useEffect",
                "course": "https://scrimba.com/learn/learnreact"
            },
            {
                "title": "Client-Side Routing & Global State Context",
                "desc": "Build multi-page applications with React Router v6 and manage global context.",
                "topics": ["React Router v6 Navigation & URL Params", "React Context API & Provider Pattern", "Protected Route Guards"],
                "tasks": [
                    "Setup BrowserRouter with page routes (/dashboard, /profile, /settings)",
                    "Create AuthContext storing user token and profile state",
                    "Wrap protected routes in authentication guard component"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' React Router v6 Context API tutorial')}",
                "doc": "https://reactrouter.com/en/main",
                "course": "https://frontendmasters.com"
            },
            {
                "title": "Advanced State Management & UI Component Libraries",
                "desc": "Optimize performance with useMemo, useCallback, and build polished glassmorphism UIs.",
                "topics": ["Performance Optimization (useMemo, React.memo)", "Lucide Icons & Tailwind CSS Animation", "Modal Dialogs & Toast Notifications"],
                "tasks": [
                    "Refactor heavy list renders with useMemo and React.memo",
                    "Build animated modal dialog with backdrop blur glassmorphism",
                    "Implement toast notification system for user actions"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' React performance optimization memo tutorial')}",
                "doc": "https://tailwindcss.com/docs/installation",
                "course": "https://ui.dev"
            },
            {
                "title": "Full-Stack Backend Integration & JWT Auth",
                "desc": "Connect React frontend to FastAPI/Node.js backend with JWT authorization.",
                "topics": ["Axios Authorization Bearer Interceptors", "JWT Token Storage & Expiration Refresh", "Full-Stack Error Handling"],
                "tasks": [
                    "Configure Axios request interceptor injecting JWT bearer tokens",
                    "Build login and registration forms with validation feedback",
                    "Connect frontend form submit to backend REST endpoints"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' Fullstack React FastAPI JWT authentication tutorial')}",
                "doc": "https://axios-http.com/docs/intro",
                "course": "https://www.youtube.com/c/TraversyMedia"
            },
            {
                "title": "Testing, Build Optimization & Vercel Deployment",
                "desc": "Write unit tests, optimize production bundle size, and deploy live application.",
                "topics": ["Vitest & React Testing Library", "Vite Build Bundle Analysis", "Production Deployment to Vercel/Netlify"],
                "tasks": [
                    "Write unit tests for UI components using React Testing Library",
                    "Run npm run build and inspect bundle size optimization",
                    "Deploy live application to Vercel/Netlify with environment variables"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' Deploy React Vite app to Vercel tutorial')}",
                "doc": "https://vitejs.dev/guide/building.html",
                "course": "https://vercel.com/docs"
            }
        ]
    else:
        modules = [
            {
                "title": f"{goal_name} - Foundational Concepts & Setup",
                "desc": f"Understand core principles, install required tools, and master basic syntax for {goal_name}.",
                "topics": [f"{goal_name} Architecture Basics", f"Development Environment Configuration", f"Foundational Patterns & Conventions"],
                "tasks": [
                    f"Setup development environment and install dependencies for {goal_name}",
                    f"Write initial starter program illustrating key syntax concepts",
                    f"Review official getting started guide for {goal_name}"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' tutorial for beginners full course')}",
                "doc": "https://developer.mozilla.org/en-US/docs/Learn",
                "course": "https://www.freecodecamp.org/"
            },
            {
                "title": f"{goal_name} - Intermediate Mechanics & Core APIs",
                "desc": f"Explore standard library modules, data structures, and practical application patterns.",
                "topics": [f"Core Data Structures in {goal_name}", f"API Request Handling & Transformations", f"Error Handling & Exception Guards"],
                "tasks": [
                    f"Build modular function utilities for {goal_name}",
                    f"Implement robust error handling and input validation",
                    f"Write automated test scripts testing core function output"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' practical project guide')}",
                "doc": "https://docs.python.org/3/tutorial/",
                "course": "https://www.codecademy.com/"
            },
            {
                "title": f"{goal_name} - Advanced Architecture & Best Practices",
                "desc": f"Design scalable component structures, asynchronous routines, and performance optimizations.",
                "topics": [f"Design Patterns for {goal_name}", f"Asynchronous IO & Concurrency", f"Code Cleanliness & Refactoring"],
                "tasks": [
                    f"Refactor codebase using established software design patterns",
                    f"Implement async execution loops to improve performance",
                    f"Perform code audit enforcing strict linting rules"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' advanced architecture patterns')}",
                "doc": "https://refactoring.guru/design-patterns",
                "course": "https://coursera.org"
            },
            {
                "title": f"{goal_name} - Real-World Projects & Integration",
                "desc": f"Combine backend databases, external APIs, and UI elements into a cohesive project.",
                "topics": [f"Database Connection & ORM Integration", f"Third-Party API Integration", f"State Persistence & Caching"],
                "tasks": [
                    f"Integrate relational database persistence with ORM queries",
                    f"Fetch and parse data from third-party REST APIs",
                    f"Build end-to-end working feature prototype"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' full project integration tutorial')}",
                "doc": "https://swagger.io/docs/",
                "course": "https://edx.org"
            },
            {
                "title": f"{goal_name} - Testing, Debugging & Security",
                "desc": f"Write integration test suites, debug bottlenecks, and enforce security compliance.",
                "topics": [f"Automated Integration Testing", f"Security Best Practices & Input Sanitization", f"Performance Profiling & Optimization"],
                "tasks": [
                    f"Achieve high test coverage using automated test runner",
                    f"Audit application for security vulnerabilities and sanitization",
                    f"Profile execution bottlenecks and optimize database queries"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' testing and security tutorial')}",
                "doc": "https://owasp.org/www-project-top-ten/",
                "course": "https://pluralsight.com"
            },
            {
                "title": f"{goal_name} - Production Deployment & Capstone Project",
                "desc": f"Containerize with Docker, setup CI/CD pipelines, and deploy capstone project live.",
                "topics": [f"Docker Containerization", f"CI/CD Automated Deployment Pipelines", f"Capstone Project Launch"],
                "tasks": [
                    f"Write Dockerfile and containerize application service",
                    f"Setup GitHub Actions workflow for automated testing & build",
                    f"Deploy capstone project live to cloud production platform"
                ],
                "video": f"https://www.youtube.com/results?search_query={urllib.parse.quote(goal_name + ' docker ci cd deployment tutorial')}",
                "doc": "https://docs.docker.com/get-started/",
                "course": "https://udemy.com"
            }
        ]

    generated_weeks = []
    for w in range(1, duration_weeks + 1):
        m_idx = (w - 1) % len(modules)
        mod_tmpl = modules[m_idx]
        
        # Unique title if looping
        mod_title = f"Module {w}: {mod_tmpl['title']}" if duration_weeks > 6 else f"Module {w}: {mod_tmpl['title']}"
        
        # Build 3 specific tasks with unique IDs
        tasks_list = []
        for t_i, task_desc in enumerate(mod_tmpl["tasks"]):
            tasks_list.append({
                "id": 1000 + w * 20 + t_i + 1,
                "title": task_desc,
                "completed": False
            })

        generated_weeks.append({
            "week_number": w,
            "week": w,
            "title": mod_title,
            "description": mod_tmpl["desc"],
            "estimated_hours": float(hours_per_wk),
            "milestone": f"Milestone {w}: Pass Week {w} Practical Assessment",
            "assignment": f"Complete hands-on project for Week {w}: {mod_tmpl['title']}",
            "topics": [
                {
                    "title": mod_tmpl["topics"][0],
                    "description": f"Detailed study into {mod_tmpl['topics'][0]} for {goal_name}.",
                    "estimated_hours": hours_per_wk / 2.0,
                    "resources": [
                        {
                            "title": f"{goal_name} Video Course & Tutorial (Week {w})",
                            "url": mod_tmpl["video"],
                            "type": "Video",
                            "is_free": True
                        },
                        {
                            "title": f"{goal_name} Official Documentation & Guides",
                            "url": mod_tmpl["doc"],
                            "type": "Documentation",
                            "is_free": True
                        }
                    ]
                },
                {
                    "title": mod_tmpl["topics"][1] if len(mod_tmpl["topics"]) > 1 else f"{goal_name} Core Lab",
                    "description": f"Hands-on lab exercising {mod_tmpl['topics'][1] if len(mod_tmpl['topics']) > 1 else goal_name}.",
                    "estimated_hours": hours_per_wk / 2.0,
                    "resources": [
                        {
                            "title": f"Interactive {goal_name} Learning Course",
                            "url": mod_tmpl["course"],
                            "type": "Course",
                            "is_free": True
                        }
                    ]
                }
            ],
            "tasks": tasks_list
        })

    fallback_data = {
        "constraints": {
            "hours_per_week": hours_per_wk,
            "budget": 50,
            "learning_method": "both (videos and text)",
            "prior_experience": "Intermediate"
        },
        "roadmap": {
            "title": f"{goal_name} Master Roadmap",
            "goal": goal_name,
            "skill_level": "Intermediate",
            "estimated_duration_weeks": duration_weeks,
            "total_estimated_hours": float(hours_per_wk * duration_weeks),
            "overview": f"A comprehensive {duration_weeks}-week AI learning path designed to master {goal_name}.",
            "weeks": generated_weeks
        }
    }

    from app.schemas.roadmap_schema import ModifiedRoadmap
    try:
        return ModifiedRoadmap(**fallback_data)
    except Exception:
        return fallback_data