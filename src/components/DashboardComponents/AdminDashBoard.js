import React, { useEffect, useState } from 'react';
import "./AdminDashboard.css";
import { getAllClasses, getAllSessions, isLoggedIn } from '../../backend_helper';
import { getAvailableTeachersForTheSession, getTimeTableHelper, postToTimeTable } from '../../backend_helper/timetablehelper';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useModal } from '../../utils/useModal';
import GeneralModal from '../GenerelModal/GeneralModal';
function AdminDashBoard() {

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const [CLASSES,setCLASSES] = useState([]);
const [SESSIONS,setSESSIONS] = useState([]);

const [timeTable,setTimeTable] = useState([]);

const [createTimeTableBody,setCreateTimeTableBody] = useState({
        day: "",
        className: "",
        sessionName: "",
        teacherMail: "",
        meetLink: ""
});
const [availableTeachers,setAvailableTeachers] = useState([]);

const getClasses = async () => {
    const data = await getAllClasses();
    const classes = await data.classes;
    // console.log(classes);
    setCLASSES(classes);
}

const getSessions = async () => {
    const data = await getAllSessions();
    const sessions = await data.sessions;
    // console.log(classes);
    setSESSIONS(sessions);
}
 

const getSessionDetails = (day,session,classname) => {
    const sessionData = timeTable.find(t => t.day == day && t.hour == session && t.forClass == classname);
    return sessionData;
}

// if this doesnt work i have to manage a state to store every sessionDetails


const getTimeTable = async () => {
    const data = await getTimeTableHelper();
    const timeTableGot = await data.timeTable;
    console.log(timeTableGot);
    setTimeTable(timeTableGot);

}


const getAllRequiredData = () => {
    getClasses();
    getSessions();
    getTimeTable();
}


const {open,closeModal,openModal} = useModal();


useEffect(()=> {
    getAllRequiredData();
    
},[timeTable]);
  return (
<div className='day_details_container'>

    {
        DAYS.map((day, index) => (
            <div key={index}>
                <h1>{day}</h1>
                <div className='class_hours_mappings'>
                    {
                        CLASSES.map((className, classIndex) => (
                          <fieldset><legend>{className}</legend> <div style={{
                                display:"flex",
                                justifyContent:"space-between"
                            }} key={classIndex}>
                                
                                <div>

                                    {
                                        SESSIONS.map((session,sessionIndex)=>(
                                            <div className='class_timetable'>
                                                
                                                {getSessionDetails(day,session,className) ? (
                                                    <p>{getSessionDetails(day,session,className)?.subject}</p>
                                                ):(<Button onClick={()=>{
                                                    openModal();
                                                    getAvailableTeachersForTheSession(session,day).then(data=>{
                                                        console.log(data);
                                                        setAvailableTeachers(data.availableTeachers);
                                                    }).catch(err=>{
                                                        console.log(err);
                                                    })
                                                    setCreateTimeTableBody({...createTimeTableBody,day:day,sessionName:session,className:className})
                                                }} variant='outlined' color='info'>
                                                    Assign Staff
                                                </Button>)}

                                            </div>
                                        ))
                                    }

                                </div>
                            </div>
                            </fieldset> 
                        ))
                    }
                </div>
            </div>
        ))
    }
    <GeneralModal open={open} closeModal={closeModal}>
        <Box>
            <p>CLASS : {createTimeTableBody.className}</p>
            <p>DAY : {createTimeTableBody.day}</p>
            <p>SESSION : {createTimeTableBody.sessionName}</p>
            
                


            <FormControl fullWidth sx={{
                margin:"10px"
            }}>
            <InputLabel id="demo-simple-select-label">Choose Teacher</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={createTimeTableBody.teacherMail}
                label="Teacher"
                onChange={(e)=>{
                    setCreateTimeTableBody({
                        ...createTimeTableBody,teacherMail:e.target.value
                    })
                }}
            >
                {availableTeachers.map((teacher)=>(
                    <MenuItem value={teacher.teacher}>{`${teacher.teacher} : ${teacher.subject}`}</MenuItem>
                    ))}
                
                
            </Select>
            </FormControl>
            <Button disabled={createTimeTableBody.teacherMail == '' && true} variant='outlined' color='primary' onClick={()=>{
                postToTimeTable(createTimeTableBody);
            }}>POST</Button>
        </Box>
    </GeneralModal>
</div>

  )
}

export default AdminDashBoard