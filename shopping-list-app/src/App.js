import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import styled from "styled-components";
import AddRecipe from "./AddRecipe";
import CreateList from "./CreateList";

const Container = styled.div`
    text-align: center;
    padding: 20px;
    font-family: Arial, sans-serif;
`;

const Button = styled(Link)`
    display: block;
    width: 200px;
    margin: 20px auto;
    padding: 15px;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    font-size: 18px;
    border-radius: 10px;
    text-align: center;
    transition: 0.3s;

    &:hover {
        background-color: #2980b9;
    }
`;

const Title = styled.h1`
    margin-bottom: 30px;
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
                                <Title>Shopping List App</Title>
                                <Button to="/add-recipe">Add Recipes</Button>
                                <Button to="/create-list">Create Shopping List</Button>
                            </>
                        } 
                    />
                    <Route path="/add-recipe" element={<AddRecipe />} />
                    <Route path="/create-list" element={<CreateList />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
