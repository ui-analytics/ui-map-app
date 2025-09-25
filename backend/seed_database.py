import os
import re
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
from sqlalchemy.dialects.sqlite import JSON

# --- Database Setup ---
DATABASE_URL = "sqlite:///regional_explorer.db"
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
    category_mock_file = 'src/app/shared/mocks/mock-map-category.ts'
    with open(category_mock_file, 'r') as f:
        category_content = f.read()

    db = SessionLocal()

    try:
        # --- Simple Parsing Logic (can be made more robust) ---

        # 1. Create the Project
        project_name = "Regional Explorer" # Hardcoded as per the description
        project = db.query(Project).filter(Project.name == project_name).first()
        if not project:
            project = Project(name=project_name)
            db.add(project)
            db.commit()
            db.refresh(project)
            print(f"Created project: {project.name}")

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


if __name__ == "__main__":
    # Create the database tables if they don't exist
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    # --- IMPORTANT ---
    # Updated to use the actual path to your mock data file.
    mock_file = 'src/app/shared/mocks/mock-map-variable.ts'

    if os.path.exists(mock_file):
        print("\nStarting data seeding...")
        seed_data_from_mocks(mock_file)
    else:
        print(f"\nError: Mock file not found at '{mock_file}'.")
        print("Please update the 'mock_file' variable in this script to the correct path.")
