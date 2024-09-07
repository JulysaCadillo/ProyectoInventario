import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Inventory from "./Pages/Inventory/Inventory";
import Category from "./Pages/Category/Category";
import Orders from "./Pages/Orders/Orders";
import Supplier from "./Pages/Supplier/Supplier";
import Users from "./Pages/Users/Users";
import Login from "./Pages/Login/Login";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/category" element={<Category />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/users" element={<Users />} />
        </Routes>
    );
}

export default App;
