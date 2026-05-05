# VoyageX - Setup Guide

## ⚠️ Why Login/Signup & Destinations Are Not Working

The deployed frontend (https://g2tpb7fgb5gjq.ok.kimi.link) is just the **static website**. For the full functionality to work, you need to:

1. **Set up MongoDB Atlas** (free cloud database)
2. **Run the backend server** on your local machine or deploy it

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create MongoDB Atlas Account (FREE)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google or email (it's FREE)
3. Create a new organization (name it anything)
4. Create a new project called "VoyageX"
5. Click "Build a Database"
6. Choose **M0 (FREE)** tier
7. Select a cloud provider (AWS, Google Cloud, or Azure) and region closest to you
8. Click "Create Cluster" (takes 1-3 minutes)

### Step 2: Create Database User

1. In MongoDB Atlas, click "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username: `voyagex_user`
5. Set password: `your_secure_password` (remember this!)
6. Under "Database User Privileges", select "Read and write to any database"
7. Click "Add User"

### Step 3: Get Your Connection String

1. Click "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://voyagex_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 4: Update Environment Variables

1. Open `/mnt/okcomputer/output/app/backend/.env`
2. Replace the `MONGODB_URI` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://voyagex_user:your_password@cluster0.xxxxx.mongodb.net/voyagex?retryWrites=true&w=majority
   ```

### Step 5: Install Backend Dependencies

```bash
cd /mnt/okcomputer/output/app/backend
npm install
```

### Step 6: Start the Backend Server

```bash
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
Environment: development
Seeding destinations...
Inserted 6 destinations
Admin user created successfully!
```

### Step 7: Test the API

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "VoyageX API is running",
  "timestamp": "2024-..."
}
```

### Step 8: Test Destinations API

Go to:
```
http://localhost:5000/api/destinations
```

You should see a list of destinations!

---

## 🖥 Running the Frontend Locally

In a **new terminal window**:

```bash
cd /mnt/okcomputer/output/app
npm run dev
```

The frontend will open at: `http://localhost:5173`

---

## ✅ Testing the Full Application

### 1. Browse Destinations
- Go to http://localhost:5173/destinations
- You should see 6 destinations loaded from the database

### 2. Sign Up
- Go to http://localhost:5173/register
- Fill in your details and create an account

### 3. Login
- Use your newly created credentials

### 4. Admin Login
- Email: `admin@voyagex.com`
- Password: `admin123`
- Go to http://localhost:5173/admin/login

---

## 🌐 Deploying the Backend (Optional)

To make the website work without running the backend locally, deploy it to:

### Option 1: Render (FREE)
1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Create a new Web Service
4. Connect your GitHub repo
5. Set build command: `cd backend && npm install`
6. Set start command: `cd backend && npm start`
7. Add environment variables from your `.env` file
8. Deploy!

### Option 2: Railway (FREE)
1. Go to [Railway](https://railway.app)
2. Sign up and create a new project
3. Deploy from GitHub repo
4. Add MongoDB plugin
5. Deploy!

---

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
- Check your internet connection
- Verify your MongoDB Atlas connection string
- Make sure you've whitelisted your IP in MongoDB Atlas (Network Access)

### "Port 5000 already in use"
- Change the PORT in `.env` to something else (e.g., 5001)
- Or kill the process using port 5000

### "Module not found" errors
- Run `npm install` again in the backend folder
- Make sure you're in the correct directory

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check that `FRONTEND_URL` in backend `.env` matches your frontend URL
- For local development, use `http://localhost:5173`

---

## 📞 Need Help?

If you're still having issues:

1. Check the backend console for error messages
2. Verify MongoDB Atlas cluster is running (green dot)
3. Test the API endpoints directly in your browser
4. Check browser console (F12) for frontend errors

---

## 🎉 What's Included in the Database Seed

When you start the backend, it automatically creates:

### 6 Sample Destinations:
1. **Paris, France** - City of Light
2. **Bali, Indonesia** - Tropical Paradise
3. **Tokyo, Japan** - Modern Metropolis
4. **Santorini, Greece** - Romantic Getaway
5. **New York City, USA** - The City That Never Sleeps
6. **Dubai, UAE** - Luxury Destination

### Admin User:
- Email: `admin@voyagex.com`
- Password: `admin123`

---

**You're all set! Enjoy exploring VoyageX! 🌍✈️**
