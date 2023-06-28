import React, { useEffect, useMemo, useState } from 'react';
import "./AdminDashboard.css";
import { getAllClasses, getAllSessions, isLoggedIn } from '../../backend_helper';
import { clearTimeTable, deleteTimeTable, getAvailableTeachersForTheSession, getTimeTableHelper, postToTimeTable } from '../../backend_helper/timetablehelper';
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, tooltipClasses } from '@mui/material';
import { useModal } from '../../utils/useModal';
import GeneralModal from '../GenerelModal/GeneralModal';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import {styled} from '@mui/material/styles';


const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#F5F5F5',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

function AdminDashBoard() {

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const [CLASSES,setCLASSES] = useState([]);
const [SESSIONS,setSESSIONS] = useState([]);
const [infoModel,setInfoModel] = useState(false);
const [timeTable,setTimeTable] = useState([]);
const [stVal,setStVal] = useState(false);
const [updating,setUpdating] = useState();




const [createTimeTableBody,setCreateTimeTableBody] = useState({
        id :0,
        day: "",
        className: "",
        sessionName: "",
        teacherMail: "",
        meetLink: ""
});
const [availableTeachers,setAvailableTeachers] = useState([]);

const invokeStateUpdate = () => {
    setStVal(!stVal);
}

const generateRandomGibberish = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let gibberish = '';
  
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      const randomLetter = letters[randomIndex];
      gibberish += randomLetter;
    }
  
    return gibberish;
    
    
  }

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
    setTimeTable(timeTableGot);

}


const getAllRequiredData = () => {
    getClasses();
    getSessions();
    getTimeTable();
}

const clearOutTimeTable = () => {
    setUpdating(true);
    clearTimeTable();
    invokeStateUpdate();
    setUpdating(false);
}


const automateSessionAllocation = async () => {
    setUpdating(true);
    for(const day of DAYS){
        for(const className of CLASSES){
            for(const session of SESSIONS){
                try {
                    console.log(`get teachers available for the ${day} - ${className} - ${session.session}`);
                    let availableStaff = [];
                    const data = await getAvailableTeachersForTheSession(session.session, day);
                    availableStaff = data.availableTeachers;
                    
                    const no_teachers_available = availableStaff.length;
                    const randomIndex = Math.floor(Math.random() * no_teachers_available);
                    const alreadyAssignedValue = getSessionDetails(day,session.session,className);
                    if(no_teachers_available > 0 && !alreadyAssignedValue){
                        const automateTimeTableData = {
                            day: day,
                            className: className,
                            sessionName: session.session,
                            teacherMail: availableStaff[randomIndex].teacher,
                            meetLink: generateRandomGibberish()
                        }
                        await postToTimeTable(automateTimeTableData);
                    }

                  } catch (err) {
                    console.log(err);
                  }
            }
        }
    }
    
    invokeStateUpdate();
    setUpdating(false);
}


const {open,closeModal,openModal} = useModal();

//try using useMemo to avoid excess calling to server

