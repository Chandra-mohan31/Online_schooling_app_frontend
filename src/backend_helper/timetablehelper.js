import { isLoggedIn } from ".";
const baseURL = process.env.REACT_APP_BACKEND;
export const getTimeTableHelper = async () => {
    if(!isLoggedIn()){
      console.log("Error - user not logged in!");
      return;
    }
    try{
      const response = await fetch(`${baseURL}/api/TimeTables`);
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


  export const getAvailableTeachersForTheSession = async (session,day) =>{
    try{
        const response = await fetch(`${baseURL}/api/TimeTables/get_available_teachers?session=${session}&day=${day}`);
        const data = response.json();
        
        if(response.ok){
            return data;
        }
    }catch(err){
        console.log(err);
    }
  };


  export const postToTimeTable = async (requestBody) => {
    try{
        const response = await fetch(`${baseURL}/api/TimeTables`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
        const data = await response.json();
        
        
    }catch(err){
        console.log(err);
        alert("failed!");

    }
  }


  export const deleteTimeTable = async (id) => {
    try{
      const response = await fetch(`${baseURL}/api/TimeTables/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      const data = await response.json();
      
      console.log(data);
  }catch(err){
      console.log(err);
      

  }
  }


  
  export const clearTimeTable = async () => {
    try{
      const response = await fetch(`${baseURL}/api/TimeTables/deleteAll`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      const data = response.json();
      
      
  }catch(err){
      console.log(err);
      alert("failed!");

  }
  }


  export const getStudentClass = async (userId) =>{
    try{
        const response = await fetch(`${baseURL}/api/StudentClasses/getStudentBelongingClass?userId=${userId}`);
        const data = await response.json();
        console.log(data);
        if(response.ok){
            return data;
        }
    }catch(err){
        console.log(err);
    }
  };
