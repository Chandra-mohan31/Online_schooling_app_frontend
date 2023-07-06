import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { getSubmissionsOfClassForAssignmentCode } from '../../backend_helper/assignmentshelper';
import { Typography } from '@mui/material';
import AssignmentSubmissionsTableView from './AssignmentSubmissionsTableView';

function ViewAssignmentSubmissions() {
const params = useParams();
const className = params.className;
const assignmentCode = params.assignmentCode;
const [submissions,setSubmissions] = useState();
const {loggedInUser} = useContext(AuthContext);

const getSubmissions = async () => {
    const res =  await getSubmissionsOfClassForAssignmentCode(className,assignmentCode);
    console.log(res);
    if(res?.classSubmissions){
        setSubmissions(res?.classSubmissions);

    }
}
useEffect(()=>{
    getSubmissions();
},[])
  return (
    <div>
       {
        submissions ? (
            <div>
                <AssignmentSubmissionsTableView submissionData={submissions}  />
            </div>
        ) : (
            <Typography variant='body1' textAlign='center'>No submissions found!</Typography>
        )
       }
    </div>
  )
}

export default ViewAssignmentSubmissions