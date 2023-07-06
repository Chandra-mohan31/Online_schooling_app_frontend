const baseURL = process.env.REACT_APP_BACKEND;


export const postAssignment = async (requestBody) => {
    try{
        const response = await fetch(`${baseURL}/api/AssignmentModels`, {
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

  export const getAssignmentsTeacher = async (teacherId) =>{
    try{
        const response = await fetch(`${baseURL}/postedAssignments/${teacherId}`);
        const data = response.json();
        console.log(data);
        if(response.ok){
            return data;
        }
    }catch(err){
        console.log(err);
    }
  };


  export const deleteAssignmentPosted = async (assignmentCode) => {
    try {
      const response = await fetch(`${baseURL}/api/AssignmentModels/assignmentPosted/${assignmentCode}`,{
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


  export const updateDueDate = async (assignmentCode, updatedDueDateTime) => {

    try {
      const response = await fetch(`${baseURL}/api/AssignmentModels/changeDueDate/${assignmentCode}?newDueDate=${updatedDueDateTime}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data);
      }
    } catch (error) {
      console.log("error,",error);
      
    }
}



export const getAssignmentsOfClass = async (className) =>{
    try{
        const response = await fetch(`${baseURL}/classAssignments/${className}`);
        const data = await response.json();
        console.log(data);
        if(response.ok){
            return data;
        }
    }catch(err){
        console.log(err);
    }
  };

export const getAssignmentSubmissionOfStudent = async (username,assignmentId) => {
  try{
    const response = await fetch(`${baseURL}/api/AssignmentSubmissionsModels/getStudentSubmission/${assignmentId}?username=${username}`);
    const data = await response.json();
    console.log(data);
    if(response.ok){
      if(data.studentSubmission){
        return data;
      }else{
        return null;
      }
    }
  }catch(error){
    console.log(error);
    return null;
  }
}
  

export const deleteStudentSubmission = async (submissionId) => {
  try {
    const response = await fetch(`${baseURL}/api/AssignmentSubmissionsModels/${submissionId}`,{
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


export const postAssignmentSubmission = async (requestBody) => {
  try{
      const response = await fetch(`${baseURL}/api/AssignmentSubmissionsModels`, {
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