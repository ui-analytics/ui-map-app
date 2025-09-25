from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from pydantic import BaseModel

# Import models and SessionLocal from the seeding script
from backend.seed_database import SessionLocal, Project, Category, MapVariable

app = FastAPI(
    title="Regional Explorer API",
    description="API for accessing project, category, and map variable data.",
    version="1.0.0"
)

# --- Dependency to get DB session ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic Models for API response structure (to prevent recursion) ---
class MapVariableBase(BaseModel):
    variableId: int
    name: str
    featureServiceUrl: Optional[str] = None
    fieldName: str
    bivariateField: str
    moransField: str
    valueType: str
    yearsAvailable: List[int]
    disabled: bool

    class Config:
        orm_mode = True

class CategoryBase(BaseModel):
    id: int
    name: str
    variables: List[MapVariableBase] = []

    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    id: int
    name: str
    categories: List[CategoryBase] = []
    
    class Config:
        orm_mode = True

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Regional Explorer API"}

@app.get("/projects/{project_name}", response_model=ProjectBase)
def get_project_details(project_name: str, db: Session = Depends(get_db)):
    """
    Retrieves a single project with all its associated categories and variables.
    This is the primary endpoint your application will call on load.
    """
    project = db.query(Project).options(
        joinedload(Project.categories).joinedload(Category.variables)
    ).filter(Project.name == project_name).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return project

@app.get("/variables", response_model=List[MapVariableBase])
def get_all_variables(db: Session = Depends(get_db)):
    """
    Retrieves a flat list of all map variables in the database.
    """
    return db.query(MapVariable).all()

@app.get("/categories", response_model=List[CategoryBase])
def get_all_categories(db: Session = Depends(get_db)):
    """
    Retrieves all categories with their associated variables.
    """
    return db.query(Category).options(joinedload(Category.variables)).all()
