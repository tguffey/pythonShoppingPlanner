import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './ViewAllRecipes.css';

function ViewAllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

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

  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="container">
      <h2>All Recipes</h2>
      {recipes.length === 0 ? (
        <p>No recipes available. Add some recipes first!</p>
      ) : (
        <div className="recipes-list">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-item" onClick={() => handleRecipeClick(recipe.id)}>
              <h3 className="recipe-name">{recipe.name}</h3>
              <p className="recipe-description">{recipe.description}</p>
            </div>
          ))}
        </div>
      )}
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
}

export default ViewAllRecipes;