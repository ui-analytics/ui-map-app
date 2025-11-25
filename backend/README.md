# Backend API Setup

## Quick Start

### 1. Install Dependencies
**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Initialize Database
```bash
cd backend
python seed_database.py
cd ..
```

### 3. Start API Server

The API will be available at: `http://127.0.0.1:8000`
Interactive docs at: `http://127.0.0.1:8000/docs`
Frontend at: `http://localhost:4200/`

### Option 1: Single Command (Recommended)
Install concurrently first: `npm install --save-dev concurrently`

```bash
npm run start:dev
```
This starts both backend API and frontend simultaneously.

### Option 2: Manual (Two Terminals)
1. **Terminal 1 - Start Backend API:**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Terminal 2 - Start Frontend:**
   ```bash
   ng serve
   ```

Both services must run simultaneously during development.

## Deployment

### Frontend (Netlify)
- Build: `npm run build`
- Deploy `dist/` folder to Netlify

### Backend API
**Cannot deploy to Netlify** (static hosting only). Options:
1. **Railway** - Simple Python app deployment
2. **Render** - Free tier for FastAPI apps
3. **Heroku** - Easy deployment with PostgreSQL addon
4. **DigitalOcean App Platform** - Managed platform

### Production Database
Replace SQLite with PostgreSQL for production:
```python
DATABASE_URL = "postgresql://user:password@host:port/database"
```

## Database Management

### Database Commands

The seeding script now supports multiple operations:

```bash
# Full database seeding from mock files (default)
python seed_database.py
# or explicitly:
python seed_database.py seed

# Update database with new data (preserves existing data)
python seed_database.py update

# List all current database contents
python seed_database.py list
```

### Adding New Data (Recommended Method)

#### Option 1: Update Mock Files (Best for Development)
1. Add new variables to `src/app/shared/mocks/mock-map-variable.ts`
2. Add new categories to `src/app/shared/mocks/mock-map-category.ts`
3. Run full re-seed: `python seed_database.py seed`
4. Restart API server

#### Option 2: Direct Script Updates (Best for Small Changes)
1. Open `seed_database.py`
2. Find the `update_database()` function
3. Add your new data to the appropriate arrays:

```python
# Add new variables
new_variables = [
    {
        "variableId": 999,
        "name": "New Population Metric",
        "featureServiceUrl": "https://example.com/service",
        "fieldName": "new_field",
        "bivariateField": "new_bivariate",
        "moransField": "new_morans", 
        "valueType": "number",
        "yearsAvailable": [2023, 2024],
        "disabled": False
    }
]

# Add new categories
new_categories = [
    {
        "name": "New Category",
        "project_id": 1,
        "variable_ids": [1, 2, 999]  # Associate with variable IDs
    }
]

# Update existing variables
variable_updates = [
    {
        "variableId": 1,  # Variable to update
        "updates": {
            "name": "Updated Name",
            "yearsAvailable": [2020, 2021, 2022, 2023, 2024]
        }
    }
]
```

4. Run update: `python seed_database.py update`
5. Restart API server

### Database Inspection

```bash
# View all data in a readable format
python seed_database.py list

# Quick count check
python -c "from seed_database import *; db = SessionLocal(); print(f'Projects: {db.query(Project).count()}'); print(f'Categories: {db.query(Category).count()}'); print(f'Variables: {db.query(MapVariable).count()}')"
```

### Manual Database Updates:
- Database file: `backend/regional_explorer.db`
- Use SQLite browser or direct SQL commands
- Restart API server after changes

## Troubleshooting

### Common Issues:
- **500 errors**: Check if database seeding completed successfully
- **Import errors**: Ensure all dependencies installed with `pip install -r requirements.txt`
- **Database locked**: Stop API server before re-seeding database
- **No data returned**: Verify database has data with `python seed_database.py list`

### Quick Database Fixes:
```bash
# If database seems corrupted or empty
rm regional_explorer.db  # Delete old database
python seed_database.py seed  # Re-create from scratch

# If you need to add data without losing existing data
python seed_database.py update

# Check what's in the database
python seed_database.py list
```

### Database Location:
- File: `backend/regional_explorer.db`
- Automatically created in the backend directory
- Delete and re-run seeding script to reset