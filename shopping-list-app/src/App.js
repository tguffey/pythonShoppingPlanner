import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import styled from "styled-components";
import AddRecipe from "./AddRecipe";
import CreateList from "./CreateList";
import ViewAllRecipes from "./ViewAllRecipes";
import RecipeDetails from "./RecipeDetails";
import './App.css'; // Ensure this line is present

const Container = styled.div`
    text-align: center;
    padding: 20px;
    font-family: Arial, sans-serif;
`;

function App() {
    return (
        <Router>
            <Container>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <>
                                {/* <h1 className="title">Shopping List App</h1> */}
                                {/* <h1 className="title1">Shopping List App</h1> */}
                                <h1 className="title2">Shopping List App</h1>
                                {/* <h1 className="title3">Shopping List App</h1> */}
                                <Link to="/add-recipe" className="button">Add Recipes</Link>
                                <Link to="/create-list" className="button">Create Shopping List</Link>
                                <Link to="/view-all-recipes" className="button">View All Recipes</Link>
                            </>
                        } 
                    />
                    <Route path="/add-recipe" element={<AddRecipe />} />
                    <Route path="/create-list" element={<CreateList />} />
                    <Route path="/view-all-recipes" element={<ViewAllRecipes />} />
                    <Route path="/recipe/:id" element={<RecipeDetails />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;