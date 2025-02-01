import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d35400;
  }
`;

const BackButton = styled(Link)`
  display: block;
  margin-top: 20px;
  text-decoration: none;
  color: #3498db;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`;

function CreateList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get_recipes/")
      .then((response) => setRecipes(response.data.recipes))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  useEffect(() => {
    fetchRecipes();
}, []);

const fetchRecipes = () => {
    axios.get("http://127.0.0.1:8000/get_recipes/")
        .then(response => setRecipes(response.data.recipes))
        .catch(error => console.error("Error fetching recipes:", error));
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
      .post("http://127.0.0.1:8000/compile_shopping_list/", selectedRecipes)
      .then((response) => setShoppingList(response.data.shopping_list))
      .catch((error) => {
        console.error("Error compiling shopping list:", error);
        alert("Failed to generate shopping list.");
      });
  };

  return (
    <Container>
      <h2>Select Recipes</h2>
      {recipes.length === 0 ? (
        <p>No recipes available. Add some recipes first!</p>
      ) : (
        recipes.map((recipe) => (
          <div
            key={recipe[0]}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="checkbox"
              onChange={() => handleRecipeSelection(recipe[0])}
            />
            <span style={{ marginLeft: "10px", flexGrow: 1 }}>{recipe[1]}</span>
            <button
              onClick={() => deleteRecipe(recipe[0])}
              style={{
                marginLeft: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              ❌ Delete
            </button>
          </div>
        ))
      )}
      <Button onClick={compileShoppingList}>Generate Shopping List</Button>
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
      <BackButton to="/">Back to Home</BackButton>
    </Container>
  );
}

export default CreateList;
