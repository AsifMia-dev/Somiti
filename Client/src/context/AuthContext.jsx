import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const deocdeJwt = (token) => {
    return jwtDecode(token);
}

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 


    useEffect(() => {
        const storedUser = sessionStorage.getItem("manager");
        if(storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    },[]);

    const login = (token) => {
        const userData = deocdeJwt(token);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("manager", JSON.stringify(userData));
        setAccessToken(token);
        setUser(userData);
        
    }
    
    const logout = () =>{
        setUser(null);
        sessionStorage.removeItem("authUser");
    }
    if(loading){
        return <div>Loading...</div>;
    }
    return (
        <AuthContext.Provider value ={{ user,accessToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}