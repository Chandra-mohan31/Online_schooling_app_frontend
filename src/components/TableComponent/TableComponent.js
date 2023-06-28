import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: 'black',
      color: 'white',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
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

export default function TableComponent({day,content,teacher}) {


      


  return (
    <TableContainer component={Paper} sx={{
        mb:'30px',
        backgroundColor:'whitesmoke'
    }}>
        <Typography variant='subtitle1' sx={{
            textAlign:'center',
            mb:'5px'
        }}>{day}</Typography>
        
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right">Hour</StyledTableCell>
            { teacher ? <StyledTableCell align="right">Handling Class</StyledTableCell> : (<StyledTableCell align="right">Handled By</StyledTableCell>) }
            <StyledTableCell align="right">Subject</StyledTableCell>
            <StyledTableCell align="right">Meet Link</StyledTableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {content.map((row) => (
            <StyledTableRow
              key={row.hour}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {row.hour}
              </StyledTableCell>
              {teacher ? <StyledTableCell align="right">{row.forClass}</StyledTableCell> : <StyledTableCell align="right">{row.handledBy}</StyledTableCell>}
              <StyledTableCell align="right">{row.subject}</StyledTableCell>
              <StyledTableCell align="right">{row.meetingURL}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
