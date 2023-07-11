import styled from '@emotion/styled';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAllSessions } from '../../backend_helper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#1F6E8C',
      color: 'white',
    },
    // [`&.${tableCellClasses.body}`]: {
    //   fontSize: 14,
      
    // },
    //    [theme.breakpoints.down('md')]: {
    //   backgroundColor: theme.palette.secondary.main,
    // },
    // [theme.breakpoints.up('md')]: {
    //   backgroundColor: theme.palette.primary.main,
    // },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: 'lightgray',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

export default function TableComponent({day,content,teacher,stateUpdateValFunc}) {

  const [sessions,setSessions] = useState([]);
  const navigate = useNavigate();
  const screenWidth = useMediaQuery('(min-width:700px)');
  const getSessions = async () => {
    const data = await getAllSessions();
    const sessions = await data.sessions;
    setSessions(sessions);
}
 

const formatHour = (hr) =>{
  if(hr.includes('pm')){
    var i = hr.indexOf('pm');
    var v = hr.slice(0,i);
    if(v == 12) return v;
    return (12 + parseInt(v));
  }else{
    var i = hr.indexOf('am');
    var v = hr.slice(0,i);
    if(v == 12) return parseInt(v)-12;
    return v;
  }
  

}

const isTimeRangeCurrent = (timeRange) => {
  const currentTime = new Date();
  const currHour = currentTime.getHours();
  const options = { weekday: 'long' };
  const dayOfWeek = currentTime.toLocaleDateString(undefined, options);
  

  const timeParts = timeRange.split('-');
  var startHour = timeParts[0];
  var endHour = timeParts[1];
  
  if(dayOfWeek === day && currHour >= formatHour(startHour) && currHour < formatHour(endHour) ){
    return true;
  }
  return false;
  


}



const getSessionTiming = (session) => {
  const currSession = sessions?.find(s => s?.session === session);
  return `${currSession?.timing}`;
}

 useEffect(()=>{
  getSessions();

 },[]);


  return (
    <TableContainer component={Paper} sx={{
        mb:'30px',
        backgroundColor:'whitesmoke',
        boxShadow: '2px 2px 4px lightgrey', 
        borderRadius: '4px', 
    }}>
        <Typography variant='h6' sx={{
            textAlign:'center',
            mb:'5px',
            fontWeight:'bold',
            fontFamily:'Arial'
        }}>{day}</Typography>
        
      {
        screenWidth ?  
        <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right">Hour</StyledTableCell>
            { teacher ? <StyledTableCell align="right">Handling Class</StyledTableCell> : (<StyledTableCell align="right">Handled By</StyledTableCell>) }
            <StyledTableCell align="right">Subject</StyledTableCell>
            <StyledTableCell align="right">Meet Code</StyledTableCell> 
            <StyledTableCell align='right'>
              <Box sx={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:"center",
                alignSelf:'flex-end'
              }}>
              <Typography sx={{
                marginLeft:'5px'
              }}>
                Join 
              </Typography>
              <IconButton onClick={()=>{
                console.log("refresh");
                stateUpdateValFunc();
              }}>
                  <RefreshIcon sx={{
                    color:'white'
                  }}  color='white' />
              </IconButton>
              </Box>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {content.map((row) => (
            <StyledTableRow
              key={row.hour}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {`${row.hour} : ${getSessionTiming(row.hour)}`}
              </StyledTableCell>
              {teacher ? <StyledTableCell align="right">{row.forClass}</StyledTableCell> : <StyledTableCell align="right">{row.handledBy}</StyledTableCell>}
              <StyledTableCell align="right">{row.subject}</StyledTableCell>
              <StyledTableCell align="right">{row.meetingURL}</StyledTableCell>
              <StyledTableCell align="right">
                <Button variant='outlined' color='secondary' onClick={()=>{
                  navigate(`/joinClass/${row.meetingURL}`);
                }} disabled={!isTimeRangeCurrent(getSessionTiming(row.hour))} >JOIN NOW</Button> 
              </StyledTableCell>

            </StyledTableRow>
          ))}
        </TableBody>
      </Table> : 
      (
      <Card>
      <CardContent>
        
        {content.map((row) => (
          <Card key={row.hour} sx={{ mb: 2 }}>
            <CardContent sx={{
              display:"flex",
              flexDirection:'column',
              justifyContent:'space-between',
              
            }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>{`${row.hour} : ${getSessionTiming(row.hour)}`}</Typography>
              {teacher ? (
                <Typography variant="body2" sx={{ marginBottom: '5px' }}>
                  <span style={{ color: 'violet' }}>CLASS - </span>
                  {row.forClass}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ marginBottom: '5px' }}>
                  <span style={{ color: 'violet' }}>HANDLED BY - </span>
                  {row.handledBy}
                </Typography>
              )}
              <Typography variant="body2" sx={{ marginBottom: '5px' }}>
                <span style={{ color: 'violet' }}>SUBJECT - </span>
                {row.subject}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '5px' }}>
                <span style={{ color: 'violet' }}>MEET CODE - </span>
                {row.meetingURL}
              </Typography>
              <Box sx={{
                display:"flex",
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
              }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  navigate(`/joinClass/${row.meetingURL}`);
                }}
                disabled={!isTimeRangeCurrent(getSessionTiming(row.hour))}
              >
                JOIN NOW
              </Button>
              <IconButton onClick={()=>{
                console.log("refresh");
                stateUpdateValFunc();
              }}>
                  <RefreshIcon sx={{
                    color:'grey'
                  }}   />
              </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
      )
      }
    </TableContainer>
  );
}
