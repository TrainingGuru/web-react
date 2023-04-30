import React from "react";
import { Navigate } from "react-router-dom";

const LoginRoute = ({ children }) => {
    const isLoggedInString = sessionStorage.getItem("LoggedIn");
    const isLoggedIn = (isLoggedInString === "true")
    return isLoggedIn ? <Navigate to="/"/> : children;
};

export default LoginRoute;