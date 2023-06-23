
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
    console.log(accessToken);
    if(accessToken){
        return accessToken;
    }else{
      return false;
    }
}