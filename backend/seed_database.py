import os
import re
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
from sqlalchemy.dialects.sqlite import JSON

# --- Database Setup ---
# Get the directory where this script is located (backend folder)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(SCRIPT_DIR, "regional_explorer.db")
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Association Table for Many-to-Many relationship between Category and MapVariable ---
category_variable_association = Table(
    'category_variable_association', Base.metadata,
    Column('category_id', Integer, ForeignKey('categories.id')),
    Column('variable_id', Integer, ForeignKey('map_variables.id'))
)

# --- SQLAlchemy Models ---
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    zoom = Column(Integer)
    center = Column(JSON)  # [x, y] coordinates
    basemap = Column(JSON)  # Complex basemap object
    maps = Column(JSON)    # Array of map configurations
    mapTools = Column(JSON)  # Array of tool strings
    categories = relationship("Category", back_populates="project")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="categories")
    variables = relationship("MapVariable", secondary=category_variable_association, back_populates="categories")

class MapVariable(Base):
    __tablename__ = "map_variables"
    id = Column(Integer, primary_key=True, index=True)
    variableId = Column(Integer, unique=True)
    name = Column(String)
    featureServiceUrl = Column(String, nullable=True)
    fieldName = Column(String)
    bivariateField = Column(String)
    moransField = Column(String)
    valueType = Column(String)
    yearsAvailable = Column(JSON)
    disabled = Column(Boolean, default=False)
    categories = relationship("Category", secondary=category_variable_association, back_populates="variables")


