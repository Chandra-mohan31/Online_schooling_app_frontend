import React, { useContext } from 'react'
import StudentAssignments from './StudentAssignments';
import TeacherAssignments from './TeacherAssignments';
import { AuthContext } from '../../context/authContext';
import { Navigate } from 'react-router-dom';


function AssignmentComponent() {
  const {loggedInUser} = useContext(AuthContext);
    
  return (
    <div>

    {loggedInUser ? 
      (
        loggedInUser.role == 'Student' ? <StudentAssignments /> : (
          loggedInUser.role == 'Teacher' ? <TeacherAssignments /> : (
            <Navigate to="/dashboard" />
          )
        )
      )
    : null}

    </div>
  )
}

export default AssignmentComponent