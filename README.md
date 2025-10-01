# 🤖 AI Agent Developer

AI Agent Developer is a full-stack **MERN** application with real-time collaboration, AI-assisted task execution, messaging, and integrated code execution using WebContainers.

It combines **Socket.IO**, **Gemini AI API**, **Redis**, and **React** to provide an interactive developer environment where users can create projects, chat, collaborate, and run code — all inside the browser.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration & login  
- JWT-based authentication middleware  
- Redis-powered session management  
- Logout functionality  
- Protected routes for both backend & frontend  

### 📂 Project Management
- Create, update, and manage projects  
- Add collaborators in real-time  
- Project-based socket connections  

### 💬 Real-Time Messaging
- Project-specific chat rooms  
- State-managed message handling  
- Improved broadcasting and alignment  
- AI-powered responses  

### 🤖 AI Integration
- Gemini AI API for task automation  
- Prompt engineering best practices  
- Example prompts for better results  
- Conversational AI mode  

### 🖥 WebContainer Integration
- File tree structure management  
- Syntax highlighting  
- In-browser code editor  
- Run and manage code execution in iframe  
- File updates with live preview  

---

## ⚡ Tech Stack
- **Frontend:** React, React Router, Context API, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Real-Time:** Socket.IO  
- **Cache:** Redis  
- **AI:** Google Gemini API  
- **Code Execution:** WebContainer API  

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/coderjeet63/Ai_Agent_For_Developer.git
cd Ai_Agent_For_Developer

cd backend
npm install


backend/.env

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
GEMINI_API_KEY=your_gemini_api_key


Start the backend:

npm run dev

3️⃣ Frontend Setup

cd ../frontend
npm install

VITE_API_URL=http://localhost:5000

Start the frontend:
npm run dev
