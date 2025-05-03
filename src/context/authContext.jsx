import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { apiJson } from "../api/axios";
// import axios from "axios";

// context
const AuthContext = createContext();

// provider
const AuthProvider = ({ children }) => {
<<<<<<< Updated upstream
   
    // global state
    const [state, setState] = useState({
        user: {
            id: null,
            username: null,
            name: null,
            email: null,
            phone: null,
            roll: null,
        },
        token: "",
        // roll: "TEACHER",
        // username: "hoang",
        // id: 1,
    });
=======
  // global state
  const [state, setState] = useState({
    info: {
      id: null,
      username: null,
      name: null,
      email: null,
      phone: null,
      role: null,
    },
    token: "",
    // roll: "TEACHER",
    // username: "hoang",
    // id: 1,
  });
>>>>>>> Stashed changes

  // useEffect(() => {
  //     const loadUserData = async () => {
  //         try {
  //             let userData = await AsyncStorage.getItem("@auth");
  //             let loginData = JSON.parse(userData);
  //             setState((prevState) => ({
  //                 ...prevState,
  //                 // user: loginData.user,
  //                 token: loginData?.token,
  //             }));
  //         } catch (error) {
  //             console.error("Failed to load user data:", error);
  //         }
  //     };

  //     loadUserData();
  // }, []);

  // let token = state && state.token;

  // api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
