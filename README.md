# 🚀 AI Interview Preparation Platform

An AI-driven technical interview preparation web application designed to simulate structured interviews, generate role-specific challenges, and facilitate deep concept retention through AI-powered explanations. 

Unlike generic question banks, this platform focuses on **depth, personalization, and revision efficiency.**

---

## 📑 Table of Contents
- [Product Overview](#-product-overview)
- [Core Capabilities](#-core-capabilities)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Data Model](#-data-model)
- [Installation & Setup](#-installation--setup)
- [Design Philosophy](#-design-philosophy)
- [Future Roadmap](#-future-roadmap)

---

## 🌟 Product Overview
The platform enables users to generate personalized interview sessions based on their **Target Role**, **Experience Level**, and **Specific Focus Areas**. 

The system is built for **serious interview preparation**, moving away from passive reading toward active recall and structured learning.

---

## 🛠 Core Capabilities

* **Secure Identity:** JWT-based authentication for session isolation and private data access.
* **Adaptive Generation:** Utilizes Gemini API to eliminate generic questions, focusing on role-specific technical depth.
* **On-Demand Explanations:** Deep-dive into complex concepts to prevent shallow memorization.
* **Structured UI:** Accordion-based interface separating questions, answers, explanations, and personal notes.
* **Revision System:** A "Pin" mechanism for bookmarking high-value questions for fast access.
* **Persistent History:** All sessions stored in MongoDB, allowing users to pause and resume anytime.

---

## 💻 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **AI Engine:** Google Gemini Pro API
- **Security:** JWT (JSON Web Tokens), Bcrypt

---

## 🏗 Project Architecture

### **Frontend (`/client`)**
```
src/
├── components/
│   ├── Cards/            # Interview & question cards
│   ├── Inputs/           # Reusable inputs
│   ├── Layouts/          # Page wrappers
│   ├── Loader/           # Loading states
│   └── Modal.jsx         # Global modal system
├── context/              # State management (Auth/Session)
│ ├── pages/
│ │ ├── Auth/             # Login & Register
│ │ ├── Home/             # Dashboard
│ │ ├── InterviewPrep/    # Interview flow
│ │ └── LandingPage.jsx   # Auth, Dashboard, Prep Flow
└── utils/                # API helpers & interceptors
```

### **Backend (`/server`)**
```
server/
├── controllers/          # Business logic & AI orchestration
├── middlewares/          # Auth guards & validation
├── models/               # Mongoose schemas
├── routes/               # API endpoints
└── utils/                # Prompt engineering & AI helpers
```

## 📊 Data Model

The system architecture is built around three core entities:

- **User**
  - Secure profile data
  - Authentication credentials
  - Ownership of interview sessions

- **Interview Session**
  - Role and experience level
  - Session metadata and timestamps
  - Collection of generated questions

- **Interview Question**
  - AI-generated question
  - AI-generated answer
  - Detailed AI explanation
  - User-written notes
  - Pinned status for revision

---

## 🧠 AI Integration Strategy

The application uses **Centralized Prompt Management** to ensure consistent, high-quality AI output and long-term maintainability.

- **Generation Prompt**
  - Adapts question complexity based on role and seniority

- **Answer Prompt**
  - Produces industry-aligned, technically accurate answers

- **Explanation Prompt**
  - Breaks concepts down into *how* and *why*
  - Designed for first-principles understanding

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository_url>
cd interview-prep-ai
```
### 2. Backend Setup

Create a .env file inside the /server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend:
```
cd server
npm install
npm run server
```
### 3. Frontend Setup

Create a .env file inside /client/interview-prep-ai:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend:
```bash
cd client/interview-prep-ai
npm install
npm run dev
```

---

## 🎨 Design Philosophy

Our design choices are guided by the goal of transforming passive browsing into active learning.

* **Interview-First Thinking:** Every feature mirrors the flow and technical pressure of a real-world interview, ensuring users are mentally prepared for the actual event.
* **Minimal UI Noise:** We use a clean, distraction-free interface to reduce cognitive load, allowing users to focus entirely on the technical content.
* **Revision Efficiency:** Features like "Pinning" and "Structured Notes" are specifically optimized for fast recall during last-minute preparation and long-term retention.
* **AI as an Assistant:** The AI is designed to guide, explain, and probe—it serves as a mentor that encourages deep understanding rather than a tool for copy-pasting answers.

---

## 👨‍💻 Author

**Developed by Aryan Hulawale**

* **GitHub:** [@AryanHulawale](https://github.com/AryanHulawale)
* **LinkedIn:** [Aryan Hulawale](https://www.linkedin.com/in/aryan-hulawale/)

---

*Made with ❤️ for developers preparing for their next big career move.*

