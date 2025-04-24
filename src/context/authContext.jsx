import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// context
const AuthContext = createContext();

// provider
const AuthProvider = ({ children }) => {
   
    // global state
    const [state, setState] = useState({
        user: null,
        token: null,
        roll: "Teacher",
    });

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };