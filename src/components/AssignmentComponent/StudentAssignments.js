import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { getStudentClass } from '../../backend_helper/timetablehelper';
import { getAssignmentsOfClass } from '../../backend_helper/assignmentshelper';
import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material';
import LoadingComponent from '../LoadingComponent';
import { useStateUpdate } from '../../utils/useStateUpdate';
import AssignmentInfoCard from './AssignmentInfoCard/AssignmentInfoCard';


function StudentAssignments() {
  const [classAssignments, setClassAssignments] = useState();
  const [className, setClassName] = useState();
  const {stUpVal,triggerStateUpdate} = useStateUpdate();
  const { loggedInUser } = useContext(AuthContext);
  const getAssignmentsForStudent = async () => {
    if (loggedInUser) {
      const studentClassResponse = await getStudentClass(loggedInUser?.id);
      let belongingClass = studentClassResponse.studentClass.className;
      setClassName(belongingClass);
      const response = await getAssignmentsOfClass(belongingClass);
      console.log(response);
      const tempAssignments = response?.classAssignments;
      tempAssignments.sort((a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime));
      // setClassAssignments(response?.classAssignments);
      setClassAssignments(tempAssignments);

      
    }


  }

  useEffect(()=>{
    getAssignmentsForStudent();
  },[stUpVal])
  return (
    <div>

      
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