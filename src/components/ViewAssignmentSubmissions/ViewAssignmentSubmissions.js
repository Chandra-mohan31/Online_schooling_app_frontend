import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { getSubmissionsOfClassForAssignmentCode, getUnSubmittedUsers } from '../../backend_helper/assignmentshelper';
import { Typography } from '@mui/material';
import AssignmentSubmissionsTableView from './AssignmentSubmissionsTableView';
import UnSubmittedStudentList from './UnSubmittedStudentList';

function ViewAssignmentSubmissions() {
const params = useParams();
const className = params.className;
const assignmentCode = params.assignmentCode;
const [submissions,setSubmissions] = useState();
const {loggedInUser} = useContext(AuthContext);
const [unSubmittedList,setUnSubmittedList] = useState(null);

const getSubmissions = async () => {
    const res =  await getSubmissionsOfClassForAssignmentCode(className,assignmentCode);
    console.log(res);
    if(res?.classSubmissions){
        setSubmissions(res?.classSubmissions);

    }
}


const getStudentsNotSubmittedAssignment = async () => {
    const res = await getUnSubmittedUsers(className,assignmentCode);
    console.log(res);
    if(res.studentsNotSubmitted){
        setUnSubmittedList(res.studentsNotSubmitted);
    }

}
useEffect(()=>{
    getSubmissions();
    getStudentsNotSubmittedAssignment();
},[])
  return (
    <div>
       {
        submissions ? (
            <div>
                <AssignmentSubmissionsTableView submissionData={submissions}  />
                <div>
                    
                {unSubmittedList && (
                    <div>
                        <Typography variant='h6'>Students yet to Submit</Typography>
                    <UnSubmittedStudentList unSubmitted={unSubmittedList} />
                    </div>
                )}
                </div>
               
            </div>
        ) : (
            <Typography variant='body1' textAlign='center'>No submissions found!</Typography>
        )
       }
    </div>
  )
}

export default ViewAssignmentSubmissions