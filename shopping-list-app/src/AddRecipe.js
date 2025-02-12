import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './App.css';
import './AddRecipe.css';

function AddRecipe() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "", unit: "" }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "" }]);
  };

  const handleIngredientChange = (index, event) => {
    const newIngredients = ingredients.slice();
    newIngredients[index][event.target.name] = event.target.value;
    setIngredients(newIngredients);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const filteredIngredients = ingredients.filter(ingredient => ingredient.name.trim() !== "");
    const recipe = { name, description: description || null, ingredients: filteredIngredients };  // Ensure description is optional
    axios.post("http://127.0.0.1:8000/add_recipe/", recipe)
      .then(response => {
        alert("Recipe added successfully!");
        setName("");
        setDescription("");
        setIngredients([{ name: "", amount: "", unit: "" }]);
      })
      .catch(error => {
        console.error("There was an error adding the recipe!", error);
      });
  };

  return (
    <div className="container">
      <h2 className="title2">Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipe Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        {ingredients.map((ingredient, index) => (
  <div key={index} className="ingredient-row">
    <div>
      <label>Ingredient Name:</label>
      <input type="text" name="name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, e)} />
    </div>
    <div>
      <label>Amount:</label>
      <input type="number" name="amount" value={ingredient.amount} onChange={(e) => handleIngredientChange(index, e)} />
    </div>
    <div>
      <label>Unit:</label>
      <select name="unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, e)}>
        <option value="">No Unit</option>
        <option value="grams">grams</option>
        <option value="ounces">ounces</option>
        <option value="pounds">pounds</option>
        <option value="cups">cups</option>
        <option value="tablespoons">tablespoons</option>
        <option value="teaspoons">teaspoons</option>
        <option value="liters">liters</option>
      </select>
    </div>
    {index === ingredients.length - 1 && (
      <div className="add-ingredient-button">
        <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
      </div>
    )}
  </div>
))}
        <div>
          <label>Description (optional):</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
        <button type="submit">Add Recipe</button>
      </form>
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
}

export default AddRecipe;