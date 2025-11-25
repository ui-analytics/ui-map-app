# Database Migration & API Setup

## What We've Done 

This project has been upgraded from using static mock data to a **database-driven backend** with a REST API. Think of it like moving from a paper filing cabinet to a digital database system.

## The Problem 
- Variable and category data was hardcoded in TypeScript files
- Adding new data required code changes
- No easy way to manage data across multiple projects
- Difficult to scale or deploy in production

## The Solution 

### 1. **Database Setup** 
Created a local SQLite database that stores:
- **Projects** (like "Regional Explorer")
- **Categories** (like "Health", "Education", "Housing")  
- **Variables** (75+ data points like "Population Density", "Crime Rate")

### 2. **Data Migration Script** (`backend/seed_database.py`)
- Reads your existing TypeScript mock files
- Automatically imports all data into the database
- Can be re-run whenever you update mock files
- No manual data entry required!

### 3. **REST API** (`backend/main.py`)
- FastAPI server that serves data from the database
- Interactive documentation at `http://localhost:8000/docs`
- Clean endpoints for projects, categories, and variables

### 4. **Frontend Integration**
Updated Angular service to:
- Fetch data from API instead of static files
- Environment flag to switch between API and mock data
- Zero breaking changes to existing functionality

## How to Use 

### Prerequisites:
- Node.js and npm installed
- Python installed

### First Time Setup:

1. **Install Python Dependencies:**
   ```bash
   pip install fastapi sqlalchemy uvicorn pydantic
   ```

2. **Import Data into Database:**
   ```bash
   python backend/seed_database.py
   ```

### Daily Development:

1. **Start the Backend API:**
   ```bash
   uvicorn backend.main:app --reload
   ```
   - API will run at: `http://127.0.0.1:8000`
   - API docs available at: `http://127.0.0.1:8000/docs`

2. **Start the Frontend (in a new terminal):**
   ```bash
   npm start
   ```
   - App will run at: `http://localhost:4200`

### Switch Data Sources:
In `src/environments/environment.ts`:
- `useApi: true` → Gets data from database
- `useApi: false` → Uses original mock files

## Benefits 

- **Scalable**: Ready for multiple projects
- **Maintainable**: Data managed in database, not code
- **Production Ready**: Easy to deploy with cloud databases
- **Developer Friendly**: Interactive API docs and environment switching
- **Future Proof**: Foundation for advanced features

## Files Added 
- `backend/seed_database.py` - Data migration script
- `backend/main.py` - FastAPI server
- `backend/regional_explorer.db` - SQLite database
- `src/environments/` - Environment configuration

*The app works exactly the same as before, but now it's powered by a proper database!*