# ✈️ VoyageX - AI Travel Planning Platform

VoyageX is a full-stack modern web application that allows users to explore destinations, book travel packages, and generate AI-powered day-by-day itineraries instantly.

## 🚀 Features

- **Instant AI Itineraries:** Fully offline-capable, instant itinerary generation using our built-in Smart Engine.
- **Persistent Local Database:** Runs entirely locally without needing an external MongoDB connection (but fully supports MongoDB Atlas for production).
- **End-to-End Booking:** Complete user flow from selecting a destination to processing payments and generating confirmation codes.
- **Admin Dashboard:** Full administrative control to manage users, view revenue analytics, manage bookings, and respond to reviews.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop views.

---

## 📦 Dependencies & Prerequisites

Before sharing or running the project, ensure you have the following installed on your machine:
- **Node.js** (v18.0 or higher recommended)
- **Git** (if you plan to push to GitHub)

The core dependencies automatically installed via `npm install` include:
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Radix UI, Framer Motion (for animations), Next-Themes (for dark mode).
- **Backend:** Node.js, Express.js, Mongoose, BcryptJS, JSON Web Tokens (JWT).

---

## 💻 Running the Project Locally

### 1. Start the Backend API
The backend stores all data locally in JSON files (`app/backend/localdb`) by default. This makes it extremely easy to run without any setup!

Open a terminal and run:
```bash
cd app/backend
npm install
npm start
```
*The backend will run on `http://localhost:5000`*

### 2. Start the Frontend Application
Open a **new** terminal window and run:
```bash
cd app
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 🔐 Default Demo Accounts

The local database is automatically seeded with demo accounts so you can test all features immediately.

**Admin Account:**
- Email: `admin@voyagex.com`
- Password: `admin123`

**User Account:**
- Email: `user@voyagex.com`
- Password: `user123`

---

## 🗄️ Connecting MongoDB Atlas (Local & Production)

While the project uses local JSON files by default, connecting it to a real MongoDB database is highly recommended before sharing the project in production.

### 1. Create your MongoDB Cluster
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and allow access from anywhere (`0.0.0.0/0`).
3. Go to **Database Access** and create a database user (remember the username and password).
4. Click **Connect** on your cluster and copy your connection string. It will look like this: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/voyagex?retryWrites=true&w=majority`.

### 2. Connect Your Local Code
To make your local backend use MongoDB instead of the local files:
1. Navigate to the `app/backend/` folder.
2. Create a new file named `.env` (if it doesn't already exist).
3. Add your connection string inside the `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/voyagex?retryWrites=true&w=majority
   ```
4. Restart your backend server. It will automatically detect the URI, connect to MongoDB, and seed your database!

---

## 🌍 Production Deployment (Render)

VoyageX is built to be easily deployed for free using Render.com.

### 2. Backend (Render Web Service)
1. Push this code to a private GitHub repository.
2. Create a **New Web Service** on Render.com.
3. Set root directory to `backend`.
4. Set Build Command to `npm install` and Start Command to `node server.js`.
5. Add Environment Variables:
   - `MONGODB_URI` = *(your MongoDB connection string)*
   - `NODE_ENV` = `production`
   - `PORT` = `5000`

> **Note:** The first time your backend connects to an empty MongoDB database, it will **automatically seed** all 25 destinations and the admin/user accounts for you!

### 3. Frontend (Render Static Site)
1. Create a **New Static Site** on Render.com.
2. Leave root directory empty.
3. Set Build Command to `npm install && npm run build`.
4. Set Publish Directory to `dist`.
5. Add Environment Variables:
   - `VITE_API_URL` = *(your Render backend URL, e.g., `https://voyagex-api.onrender.com/api`)*

---

## 🤝 How to Share This Project

You can share this project with others in two ways:

### Method 1: Share via GitHub (Recommended)
1. Initialize a Git repository in the `app` folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on your GitHub account.
3. Push the code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/yourusername/voyagex.git
   git push -u origin main
   ```
4. Share the GitHub link with anyone! They can clone it and run the local instructions above.

### Method 2: Share via ZIP File
If you want to send the project files directly:
1. Delete the `node_modules` folders inside both the `app/` and `app/backend/` directories to reduce file size.
2. Right-click the main `app/` folder and select **Compress to ZIP file**.
3. Send the `.zip` file via email, Google Drive, or Slack. 
4. The receiver will just need to extract it and run `npm install` in both folders.
