# 🎓 CodeLearn — Online Learning Management System (LMS)

A full-stack MERN (MongoDB, Express, React, Node.js) Learning Management System focused exclusively on **programming and software development courses**.

---

## 🚀 Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18, React Router v6, Axios      |
| Backend    | Node.js, Express.js                   |
| Database   | MongoDB Atlas, Mongoose               |
| Auth       | JWT (JSON Web Tokens), bcryptjs       |
| Styling    | Custom CSS with CSS Variables         |

---

## 📁 Project Structure

```
lms-platform/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js      # Signup, Login, Profile
│   │   └── courseController.js    # CRUD, Enroll, Progress, Seed
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect middleware
│   ├── models/
│   │   ├── Course.js              # Course + Lesson schema
│   │   └── User.js                # User + EnrolledCourses schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── courseRoutes.js
│   ├── .env
│   ├── server.js                  # Express app entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── CourseCard.jsx
        │   ├── SearchBar.jsx
        │   ├── ProgressBar.jsx
        │   └── Spinner.jsx
        ├── context/
        │   └── AuthContext.jsx     # Global auth state
        ├── pages/
        │   ├── Home.jsx            # Course catalog with search/filter
        │   ├── CourseDetails.jsx   # Full course info + enroll
        │   ├── MyCourses.jsx       # Enrolled courses with progress
        │   ├── CoursePlayer.jsx    # Lesson player with sidebar
        │   ├── Login.jsx
        │   └── Signup.jsx
        ├── routes/
        │   └── ProtectedRoute.jsx  # Auth guard for private routes
        ├── services/
        │   └── api.js              # Axios instance + API functions
        ├── styles/
        │   ├── global.css
        │   ├── Navbar.css
        │   ├── Home.css
        │   ├── CourseCard.css
        │   ├── SearchBar.css
        │   ├── ProgressBar.css
        │   ├── Spinner.css
        │   ├── CourseDetails.css
        │   ├── MyCourses.css
        │   ├── CoursePlayer.css
        │   └── Auth.css
        ├── App.jsx
        └── index.js
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v16+ installed
- npm v8+ installed

### 1. Clone / Extract the project

```bash
cd lms-platform
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file (already included) or verify it contains:

```env
PORT=5000
JWT_SECRET=lms_codelearn_jwt_secret_2024
NODE_ENV=development
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run dev        # development (nodemon)
# or
npm start          # production
```

Backend runs at: **http://localhost:5000**

### Start Frontend (separate terminal)

```bash
cd frontend
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🌱 Seeding the Database

The first time you open the app, courses won't exist yet. You have two ways to seed:

**Option 1 — From the UI:** On the Home page, click the **"Load Sample Courses"** button.

**Option 2 — API call:**
```bash
curl -X POST http://localhost:5000/api/courses/seed/all
```

This inserts **10 programming courses** into MongoDB:
- JavaScript for Beginners
- Advanced React Development
- Python Programming Masterclass
- Node.js Backend Development
- Data Structures and Algorithms
- Machine Learning with Python
- Full Stack Web Development
- MongoDB for Developers
- Java Fundamentals
- C++ Programming

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint             | Description          | Auth |
|--------|----------------------|----------------------|------|
| POST   | `/api/auth/signup`   | Register new user    | No   |
| POST   | `/api/auth/login`    | Login, returns JWT   | No   |
| GET    | `/api/auth/profile`  | Get current user     | Yes  |

### Courses
| Method | Endpoint                        | Description                  | Auth |
|--------|---------------------------------|------------------------------|------|
| GET    | `/api/courses`                  | All courses (search/filter)  | No   |
| GET    | `/api/courses/:id`              | Single course with lessons   | No   |
| POST   | `/api/enroll`                   | Enroll in a course           | Yes  |
| GET    | `/api/mycourses`                | My enrolled courses          | Yes  |
| PUT    | `/api/courses/:courseId/progress` | Update lesson progress     | Yes  |
| POST   | `/api/courses/seed/all`         | Seed sample courses          | No   |

### Query Parameters (GET /api/courses)
- `search` — search by title or instructor
- `category` — filter by: `Programming Language`, `Web Development`, `Backend Development`, `Data Science`
- `level` — filter by: `Beginner`, `Intermediate`, `Advanced`

---

## 🔐 Protected Routes

| Route          | Requires Login |
|----------------|----------------|
| `/my-courses`  | ✅ Yes          |
| `/player/:id`  | ✅ Yes          |
| `/`            | ❌ No           |
| `/course/:id`  | ❌ No           |
| `/login`       | ❌ No           |
| `/signup`      | ❌ No           |

---

## 🎨 Features

- **Dark theme** with CSS variables — easily themeable
- **Responsive** layout for mobile, tablet, and desktop
- **Search** courses by title or instructor name (debounced)
- **Filter** by category and difficulty level
- **Course cards** with thumbnail, rating, level badge, instructor
- **Enrollment** with instant UI feedback
- **Progress tracking** — mark lessons complete, auto-calculates %
- **Course Player** — lesson sidebar, active lesson highlighting
- **JWT auth** persisted in localStorage, auto-attached via Axios interceptor
- **Loading spinners** and error states throughout
- **Form validation** on Login and Signup

---

## 📦 Dependencies

### Backend
- `express` — HTTP framework
- `mongoose` — MongoDB ODM
- `jsonwebtoken` — JWT auth
- `bcryptjs` — password hashing
- `cors` — cross-origin requests
- `dotenv` — environment variables

### Frontend
- `react` / `react-dom` — UI framework
- `react-router-dom` — client-side routing
- `axios` — HTTP client with interceptors

---

*Built as a professional MERN stack project with modular architecture and clean code.*
