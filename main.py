from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from typing import List, Optional

# FastAPI app setup
app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust as needed)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup using SQLAlchemy
DATABASE_URL = "sqlite:///recipes.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define database models
class RecipeDB(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)  # Add this line if you want to include a description
    ingredients = relationship("IngredientDB", back_populates="recipe", cascade="all, delete-orphan")

class IngredientDB(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    unit = Column(String, default="")
    recipe = relationship("RecipeDB", back_populates="ingredients")

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models for API request validation
class Ingredient(BaseModel):
    name: str
    amount: float
    unit: str = ""

class Recipe(BaseModel):
    name: str
    description: Optional[str] = None  # Make description optional
    ingredients: List[Ingredient]

# Store a new recipe
@app.post("/add_recipe/")
def add_recipe(recipe: Recipe, db: Session = Depends(get_db)):
    new_recipe = RecipeDB(name=recipe.name, description=recipe.description)  # Update this line if you want to include a description
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)

    for ingredient in recipe.ingredients:
        new_ingredient = IngredientDB(
            recipe_id=new_recipe.id,
            name=ingredient.name,
            amount=ingredient.amount,
            unit=ingredient.unit or "",
        )
        db.add(new_ingredient)

    db.commit()
    return {"message": "Recipe added successfully", "recipe_id": new_recipe.id}

# Get all stored recipes
@app.get("/get_recipes/")
def get_recipes(db: Session = Depends(get_db)):
    recipes = db.query(RecipeDB).all()
    return {"recipes": [{"id": recipe.id, "name": recipe.name} for recipe in recipes]}

# Delete a recipe
@app.delete("/delete_recipe/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    db.delete(recipe)
    db.commit()
    return {"message": f"Recipe {recipe_id} deleted successfully"}

# Compile the shopping list
@app.post("/compile_shopping_list/")
def compile_shopping_list(selected_recipe_ids: List[int], db: Session = Depends(get_db)):
    shopping_list = {}

    ingredients = db.query(IngredientDB).filter(IngredientDB.recipe_id.in_(selected_recipe_ids)).all()
    for ingredient in ingredients:
        key = f"{ingredient.name} ({ingredient.unit})" if ingredient.unit else ingredient.name
        shopping_list[key] = shopping_list.get(key, 0) + ingredient.amount

    return {"shopping_list": shopping_list}

# Get details of a single recipe
@app.get("/get_recipe/{recipe_id}/")
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    ingredients = db.query(IngredientDB).filter(IngredientDB.recipe_id == recipe_id).all()
    return {
        "recipe": {
            "id": recipe.id,
            "name": recipe.name,
            "description": recipe.description,  # Ensure this line is present
            "ingredients": [{"name": ingredient.name, "amount": ingredient.amount, "unit": ingredient.unit} for ingredient in ingredients]
        }
    }