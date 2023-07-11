import { FileOpen } from '@mui/icons-material';
import { Avatar, Box, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';



export default function AssignmentSubmissionsTableView({submissionData}) {


    const columns = [
        { id: 'id', label: 'SubmissionID', minWidth: 170 },
        {
          id: 'fileName',
          label: 'File Name',
          minWidth: 170,
          align: 'center'
        },
        {
          id: 'submissionDateTime',
          label: 'Submitted Time',
          minWidth: 170,
          align: 'center',
          format: (value) => value.toLocaleString(),
        },
        
        {
          id: 'studentProfileUrl',
          label: '',
          minWidth: 20,
          align: 'center',
        },
        {
          id: 'studentUserName',
          label: 'Student',
          minWidth: 170,
          align: 'center',
        },
        {
          id: 'studentSubmissionFileURL',
          label:'View File',
          minWidth:170,
          align:'center'
        }
      ];
      
      function createData(id, fileName, submissionDateTime, studentUserName, studentProfileUrl,studentSubmissionFileURL) {
          return { id, fileName, submissionDateTime, studentUserName, studentProfileUrl,studentSubmissionFileURL };
        }
      
      const rows = [];
      submissionData?.forEach(submission => {
        rows.push(createData(submission.id , submission.fileName,  new Date(submission.submissionDateTime).toLocaleString(), submission.studentUserName,submission.studentProfileUrl ,submission.studentSubmissionFileURL));
      });
     
      
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const isMicrosoftDocument = (contentValue) => {
    const isPPT = contentValue?.endsWith('.ppt') || contentValue?.endsWith('.pptx');
    const isDOC = contentValue?.endsWith('.doc') || contentValue?.endsWith('.docx');
    const isXLS = contentValue?.endsWith('.xls') || contentValue?.endsWith('.xlsx');



    const isOfficeViewable = isPPT || isDOC || isXLS;
    if (isOfficeViewable) {
      return true;
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
               column.label != '' &&  <TableCell
               key={column.id}
               align={column.align}
               style={{ minWidth: column.minWidth }}
             >
               {column.label}
             </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if(column.id === 'studentProfileUrl'){
                        return (
                            <TableCell key={column.id} align={column.align}>
                               <Box sx={{
                                    display:'flex',
                                    alignItems:'center',
                                    minWidth:'100%',
                                    justifyContent:'center'
                                }}>
                                    <Avatar src={row['studentProfileUrl'] || 'Profile'} alt={row['studentUserName']} />
                                    <Typography variant='caption' marginLeft='2px'>{row['studentUserName']}</Typography>
                                </Box>
                        
                            </TableCell>
                        );
                      }else if(column.id === 'studentSubmissionFileURL'){
                        return (
                            <TableCell key={column.id} align={column.align}>
                                <a 
                                // href={value}
                                href={isMicrosoftDocument(value) ? `https://view.officeapps.live.com/op/view.aspx?src=${value}` : value}
                                target='_blank' rel="noreferrer" style={{
                                    textDecoration:'none',
                                    color:'inherit'
                                }}>
                                <Box sx={{
                                    display:'flex',
                                    alignItems:'center',
                                    minWidth:'100%',
                                    justifyContent:'center'
                                }}>
                                    <FileOpen /><Typography variant='caption'>{row['fileName']}</Typography>
                                </Box>
                                </a>
                                
                            </TableCell>
                        )
                      }else if(column.id === 'studentUserName'){
                        return null;
                      }
                      else{
                        return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                      }
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}