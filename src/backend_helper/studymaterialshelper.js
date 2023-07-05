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


  export const getPostedMaterialsTeacher = async (teacherId) =>{
    try{
        const response = await fetch(`${baseURL}/api/ClassMaterials/postedMaterialsByTeacher/${teacherId}`);
        const data = response.json();
        
        if(response.ok){
            return data;
        }
    }catch(err){
        console.log(err);
    }
  };





  export const deleteMaterial = async (materialId) => {
    try {
      const response = await fetch(`${baseURL}/api/ClassMaterials/${materialId}`,{
        method:'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if(response.ok){
        console.log(data);
      }
    }catch(err){
      console.log(err);
    }
  }




  export const getMaterialsOfClass = async (className) => {
    try{
      const response = await fetch(`${baseURL}/api/ClassMaterials/classStudyMaterials/${className}`);
      const data = await response.json();
      
      if(response.ok){
          return data;
      }
  }catch(err){
      console.log(err);
  }
}



export const getMaterialInfo = async (id) => {
  try{
    const response = await fetch(`${baseURL}/api/ClassMaterials/${id}`);
    const data = await response.json();
    
    if(response.ok){
        return data;
    }
}catch(err){
    console.log(err);
}
}