
//try to change the helper isLoggedIn function and getUser details function in helper file to  global context to avoid repeated calling to functions 

import { useEffect, useState } from "react";
import { createContext } from "react";
import { getLoggedInUserDetails } from "../backend_helper";

export const AuthContext = createContext();


export const GlobalAuthStateProvider = ({children}) => {
    const [loggedInUser,setLoggedInUser] = useState();
    const getUserDataIfExists = async () => {
            const user = await getLoggedInUserDetails();
            setLoggedInUser(user);
    }
    useEffect(()=>{
        getUserDataIfExists();
    },[]);

    const globalStateContext = {
        
        loggedInUser
    }

    return (
        <AuthContext.Provider value={globalStateContext}>
            {children}
        </AuthContext.Provider>
    )


}