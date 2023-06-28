import React, { useContext, useEffect, useState } from 'react'
import { getTimeTableHelper } from '../../backend_helper/timetablehelper';
import { AuthContext } from '../../context/authContext';
import TableComponent from '../TableComponent/TableComponent';
import "./TeacherDashboard.css";

function TeacherDashBoard() {
  const {isSignedIn,loggedInUser} = useContext(AuthContext);
  const [teacherTimeTable,setTeacherTimeTable] = useState([]);
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const getTeacherTimeTable = async () => {
    const data = await getTimeTableHelper();
    const timeTableGot = await data.timeTable;
    // console.log(timeTableGot);
    // console.log(loggedInUser);
    setTeacherTimeTable(timeTableGot.filter(t => t.handledBy === loggedInUser.userName));
    
}

  useEffect(()=>{
    if(loggedInUser){
      getTeacherTimeTable();
    }
    
    
  },[]);
  return (
    <div>
      
     
      <div className='teacher_timetable'>
      {
        DAYS.map(day=>(
          <TableComponent day={day} content={teacherTimeTable.filter(t => t.day === day).sort((a, b) => a.hour.localeCompare(b.hour))} teacher={true} />
        ))
      }
      </div>
      
      </div>
  )
}

export default TeacherDashBoard