# --- Data Seeding Function ---
def seed_data_from_mocks(mock_file_path):
    """
    Parses a TypeScript mock file to extract project, category, and variable data
    and populates the SQLite database.
    """
    with open(mock_file_path, 'r') as f:
        content = f.read()

    # Also read categories from mock-map-category.ts
    category_mock_file = os.path.join(os.path.dirname(SCRIPT_DIR), 'src/app/shared/mocks/mock-map-category.ts')
    with open(category_mock_file, 'r') as f:
        category_content = f.read()

    # Also read project from mock-project.ts
    project_mock_file = os.path.join(os.path.dirname(SCRIPT_DIR), 'src/app/shared/mocks/mock-project.ts')
    with open(project_mock_file, 'r') as f:
        project_content = f.read()

    db = SessionLocal()

    try:
        # --- Simple Parsing Logic (can be made more robust) ---

        # 1. Create the Project
        # Parse project data from mock-project.ts
        import json
        import ast
        
        # Extract project name
        name_match = re.search(r"name:\s*'([^']*)'", project_content)
        project_name = name_match.group(1) if name_match else "Regional Explorer"
        
        # Extract zoom
        zoom_match = re.search(r"zoom:\s*(\d+)", project_content)
        zoom = int(zoom_match.group(1)) if zoom_match else 9
        
        # Extract center coordinates
        center_match = re.search(r"center:\s*\[([-\d\.]+),\s*([-\d\.]+)\]", project_content)
        center = [float(center_match.group(1)), float(center_match.group(2))] if center_match else [-80.7366, 35.3081]
        
        # Extract basemap (simplified - store as JSON)
        basemap_data = {
            "portalItem": {
                "id": "f35ef07c9ed24020aadd65c8a65d3754",
                "url": "https://www.arcgis.com"
            },
            "title": "Modern Antique Map",
            "thumbnailUrl": "https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/v1/arcgis/navigation/tile/{Z}/{X}/{Y}.png"
        }
        
        # Extract maps array
        maps_match = re.search(r"maps:\s*(\[.*?\])", project_content, re.DOTALL)
        maps_data = []
        if maps_match:
            # Parse maps array - simplified for the main structure
            maps_data = [
                {"mapId": 1, "opacity": 0.6, "visible": True, "variableControlled": True, "popupEnabled": True},
                {"mapId": 2, "opacity": 0.5, "visible": True, "popupEnabled": False},
                {"mapId": 3, "visible": False, "popupEnabled": False}
            ]
        
        # Extract mapTools
        map_tools = ["base"]  # Default from the mock data
        
        project = db.query(Project).filter(Project.name == project_name).first()
        if not project:
            project = Project(
                name=project_name,
                zoom=zoom,
                center=center,
                basemap=basemap_data,
                maps=maps_data,
                mapTools=map_tools
            )
            db.add(project)
            db.commit()
            db.refresh(project)
            print(f"Created project: {project.name}")
        else:
            # Update existing project with new fields
            project.zoom = zoom
            project.center = center
            project.basemap = basemap_data
            project.maps = maps_data
            project.mapTools = map_tools
            db.commit()
            print(f"Updated project: {project.name}")

        # 2. Extract and Create Variables
        simple_variable_regex = re.compile(r"{\s*variableId:\s*(\d+),\s*name:\s*'([^']*)',.*?fieldName:\s*'([^']*)',.*?bivariateField:\s*'([^']*)',.*?moransField:\s*'([^']*)',.*?valueType:\s*'([^']*)',.*?yearsAvailable:\s*(\[.*?\]),.*?disabled:\s*(true|false).*?}", re.DOTALL)

        map_variables_str = content.split('export const MAP_VARIABLE: MapVariable[] = [')[1].split('];')[0]

        variables_in_db = {}
        for match in simple_variable_regex.finditer(map_variables_str):
            variable_id = int(match.group(1))

            existing_variable = db.query(MapVariable).filter(MapVariable.variableId == variable_id).first()
            if not existing_variable:
                years_str = match.group(7)
                years = [int(y) for y in re.findall(r'\d+', years_str)]

                new_var = MapVariable(
                    variableId=variable_id,
                    name=match.group(2),
                    fieldName=match.group(3),
                    bivariateField=match.group(4),
                    moransField=match.group(5),
                    valueType=match.group(6),
                    yearsAvailable=years,
                    disabled=match.group(8).lower() == 'true'
                )
                db.add(new_var)
                db.commit()
                db.refresh(new_var)
                print(f"Added variable: {new_var.name}")
                variables_in_db[variable_id] = new_var
            else:
                variables_in_db[variable_id] = existing_variable

        # 3. Extract and Create Categories and associate variables
        categories_str = category_content.split('export const MAP_CATEGORY: MapCategory[] = [')[1].split('];')[0]
        category_regex = re.compile(r"{\s*categoryId:\s*(\d+),\s*name:\s*'([^']*)',\s*mapVariables:\s*\[(.*?)\]\s*}", re.DOTALL)

        for cat_match in category_regex.finditer(categories_str):
            category_id = int(cat_match.group(1))
            category_name = cat_match.group(2)
            variable_ids_str = cat_match.group(3)
            variable_ids = [int(vid) for vid in re.findall(r'\d+', variable_ids_str)]

            category = db.query(Category).filter(Category.name == category_name, Category.project_id == project.id).first()
            if not category:
                category = Category(name=category_name, project=project)
                db.add(category)
                db.commit()
                db.refresh(category)
                print(f"Added category: {category.name}")

            # Associate variables
            for vid in variable_ids:
                if vid in variables_in_db:
                    map_variable = variables_in_db[vid]
                    if map_variable not in category.variables:
                        category.variables.append(map_variable)

            db.commit()

        print("\nDatabase seeding complete!")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()


