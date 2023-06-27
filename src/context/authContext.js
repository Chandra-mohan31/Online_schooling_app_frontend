
//try to change the helper isLoggedIn function and getUser details function in helper file to  global context to avoid repeated calling to functions 

import { useEffect, useState } from "react";
import { createContext } from "react";
import { getLoggedInUserDetails } from "../backend_helper";

export const AuthContext = createContext();


export const GlobalAuthStateProvider = ({children}) => {
    const [isSignedIn,setIsSignedIn] = useState(false);
    const [loggedInUser,setLoggedInUser] = useState();
    const getUserDataIfExists = async () => {
            const user = await getLoggedInUserDetails();
            if(user != null){
            setLoggedInUser(user);
            setIsSignedIn(true);
            }
    }

    const invokeStateUpdate = (value) => {
        setIsSignedIn(value);
    }
    useEffect(()=>{
        getUserDataIfExists();
    },[isSignedIn]);

    const globalStateContext = {
        
        loggedInUser,
        isSignedIn,
        invokeStateUpdate
    }

    return (
        <AuthContext.Provider value={globalStateContext}>
            {children}
        </AuthContext.Provider>
    )


}