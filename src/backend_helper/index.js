
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
        console.log(data);
        if (response.ok) {
          
          const accessToken = data.accessToken;
          localStorage.setItem("accessToken",accessToken);
          return {"message":data.message};
        } else {
          console.log(data.title); 
          return {"message":data.title};
        }
      } catch (error) {
        console.log("error,",error);
        return {
          "message":error
        }
      }
}


export const isLoggedIn = () => {
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken){
        return true;
    }else{
      return false;
    }
}

export const logoutUser = () => {
    if(localStorage.getItem("accessToken")){
        localStorage.removeItem("accessToken");
        return "logged out successfully!";
    }else{
      return "no accessToken found";
    }
}


export const getLoggedInUserDetails = async () => {
  if (!isLoggedIn()) {
    console.log("user not logged in!");
    return null;
  } else {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/api/Authentication/user-details?accessToken=${accessToken}`);
      const data = await response.json();
      return data?.currUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
// found difficulty returning userData straight from here,its goes there as a promise,then i resolve the promise there uing another function and set the userData to a state and manage it,
//TODO : simplify this logic,try to use the global context

export const testGetUserData = async () => {
  const currUser = await getLoggedInUserDetails();
  return currUser;
  
}