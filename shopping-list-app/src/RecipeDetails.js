import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import './App.css'; // Ensure this line is present
import './RecipeDetails.css';

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  const fetchRecipeDetails = useCallback(() => {
    axios
      .get(`http://127.0.0.1:8000/get_recipe/${id}/`)
      .then((response) => {
        console.log("API Response:", response.data); // ✅ Debugging log
        setRecipe(response.data.recipe);
      })
      .catch((error) => console.error("Error fetching recipe details:", error));
  }, [id]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="title2">{recipe.name}</h2>
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.name} - {ingredient.amount} {ingredient.unit}
          </li>
        ))}
      </ul>
      <Link to="/view-all-recipes" className="back-button">Back to All Recipes</Link>
    </div>
  );
}

export default RecipeDetails;