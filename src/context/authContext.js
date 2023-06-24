
//try to change the helper isLoggedIn function and getUser details function in helper file to  global context to avoid repeated calling to functions 

// import { useEffect, useState } from "react";
// import { createContext } from "react";

// export const AuthContext = createContext();


// export const GlobalAuthStateProvider = ({children}) => {
//     const [isUserLoggedIn,setIsUserLoggedIn] = useState(false);
//     useEffect(()=>{
//         if(localStorage.getItem("accessToken")){
//             setIsUserLoggedIn(true);
//         }
//     },[isLoggedIn]);

//     const globalStateContext = {
//         isUserLoggedIn,
//         setIsUserLoggedIn
//     }

//     return (
//         <AuthContext.Provider value={globalStateContext}>
//             {children}
//         </AuthContext.Provider>
//     )


// }