🚀 StockFlow MVP – Inventory Management System
📌 Overview

StockFlow MVP is a full-stack inventory management web application designed to efficiently manage stock, products, and basic business operations.

It was built as part of a technical assessment to demonstrate real-world full-stack development skills including authentication, database integration, REST APIs, and deployment.

🛠️ Tech Stack
Frontend
  -- React.js (Create React App)
  -- React Router DOM
  -- Axios
  -- Context API (Auth & Alert Management)
  -- CSS / Responsive UI
Backend
  -- Node.js
  -- Express.js
  -- Prisma ORM
  -- MySQL (Railway hosted DB)
  -- Authentication
  -- JWT (JSON Web Token)
  -- Protected Routes (Frontend + Backend)
Deployment
    -- Frontend: Vercel
    -- Backend: Railway / Cloud Hosting
    -- Database: Mysql (Railway)
✨ Key Features
🔐 Authentication System
    -- User Register & Login
    -- JWT-based authentication
    -- Protected routes for secure access
📦 Inventory Management
    -- Add new stock/items
   --  Update existing stock
   --  Delete products
   --  View all inventory data
🔎 Dashboard Features
   -- Clean dashboard UI for stock overview
   -- Structured listing of products/items
   -- Real-time API integration with backend
⚡ Application Features
   -- API-driven architecture (REST APIs)
   -- Context-based global state management
   -- Error handling & alert notifications
   --  Persistent login session (token-based)
📁 Project Structure

stockflow-mvp/
│
├── frontend/              # React application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│
├── backend/               # Node.js + Express API
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   └── server.js
│
├── prisma/                # Database schema
└── README.md

🚀 Getting Started
1. Clone the repository
  git clone https://github.com/Santhoshi8823/stockflow-mvp
  cd stockflow-mvp
2. Install dependencies
    Frontend
    cd frontend
    npm install
    npm start
    Backend
    cd backend
    npm install
    npm run dev
🔐 Environment Variables
Backend .env
  DATABASE_URL=your_mysql_connection_url
  JWT_SECRET=your_jwt_secret
  PORT=5000
  Frontend .env
REACT_APP_API_URL=https://stockflow-mvp-production-62bd.up.railway.app/
🌐 Live Links
🔗 Live Application: https://stockflow-mvp-v8gd.vercel.app
🔗 GitHub Repository: https://github.com/Santhoshi8823/stockflow-mvp
📌 What This Project Demonstrates
Full-stack architecture understanding
Secure authentication system (JWT)
REST API design & integration
Database modeling using Prisma ORM
Deployment on cloud platforms
Clean component-based frontend structure
📈 Future Improvements
Role-based access (Admin / User)
Advanced analytics dashboard
Pagination & filtering for inventory
Audit logs for stock changes
UI/UX improvements with modern dashboard design
👩‍💻 Developer

Santhoshi Inakoti
Full Stack Developer

📄 License

This project is developed as part of a technical assessment and demonstration purpose.
