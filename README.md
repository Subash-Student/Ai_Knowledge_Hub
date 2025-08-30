
# AI Knowledge Hub

An AI-powered full-stack knowledge management system that allows teams to **create, search, summarize, and collaborate on documents**.  
Built with **MERN stack + Tailwind CSS + Gemini AI API**.

---

## 🌐 Live Links
- **Live Demo:** [https://ai-knowledge-hub-pied.vercel.app/](https://ai-knowledge-hub-pied.vercel.app/)  
- **Demo Video (Google Drive):** [https://drive.google.com/file/d/19wz10oa5PqMDs8PQOkhWCsOyoQyupitD/view?usp=drive_link](https://drive.google.com/file/d/19wz10oa5PqMDs8PQOkhWCsOyoQyupitD/view?usp=drive_link)

---

## ✨ Features

- 🔐 **User Authentication** (Register/Login with JWT, roles: `user` & `admin`)
- 📄 **Document Management**  
  - Create, edit, delete documents  
  - Auto **AI Summary & Tags**  
  - **Version history tracking**  
- 🔎 **Search**  
  - Text-based (regex search)  
  - Semantic search (Gemini embeddings)  
- 🤝 **Team Q&A**  
  - Ask natural language questions across all documents  
  - AI-powered answers with **sources shown**  
- 📝 **Activity Feed** – see who did what (create/edit/summarize)  
- 🎨 **Modern UI/UX**  
  - Built with **React + Tailwind CSS**  
  - **Skeleton loaders** for smooth experience  
  - **Toast notifications** for feedback  

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + React Router + Context API + React Toastify  
- **Backend:** Node.js + Express + MongoDB (Mongoose)  
- **Auth:** JWT (JSON Web Tokens)  
- **AI:** Gemini API (for summarization, tags, semantic search, Q&A)  

---

## ⚙️ Setup Guide

### 1. Clone Repo
```bash
git clone https://github.com/Subash-Student/Ai_Knowledge_Hub.git
cd Ai_Knowledge_Hub
```

### 2. Configure Environment
- Copy `.env.example` to `.env` inside the **server/** and **client/** folders.  
- The `.env.example` file contains the required environment variable keys for both frontend and backend.  
- Fill in your own values:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `GEMINI_API_KEY`

### 3. Start Backend
```bash
cd server
npm install
npm run dev   # starts backend on http://localhost:4000
```

### 4. Start Frontend
```bash
cd ../client
npm install
npm run dev   # starts frontend on http://localhost:5173
```

---

## 👨‍💻 Author

- Built by **Subash**  
- Assignment for **Cybermind Works**
