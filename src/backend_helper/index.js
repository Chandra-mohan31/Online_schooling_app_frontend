import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_BACKEND;


export const handleLogin = async ({email,password,rememberme}) => {
    const requestBody = {
        "email": email,
        "password": password,
        "rememberMe": rememberme
      }
      try {
        const response = await fetch(`${baseURL}/api/Authentication/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
    
        const data = await response.json();
    
        if (response.ok) {
          
          const accessToken = data.accessToken;
          console.log(accessToken);
          localStorage.setItem("accessToken",accessToken);
          console.log(data.message); 
          return true; 
        } else {
          console.log(data.errorMessage); 
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
}


export const isLoggedIn = () => {
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken){
        //get user data using access Token and return
        return accessToken;
    }else{
        return false;
    }
}