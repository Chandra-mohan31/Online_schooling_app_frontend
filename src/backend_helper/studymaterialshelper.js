const baseURL = process.env.REACT_APP_BACKEND;


export const postStudyMaterial = async (requestBody) => {
    try{
        const response = await fetch(`${baseURL}/api/ClassMaterials`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
        const data = await response.json();
        console.log(data);
        
    }catch(err){
        console.log(err);
        alert("failed!");

    }
  }