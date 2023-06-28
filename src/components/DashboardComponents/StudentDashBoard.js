import React, { useContext, useEffect, useState } from 'react'
import TableComponent from '../TableComponent/TableComponent'
import { getStudentClass, getTimeTableHelper } from '../../backend_helper/timetablehelper';
import { AuthContext } from '../../context/authContext';

function StudentDashBoard() {
  const {isSignedIn,loggedInUser} = useContext(AuthContext);
  const [studentTimeTable,setStudentTimeTable] = useState([]);
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
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
    
    
  },[]);
  return (
    <div>

     <div className='student_timetable' style={{
      margin:"30px"
     }}>
     {
        DAYS.map(day=>(
          <TableComponent day={day} content={studentTimeTable.filter(t => t.day === day).sort((a, b) => a.hour.localeCompare(b.hour))} teacher={false} />
        ))
      }
     </div>
     
      
    </div>
  )
}

export default StudentDashBoard