useEffect(()=> {
    getAllRequiredData();
    
},[stVal]);
//timetable removed - keeps pinging the server to check for changes , check out some better ways 




  return (
    <div className='admin_dashboard'>
        {
            updating ? <CircularProgress /> : (
                <Box sx={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"space-between"
                }}>
                <Tooltip title='automate timetable allocation'>
                <Button sx={{
                    margin:'10px'
                }} color='success' variant='outlined' onClick={()=>{
                    automateSessionAllocation();
                }}>Automate Session Allocation</Button>
                </Tooltip>
                <Button sx={{margin:'10px'}} color='warning' variant='outlined' onClick={clearOutTimeTable}>Clear Timetable</Button>
                </Box>
            )
        }
        
            

    
        
           
                <div className='class_hours_mappings'>
                    {
                        CLASSES.map((className, classIndex) => (
                            <div>
                            <h3 style={{
                                textAlign:'center'
                            }}>{className}</h3>
                          <div key={classIndex} style={{
                            display:"flex",
                            flexDirection:"row",
                            alignItems:"center",
                            justifyContent:"center",
                        }}>
                           
                                
                                {
                             DAYS.map((day, index) => (
                            <div key={index} style={{
                                border:"0.3px solid black"
                            }}>
                                <h4 style={{
                                    textAlign:"center"
                                }}>{day}</h4>
                                <div className='class_timetable'>
                                {
                                        SESSIONS.map((session,sessionIndex)=>(
                                            <div className='class_timetable' key={sessionIndex}>
                                                
                                                {getSessionDetails(day,session.session,className) ? (
                                                    <div>
                                                        <span style={{
                                                            fontSize:"15px"
                                                        }}>{`${getSessionDetails(day,session.session,className)?.subject}`}</span>
                                                        
                                                        
                                                        <HtmlTooltip
                                                           
                                                            title={
                                                                <Box>
                                                                    <Typography variant='body1' sx={{
                                                                        color:"black",
                                                                        fontWeight:"bold",
                                                                        fontFamily:"cursive"
                                                                    }} align='center'>Session Details</Typography>
                                                                    <Typography variant='body2' color='InfoText' align='center'>
                                                                        <span className='session_details_caption'>Session : </span> {session.session} 
                                                                        {/* get timing of session */}
                                                                    </Typography>
                                                                    <Typography variant='body2' color='InfoText' align='center'>
                                                                        <span className='session_details_caption'>Timing :</span> {session.timing} 
                                                                        {/* get timing of session */}
                                                                    </Typography>
                                                                    <Typography variant='body2' color='InfoText' align='center'>
                                                                        <span className='session_details_caption'>Handled By :</span> {getSessionDetails(day,session.session,className)?.handledBy}
                                                                    </Typography>
                                                                    <Typography variant='body2' color='InfoText' align='center'>
                                                                        <span className='session_details_caption'>Subject :</span> {getSessionDetails(day,session.session,className)?.subject}
                                                                    </Typography>
                                                                    <Typography variant='body2' color='InfoText' align='center'>
                                                                        <span className='session_details_caption'>Meet Code : </span>{getSessionDetails(day,session.session,className).meetingURL}
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                        >
                                                            <IconButton>
                                                                <InfoIcon color='info' />
                                                            </IconButton>
                                                        </HtmlTooltip>

                                                        <Tooltip title='delete this session'>
                                                        <IconButton onClick={()=>{
                                                            deleteTimeTable(getSessionDetails(day,session.session,className)?.id).then(res=>res.json()).then(data=>console.log(data)).catch(err=>console.log(err));
                                                            invokeStateUpdate();
                                                        }}>
                                                            <ClearIcon color='error' />
                                                        </IconButton>
                                                        </Tooltip>
                                                        

                                                       
                                                        
                                                        </div>
                                                ):(
                                                    <div>
                                                <Button onClick={()=>{
                                                    openModal();
                                                    setCreateTimeTableBody({...createTimeTableBody,day:day,sessionName:session.session,className:className,meetLink:generateRandomGibberish()});
                                                    getAvailableTeachersForTheSession(session.session,day).then(data=>{
                                                        console.log(data);
                                                        setAvailableTeachers(data.availableTeachers);
                                                    }).catch(err=>{
                                                        console.log(err);
                                                    })

                                                }} variant='outlined' color='info'>
                                                    Assign Staff
                                                </Button></div>
                                                )}

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }

                                   

                                
                            
                            </div> </div>
                        ))
                    }
                </div>
            
        
    
    <GeneralModal open={open} closeModal={closeModal}>
        <Box sx={{
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"center",
        }}>
            <Typography variant='body1' color='ActiveBorder' sx={{
                marginBottom:"10px"
            }} ><span style={{
                color:"#A933FF",
                fontWeight:"bold"
            }}>CLASS : &nbsp;</span> {createTimeTableBody.className}</Typography>
            <Typography variant='body1' color='ActiveBorder' sx={{
                marginBottom:"10px"
            }}><span style={{
                color:"#A933FF",
                fontWeight:"bold"
            }} >DAY : &nbsp;</span> {createTimeTableBody.day}</Typography>
            <Typography variant='body1' color='ActiveBorder' sx={{
                marginBottom:"10px"
            }}><span style={{
                color:"#A933FF",
                fontWeight:"bold"
            }} >SESSION :  &nbsp;</span>{createTimeTableBody.sessionName}</Typography>
            <Typography variant='body1' color='ActiveBorder' sx={{
                marginBottom:"10px"
            }}><span style={{
                color:"#A933FF",
                fontWeight:"bold"
            }} >MEET CODE : &nbsp;</span> {createTimeTableBody.meetLink}</Typography>
                


            <FormControl fullWidth sx={{
                margin:"10px"
            }}>
            <InputLabel id="demo-simple-select-label">Choose Teacher</InputLabel>
            <Select
                fullWidth
                color='secondary'
                variant='standard'
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
            
         <Box sx={{
            display:"flex",
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between"
         }}>
         <Button disabled={createTimeTableBody.teacherMail == '' && true} variant='outlined' color='primary' sx={{
            margin:"10px"
         }} onClick={()=>{
                postToTimeTable(createTimeTableBody);
                invokeStateUpdate();
                closeModal();
            }}>POST</Button>
            <Button onClick={closeModal} variant='outlined' color='warning' sx={{
                margin:"10px"
            }}>Close</Button>
         </Box>
        </Box>
    </GeneralModal>
</div>
  )
}

export default AdminDashBoard