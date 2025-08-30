AI Knowledge Hub
================
An AI-powered full-stack knowledge management system that allows teams to create, search,
summarize, and collaborate on documents.
Built with MERN stack + Tailwind CSS + Gemini AI API.
---
n Features
-----------
- n User Authentication (Register/Login with JWT, roles: user & admin)
- n Document Management
- Create, edit, delete documents
- Auto AI Summary & Tags
- Version history tracking
- n Search
- Text-based (regex search)
- Semantic search (Gemini embeddings)
- n Team Q&A;
- Ask natural language questions across all documents
- AI-powered answers with sources shown
- n Activity Feed – see who did what (create/edit/summarize)
- n Modern UI/UX
- Built with React + Tailwind CSS
- Skeleton loaders for smooth experience
- Toast notifications for feedback
---
nn Tech Stack
--------------
- Frontend: React + Vite + Tailwind CSS + React Router + Context API + React Toastify
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT (JSON Web Tokens)
- AI: Gemini API (for summarization, tags, semantic search, Q&A;)
---
nn Setup Guide
--------------
1. Clone Repo
```bash
git clone https://github.com/Subash-Student/Ai_Knowledge_Hub.git
cd Ai_Knowledge_Hub
```
2. Configure Environment
- Copy `.env.example` to `.env` inside the **server/** and **client/** folder:
```bash
The env.example file contails the original values of frontend and backend env values use it for test.
```
- 
3. Start Backend
```bash
cd server
npm install
npm run server # starts backend on http://localhost:4000
```

4. Start Frontend
```bash
cd ../client
npm install
npm run dev # starts frontend on http://localhost:5173
```

- Built by Subash
