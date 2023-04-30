import React from "react";
import { Navigate } from "react-router-dom";

const LogoutRoute = ({ children }) => {
    sessionStorage.setItem("LoggedIn", "false");
    return <Navigate to="/Login"/>;
};

export default LogoutRoute;