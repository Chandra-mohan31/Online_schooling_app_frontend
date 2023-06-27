
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
          const role = data.role;
          localStorage.setItem("accessToken",accessToken);
          //TODO: storage the role logic 
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
      return {
        ...data?.currUser,
        role:data?.role
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export const getAllClasses = async () => {
  if(!isLoggedIn()){
    console.log("Error - user not logged in!");
    return;
  }
  try{
    const response = await fetch(`${baseURL}/api/TimeTables/getAllClasses`);
    const data = await response.json();

    if(response.ok){
      return data;
    }else{
      return {
        "message":"failed!"
      }
    }
  }catch(err){
    console.log(err);
    return {
      "message":err
    }
  }

}


export const getAllSessions = async () => {
  if(!isLoggedIn()){
    console.log("Error - user not logged in!");
    return;
  }
  try{
    const response = await fetch(`${baseURL}/api/TimeTables/getAllSessions`);
    const data = await response.json();

    if(response.ok){
      return data;
    }else{
      return {
        "message":"failed!"
      }
    }
  }catch(err){
    console.log(err);
    return {
      "message":err
    }
  }

}


export const getSessionDetails = async (day,session,className) => {
  if(!isLoggedIn()){
    console.log("Error - user not logged in!");
    return;
  }
  try{
    console.log(day);
    const response = await fetch(`${baseURL}/api/TimeTables/getSessionDetails?day=${day}&className=${className}&session=${session}`);
    const data = await response.json();
    console.log(data);
    if(response.ok){
      return data;
    }else{
      return {
        "message":"failed!"
      }
    }
  }catch(err){
    console.log(err);
    return {
      "message":err
    }
  }

};



