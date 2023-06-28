import React, { useContext, useEffect, useState } from 'react'
import TableComponent from '../TableComponent/TableComponent'
import { getTimeTableHelper } from '../../backend_helper/timetablehelper';
import { AuthContext } from '../../context/authContext';

function StudentDashBoard() {
  const {isSignedIn,loggedInUser} = useContext(AuthContext);
  const [studentTimeTable,setStudentTimeTable] = useState([]);
  var classNameOfLoggedInUser = 'Class-A';
  const getStudentTimeTable = async () => {
    const data = await getTimeTableHelper();
    const timeTableGot = await data.timeTable;
    timeTableGot.find(t => t.forClass == classNameOfLoggedInUser)
    setStudentTimeTable(timeTableGot);

}
  useEffect(()=>{
    console.log(loggedInUser.id);//with id get the class of user
  },[JSON.stringify(studentTimeTable)]);
  return (
    <div>

      <TableComponent />
      {/* map through days and pass the values as props to the table component and render the component  */}
    </div>
  )
}

export default StudentDashBoard