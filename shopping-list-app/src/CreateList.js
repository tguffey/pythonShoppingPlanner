import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './CreateList.css';
import './App.css'; // Ensure this line is present

function CreateList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    axios
      .get("http://127.0.0.1:8000/get_recipes/")
      .then((response) => {
        console.log("API Response:", response.data); // ✅ Debugging log
        setRecipes(response.data.recipes || []); // ✅ Ensure it's always an array
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  };

  const deleteRecipe = (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    axios
      .delete(`http://127.0.0.1:8000/delete_recipe/${recipeId}`)
      .then(() => {
        alert("Recipe deleted successfully!");
        fetchRecipes(); // Refresh the recipe list
      })
      .catch((error) => console.error("Error deleting recipe:", error));
  };

  const handleRecipeSelection = (id) => {
    setSelectedRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const compileShoppingList = () => {
    if (selectedRecipes.length === 0) {
      alert("Please select at least one recipe.");
      return;
    }
  
    axios
      .post("http://127.0.0.1:8000/compile_shopping_list/", selectedRecipes) // ✅ Correct request format
      .then((response) => setShoppingList(response.data.shopping_list))
      .catch((error) => {
        console.error("Error compiling shopping list:", error);
        alert("Failed to generate shopping list.");
      });
  };

  return (
    <div className="container">
      <h2 className="title2">Select Recipes</h2> {/* Ensure this line is present */}
      {recipes.length === 0 ? (
        <p>No recipes available. Add some recipes first!</p>
      ) : (
        recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <input
              type="checkbox"
              onChange={() => handleRecipeSelection(recipe.id)}
            />
            <span className="recipe-name">{recipe.name}</span>
            <button
              onClick={() => deleteRecipe(recipe.id)}
              className="delete-button"
            >
              ❌ Delete
            </button>
          </div>
        ))
      )}
      <button className="create-list-button" onClick={compileShoppingList}>Generate Shopping List</button>
      {shoppingList && (
        <div>
          <h2>Shopping List</h2>
          <ul>
            {Object.entries(shoppingList).map(([ingredient, amount]) => (
              <li key={ingredient}>
                {ingredient}: {amount}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
}

export default CreateList;