import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AuthContext } from '../../../context/authContext';
import { Box, Button, CircularProgress, InputLabel, LinearProgress, Menu, MenuItem, TextField, Tooltip } from '@mui/material';
import "../../styles/scrollbar.css";
import { Delete } from '@mui/icons-material';
import { useState } from 'react';
import { deleteAssignmentPosted, updateDueDate } from '../../../backend_helper/assignmentshelper';


export default function AssignmentInfoCard({ assignmentInfo, invokeStateUpdate }) {

    const { loggedInUser } = React.useContext(AuthContext);
    const [displayEditOptions, setDisplayEditOptions] = React.useState(null);
    const [updatedDueDate, setUpdatedDueDate] = useState(assignmentInfo?.dueDateTime);
    const openEdit = (e) => setDisplayEditOptions(e.currentTarget);
    const closeEdit = () => setDisplayEditOptions(null);


    const updateDateDue = async () => {
        const data = await updateDueDate(assignmentInfo.assignmentCode, updatedDueDate);
        console.log(data);
        invokeStateUpdate();
        closeEdit();
    }

    const deleteAssignment = async () => {
        const data = await deleteAssignmentPosted(assignmentInfo?.assignmentCode);
        console.log(data);
        invokeStateUpdate();
        closeEdit();
    }
    return (
        <Card sx={{ height: '300px', width: '380px', margin: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardHeader
                avatar={
                    loggedInUser?.role == 'Teacher' ? 
                    <Avatar src={loggedInUser?.imageUrl} sx={{ bgcolor: red[500] }} aria-label="recipe">

                    </Avatar> : null
                }
                action={
                    loggedInUser?.role == 'Teacher' ? 
                    <IconButton onClick={openEdit} aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>: null
                }
                title={assignmentInfo.title}
                subheader={`Due : ${(new Date(assignmentInfo.dueDateTime)).toLocaleString()}`}
            />


            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {assignmentInfo.description}
                </Typography>
            </CardContent>
          
                {
                     
                    loggedInUser.role == 'Teacher' ?
                    <CardContent>
                    <Typography variant='caption' color='secondary' fontWeight='bold'>Submissions</Typography>
                    <Box className="scrollbar scrollbar-primary" sx={{
                        display: "flex",
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: 'space-between',
                        maxWidth: '350px'
    
    
                    }}>
                        {
                        assignmentInfo.assignmentsSubmissionInfo.map(subInfo => (
                            <Tooltip title={`click to view ${subInfo.className} submissions!`}>
                                <Box sx={{
                                    minWidth: '125px',
                                    marginLeft: '2px',
                                    marginRight: '2px',
                                    paddingBottom: '15px',
                                    cursor: "pointer"
                                    //  border:'1px solid black'
                                }}
                                    onClick={() => {
                                        //navigate to the assignments posted by the class for this assignment section
                                    }}
                                >
                                    <Typography sx={{ width: '100%' }} variant='caption'>{subInfo.className} : {subInfo.receivedSubmissions}/{subInfo.classTotal}</Typography>
                                    <LinearProgress sx={{ width: '100%' }} variant='determinate' value={(subInfo.receivedSubmissions / subInfo.classTotal) * 100} />
    
    
    
    
                                </Box>
                            </Tooltip>
    
    
                        ))}
    
    
    
    
                    </Box>
                    </CardContent> : <CardContent sx={{display:'grid',placeItems:'center'}}>
                        <Button variant='outlined' color='primary'>Make a Submission</Button>
                    </CardContent>

                }
                

            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={displayEditOptions}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(displayEditOptions)}
                onClose={closeEdit}
            >

                <MenuItem sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>

                    <Typography variant='caption'>Change Due Date Time</Typography>
                    <TextField
                        name="dueDateTime"
                        value={updatedDueDate}
                        onChange={(e) => {
                            setUpdatedDueDate(e.target.value);
                        }}
                        required
                        variant="standard"
                        color="info"
                        type="datetime-local"
                        fullWidth
                        sx={{ mb: 3 }}
                        id="dueDateTimeInput"
                        InputLabelProps={{
                            shrink: true,
                            htmlFor: 'dueDateTimeInput',
                        }}
                    />
                    <Button variant='outlined' color='secondary' onClick={() => {
                        console.log("update the due date for assignment code - ", assignmentInfo.assignmentCode);
                        updateDateDue();
                    }}>Apply</Button>


                </MenuItem>
                <MenuItem>
                    <IconButton sx={{ marginLeft: 'auto' }} onClick={() => {
                        console.log("delete this assignment!");
                        deleteAssignment();
                    }}>

                        <Delete color='error' />
                    </IconButton>
                </MenuItem>
            </Menu>





            <CardActions disableSpacing>
            {loggedInUser?.role == 'Teacher' ? 
                <Tooltip title={assignmentInfo?.assignmentCode}>
                    <Typography
                        sx={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                        variant="caption"
                    >
                        ASSIGNMENT CODE: {assignmentInfo.assignmentCode}
                    </Typography>

                </Tooltip> : (
                     <Box sx={{
                        display:"flex",
                        justifyContent:'space-between',
                        alignItems:'center',
                        minWidth:'100%'
                     }}>
                     <Typography
                         sx={{
                             maxWidth: '50%',
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                             whiteSpace: 'nowrap',
                         }}
                         variant="caption"
                     >
                         {assignmentInfo.email}
                     </Typography>
                     <Typography
                         sx={{
                             maxWidth: '40%',
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                             whiteSpace: 'nowrap',
                         }}
                         variant="caption"
                     >
                         {assignmentInfo.subjectName}
                     </Typography>
 
                 </Box>
                )}

            </CardActions>


        </Card>
    );
}