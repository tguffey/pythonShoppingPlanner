import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Database Setup
conn = sqlite3.connect("recipes.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
)""")
cursor.execute("""CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER,
    name TEXT,
    amount FLOAT,
    unit TEXT DEFAULT '',  -- Allows empty unit
    FOREIGN KEY(recipe_id) REFERENCES recipes(id)
)""")
conn.commit()

# Pydantic Models
class Ingredient(BaseModel):
    name: str
    amount: float
    unit: str = ""  # Default to empty string

class Recipe(BaseModel):
    name: str
    ingredients: List[Ingredient]

# Store a new recipe in the database
@app.post("/add_recipe/")
def add_recipe(recipe: Recipe):
    cursor.execute("INSERT INTO recipes (name) VALUES (?)", (recipe.name,))
    recipe_id = cursor.lastrowid

    for ingredient in recipe.ingredients:
        cursor.execute("INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES (?, ?, ?, ?)", 
                       (recipe_id, ingredient.name, ingredient.amount, ingredient.unit or ""))

    conn.commit()
    return {"message": "Recipe added successfully"}

# Get all stored recipes
@app.get("/get_recipes/")
def get_recipes():
    cursor.execute("SELECT * FROM recipes")
    recipes = cursor.fetchall()
    return {"recipes": [[row[0], row[1]] for row in recipes]}  # Returning ID and Name

# Delete a recipe from the database
@app.delete("/delete_recipe/{recipe_id}")
def delete_recipe(recipe_id: int):
    cursor.execute("DELETE FROM ingredients WHERE recipe_id = ?", (recipe_id,))
    cursor.execute("DELETE FROM recipes WHERE id = ?", (recipe_id,))
    conn.commit()
    return {"message": f"Recipe {recipe_id} deleted successfully"}

# Compile the shopping list
@app.post("/compile_shopping_list/")
def compile_shopping_list(selected_recipe_ids: List[int]):
    shopping_list = {}

    for recipe_id in selected_recipe_ids:
        cursor.execute("SELECT name, amount, unit FROM ingredients WHERE recipe_id = ?", (recipe_id,))
        ingredients = cursor.fetchall()

        for name, amount, unit in ingredients:
            key = f"{name} ({unit})" if unit else name  # Remove unit if blank
            shopping_list[key] = shopping_list.get(key, 0) + amount

    return {"shopping_list": shopping_list}
