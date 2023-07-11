import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import AdminDashBoard from './AdminDashBoard';
import StudentDashBoard from './StudentDashBoard';
import TeacherDashBoard from './TeacherDashBoard';

function DashBoardMain() {

  const {loggedInUser} = useContext(AuthContext);
  return (
    <div>

    {loggedInUser ? 
      (
        loggedInUser.role == 'Admin' ? <AdminDashBoard /> : (
          loggedInUser.role == 'Student' ? <StudentDashBoard /> : (
            loggedInUser.role == 'Teacher' ? <TeacherDashBoard /> : <Navigate to="/login" />
          )
        )
      )
    : null}

    </div>
  )
}

export default DashBoardMain