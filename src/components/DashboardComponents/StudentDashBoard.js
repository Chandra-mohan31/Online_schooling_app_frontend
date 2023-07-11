import React, { useContext, useEffect, useState } from 'react';
import { getStudentClass, getTimeTableHelper } from '../../backend_helper/timetablehelper';
import { AuthContext } from '../../context/authContext';
import TableComponent from '../TableComponent/TableComponent';

function StudentDashBoard() {
  const {isSignedIn,loggedInUser} = useContext(AuthContext);
  const [studentTimeTable,setStudentTimeTable] = useState([]);
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const [stateUpdateVal,setStateUpdateVal] = useState(false);

  const stateUpdateValFunc = () => {
    setStateUpdateVal(!stateUpdateVal);
  }
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  DAYS.sort((a, b) => {
    if (a === today) {
      return -1; // Today comes first
    } else if (b === today) {
      return 1; // Today comes first
    } else {
      return DAYS.indexOf(a) - DAYS.indexOf(b); // Sort based on the original order
    }
  });
  const getStudentTimeTable = async () => {
    const data = await getTimeTableHelper();
    const timeTableGot = await data.timeTable;
    const studentClassResponse = await getStudentClass(loggedInUser.id);
    console.log(studentClassResponse.studentClass.className);
      
    setStudentTimeTable(timeTableGot.filter(t => t.forClass === studentClassResponse.studentClass.className));
    
}

  useEffect(()=>{
    if(loggedInUser){
      getStudentTimeTable();
    }
    
    
    
  },[stateUpdateVal]);
  return (
    <div>

     <div className='student_timetable' style={{
      margin:"30px"
     }}>
     {
        DAYS.map(day=>(
          <TableComponent day={day} content={studentTimeTable.filter(t => t.day === day).sort((a, b) => a.hour.localeCompare(b.hour))} teacher={false} stateUpdateValFunc={stateUpdateValFunc} />
        ))
      }
     </div>
     
      
    </div>
  )
}

export default StudentDashBoard