import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { getAssignmentsOfClass } from '../../backend_helper/assignmentshelper';
import { getStudentClass } from '../../backend_helper/timetablehelper';
import { AuthContext } from '../../context/authContext';
import { useStateUpdate } from '../../utils/useStateUpdate';
import AssignmentInfoCard from './AssignmentInfoCard/AssignmentInfoCard';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';



function StudentAssignments() {
  const [classAssignments, setClassAssignments] = useState();
  const [assignmentsCache,setAssignmentsCache] = useState();
  const [className, setClassName] = useState();
  const {stUpVal,triggerStateUpdate} = useStateUpdate();
  const { loggedInUser } = useContext(AuthContext);
  const getAssignmentsForStudent = async () => {
    if (loggedInUser) {
      const studentClassResponse = await getStudentClass(loggedInUser?.id);
      let belongingClass = studentClassResponse.studentClass.className;
      setClassName(belongingClass);
      const response = await getAssignmentsOfClass(belongingClass,loggedInUser?.email);
      console.log(response);
      const tempAssignments = response?.classAssignments;
      tempAssignments.sort((a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime));
      // setClassAssignments(response?.classAssignments);
      setClassAssignments(tempAssignments);
      setAssignmentsCache(tempAssignments);

      
    }


  }
  

  const filterAssignments = (val,assignments) => {
    //based on,submitted assignments,unsubmitted assignments, assignments due,subjects
    const filteredAssignments = [];
    for(var assignment of assignments){
      if(assignment.status == val){
        filteredAssignments.push(assignment);
      }
    }
    return filteredAssignments;
  }


  const [typeOfAssignment,setTypeOfAssignment] = useState("all");

  const handleTypeOfAssignmentChange = (e) => {
    if(e.target.value == "all"){
      setClassAssignments(assignmentsCache);
    }else{
      setClassAssignments(filterAssignments(e.target.value,assignmentsCache));
    }

    setTypeOfAssignment(e.target.value);

    
  }


  useEffect(()=>{
    getAssignmentsForStudent();
  },[stUpVal])



  return (
    <div>
     <FormControl sx={{display:'grid',placeItems:'center',padding:'5px'}}>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="pending" checked={typeOfAssignment == "pending"}  onChange={handleTypeOfAssignmentChange} control={<Radio />} label="Pending Assignments" />
        <FormControlLabel value="submitted" checked={typeOfAssignment == "submitted"} onChange={handleTypeOfAssignmentChange} control={<Radio />} label="Assignments Submitted" />
        <FormControlLabel value="due" checked={typeOfAssignment == "due"} onChange={handleTypeOfAssignmentChange} control={<Radio />} label="Assignments failed to submit" />
        <FormControlLabel value="all" checked={typeOfAssignment == "all"} onChange={handleTypeOfAssignmentChange}  control={<Radio />} label="All Assignments" />

        
      </RadioGroup>
    </FormControl>
      
      {
        classAssignments ? (
          
        <div style={{
          display:'flex',

          justifyContent:'center',
          alignItems:'center',
          flexWrap:'wrap'
      }}>
            {classAssignments && 
            
            (
                classAssignments.map(assignmentInfo => (
                    <AssignmentInfoCard key={assignmentInfo?.id} assignmentInfo={assignmentInfo} stUpVal={stUpVal} invokeStateUpdate={triggerStateUpdate} />
                ))
            )
            }
            </div>
        ) : (
        <Typography variant='body1' textAlign='center'>No Assignments found!</Typography>
        )
      }
    </div>
  )
}

export default StudentAssignments