def update_database():
    """
    Update database with new data without dropping existing tables.
    Use this to add new variables, categories, or update existing data.
    """
    db = SessionLocal()
    
    try:
        print("Starting database update...")
        
        # Example: Add new variables
        new_variables = [
            # Add new variables here following this format:
            # {
            #     "variableId": 999,
            #     "name": "New Variable Name",
            #     "featureServiceUrl": "https://example.com/service",
            #     "fieldName": "new_field",
            #     "bivariateField": "new_bivariate",
            #     "moransField": "new_morans",
            #     "valueType": "number",
            #     "yearsAvailable": [2023, 2024],
            #     "disabled": False
            # }
        ]
        
        # Process new variables
        for var_data in new_variables:
            existing = db.query(MapVariable).filter(
                MapVariable.variableId == var_data["variableId"]
            ).first()
            
            if not existing:
                new_var = MapVariable(**var_data)
                db.add(new_var)
                print(f"Added new variable: {var_data['name']}")
            else:
                print(f"Variable {var_data['variableId']} already exists, skipping...")
        
        # Example: Update existing variables
        variable_updates = [
            # Add variable updates here following this format:
            # {
            #     "variableId": 1,  # ID of variable to update
            #     "updates": {
            #         "name": "Updated Variable Name",
            #         "yearsAvailable": [2020, 2021, 2022, 2023, 2024]
            #     }
            # }
        ]
        
        # Process variable updates
        for update_data in variable_updates:
            variable = db.query(MapVariable).filter(
                MapVariable.variableId == update_data["variableId"]
            ).first()
            
            if variable:
                for key, value in update_data["updates"].items():
                    setattr(variable, key, value)
                print(f"Updated variable: {variable.name}")
            else:
                print(f"Variable ID {update_data['variableId']} not found")
        
        # Example: Add new categories
        new_categories = [
            # Add new categories here following this format:
            # {
            #     "name": "New Category Name",
            #     "project_id": 1,  # Usually 1 for the main project
            #     "variable_ids": [1, 2, 3]  # IDs of variables to associate
            # }
        ]
        
        # Process new categories
        for cat_data in new_categories:
            # Check if category already exists
            existing_cat = db.query(Category).filter(
                Category.name == cat_data["name"],
                Category.project_id == cat_data["project_id"]
            ).first()
            
            if not existing_cat:
                new_category = Category(
                    name=cat_data["name"],
                    project_id=cat_data["project_id"]
                )
                db.add(new_category)
                db.flush()  # Get the ID
                
                # Associate with variables if provided
                if cat_data.get("variable_ids"):
                    variables = db.query(MapVariable).filter(
                        MapVariable.variableId.in_(cat_data["variable_ids"])
                    ).all()
                    new_category.variables.extend(variables)
                
                print(f"Added new category: {cat_data['name']}")
            else:
                print(f"Category '{cat_data['name']}' already exists, skipping...")
        
        db.commit()
        print("Database update complete!")
        
    except Exception as e:
        print(f"Error during update: {e}")
        db.rollback()
    finally:
        db.close()


def list_database_contents():
    """
    List all current data in the database for inspection.
    """
    db = SessionLocal()
    
    try:
        print("=== DATABASE CONTENTS ===\n")
        
        # List projects
        projects = db.query(Project).all()
        print(f"PROJECTS ({len(projects)} total):")
        for project in projects:
            print(f"  ID: {project.id}, Name: {project.name}")
        
        # List categories
        categories = db.query(Category).all()
        print(f"\nCATEGORIES ({len(categories)} total):")
        for category in categories:
            print(f"  ID: {category.id}, Name: {category.name}, Project: {category.project_id}")
        
        # List variables
        variables = db.query(MapVariable).all()
        print(f"\nVARIABLES ({len(variables)} total):")
        for variable in variables:
            print(f"  ID: {variable.id}, VarID: {variable.variableId}, Name: {variable.name}")
            
    except Exception as e:
        print(f"Error listing contents: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    
    # Create the database tables if they don't exist
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    # Check for command line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "update":
            print("\n=== UPDATING DATABASE ===")
            update_database()
        elif command == "list":
            print("\n=== LISTING DATABASE CONTENTS ===")
            list_database_contents()
        elif command == "seed":
            print("\n=== FULL DATABASE SEEDING ===")
            # Full seeding from mock files
            mock_file = os.path.join(os.path.dirname(SCRIPT_DIR), 'src/app/shared/mocks/mock-map-variable.ts')
            if os.path.exists(mock_file):
                print("Starting data seeding...")
                seed_data_from_mocks(mock_file)
            else:
                print(f"Error: Mock file not found at '{mock_file}'.")
        else:
            print(f"Unknown command: {command}")
            print("Available commands:")
            print("  seed   - Full database seeding from mock files (default)")
            print("  update - Update database with new data")
            print("  list   - List all current database contents")
    else:
        # Default behavior - full seeding
        print("\n=== FULL DATABASE SEEDING ===")
        mock_file = os.path.join(os.path.dirname(SCRIPT_DIR), 'src/app/shared/mocks/mock-map-variable.ts')
        if os.path.exists(mock_file):
            print("Starting data seeding...")
            seed_data_from_mocks(mock_file)
        else:
            print(f"Error: Mock file not found at '{mock_file}'.")
            print("Please ensure you're running this script from the backend directory.")
