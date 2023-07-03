import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext';
import StudyMaterialsStudent from './StudyMaterialsStudent';
import StudyMaterialsTeacher from './StudyMaterialsTeacher';
import { Navigate } from 'react-router-dom';
import { useModal } from '../../utils/useModal';

function StudyMaterialMain() {
  
    const {loggedInUser} = useContext(AuthContext);
    
    return (
      <div>
  
      {loggedInUser ? 
        (
          loggedInUser.role == 'Student' ? <StudyMaterialsStudent /> : (
            loggedInUser.role == 'Teacher' ? <StudyMaterialsTeacher /> : (
              <Navigate to="/dashboard" />
            )
          )
        )
      : null}
  
      </div>
    )
}

export default StudyMaterialMain