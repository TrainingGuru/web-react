import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isLoggedInString = sessionStorage.getItem("LoggedIn");
    const isLoggedIn = (isLoggedInString === "true")
    return isLoggedIn ? children : <Navigate to="/Login"/>;
};

export default PrivateRoute;