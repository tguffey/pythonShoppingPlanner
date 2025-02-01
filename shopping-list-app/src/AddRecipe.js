import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    text-align: center;
    padding: 20px;
    background-color:rgb(246, 246, 207); /* Light beige background */
    min-height: 100vh;
`;

const Input = styled.input`
    margin: 5px;
    padding: 10px;
    width: 200px;
    font-size: 16px;
`;

const Select = styled.select`
    margin: 5px;
    padding: 10px;
    font-size: 16px;
`;

const Button = styled.button`
    margin: 10px;
    padding: 10px;
    font-size: 16px;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #219150;
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

function AddRecipe() {
    const [recipeName, setRecipeName] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", amount: "", unit: "grams" }]);

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value;
        setIngredients(updatedIngredients);
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, { name: "", amount: "", unit: "grams" }]);
    };

    const submitRecipe = () => {
        axios.post("http://127.0.0.1:8000/add_recipe/", { name: recipeName, ingredients })
            .then(() => {
                setRecipeName("");
                setIngredients([{ name: "", amount: "", unit: "grams" }]);
            })
            .catch(error => console.error("Error adding recipe:", error));
    };

    return (
        <Container>
            <h2>Add a New Recipe</h2>
            <Input
                type="text"
                placeholder="Recipe Name"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
            />
            {ingredients.map((ingredient, index) => (
                <div key={index}>
                    <Input
                        type="text"
                        placeholder="Ingredient Name"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                    />
                    <Select
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                    >
                        <option value="">(No unit)</option>  {/* Blank option */}
                        <option value="grams">grams</option>
                        <option value="ounces">ounces</option>
                        <option value="pounds">pounds</option>
                        <option value="cups">cups</option>
                        <option value="tablespoons">tablespoons</option>
                        <option value="teaspoons">teaspoons</option>
                        <option value="liters">liters</option>
                    </Select>
                </div>
            ))}
            <Button onClick={addIngredientField}>Add Ingredient</Button>
            <Button onClick={submitRecipe}>Submit Recipe</Button>
            <BackButton to="/">Back to Home</BackButton>
        </Container>
    );
}

export default AddRecipe;
