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
import { Clear, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { deleteAssignmentPosted, deleteStudentSubmission, getAssignmentSubmissionOfStudent, postAssignmentSubmission, updateDueDate } from '../../../backend_helper/assignmentshelper';
import { useEffect } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { fileUploadHelper } from '../../../backend_helper/imageuploadhelper';
import ClearIcon from '@mui/icons-material/Clear';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { useNavigate } from 'react-router-dom';

export default function AssignmentInfoCard({ assignmentInfo, invokeStateUpdate,stUpVal }) {

    const { loggedInUser } = React.useContext(AuthContext);
    const [displayEditOptions, setDisplayEditOptions] = React.useState(null);
    const [updatedDueDate, setUpdatedDueDate] = useState(assignmentInfo?.dueDateTime);
    const openEdit = (e) => setDisplayEditOptions(e.currentTarget);
    const closeEdit = () => setDisplayEditOptions(null);
    const [fileUploading, setFileUploading] = useState(false);
    const [chosenFile, setChosenFile] = useState();
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);

    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

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


    const [userSubmission, setUserSubmission] = useState();

    const getUserSubmission = async () => {
        if (loggedInUser && loggedInUser.role == "Student" && assignmentInfo) {
            console.log(loggedInUser.email);
            console.log(assignmentInfo.id);

            const response = await getAssignmentSubmissionOfStudent(loggedInUser.email, assignmentInfo.id);
            console.log(response);
            if (response?.studentSubmission) {
                setUserSubmission(response.studentSubmission);

            }else{
                setUserSubmission(null);
            }
        }
    }

    const submitAssignment = async (fileSubmissionUrl,fileName,fileType) => {
        if(loggedInUser && loggedInUser?.role == 'Student' && assignmentInfo){
            const body =  {
                assignmentId: assignmentInfo?.id,
                studentUserName: loggedInUser?.email,
                studentSubmissionFileURL: fileSubmissionUrl,
                studentProfileUrl: loggedInUser?.imageUrl,
                fileName: fileName,
                fileType: fileType
              }
    
            console.log(body);
            await postAssignmentSubmission(body);
            invokeStateUpdate();
        }
      

    }

    const uploadAssignmentToS3 = async (e) => {
        e.preventDefault();
        setFileUploading(true);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setChosenFile(file);

            try {
                const response = await fileUploadHelper(file);


                console.log('File uploaded successfully:', response);
                await submitAssignment(response,file.name,file.type);
                //set the file uploaded url
            } catch (error) {

                console.error('Error uploading file:', error);
            }
        }
        setFileUploading(false);
    }

    const handleDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setFileUploading(true);
        setChosenFile(file);
        try {
            const response = await fileUploadHelper(file);


            console.log('File uploaded successfully:', response);
            //set the file upload url
        } catch (error) {

            console.error('Error uploading file:', error);
        }
        setFileUploading(false);

    };
    const deleteSubmission = async (submissionId) => {
        console.log('delete the submission with id ', submissionId);
        const res = await deleteStudentSubmission(submissionId);
        console.log(res);
        invokeStateUpdate();

    }

    const isMicrosoftDocument = (contentValue) => {
        const isPPT = contentValue?.endsWith('.ppt') || contentValue?.endsWith('.pptx');
        const isDOC = contentValue?.endsWith('.doc') || contentValue?.endsWith('.docx');
        const isXLS = contentValue?.endsWith('.xls') || contentValue?.endsWith('.xlsx');
    
    
    
        const isOfficeViewable = isPPT || isDOC || isXLS;
        if (isOfficeViewable) {
          return true;
        }
      }

    useEffect(() => {

        getUserSubmission();
    }, [stUpVal])

    return (
        <Card sx={{ height: '300px', width: '380px', margin: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',  }}>
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
                        </IconButton> : null
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
                                                navigate(`/viewsubmissions/${assignmentInfo.assignmentCode}/${subInfo.className}`);
                                                //navigate to the assignments posted by the class for this assignment section
                                            }}
                                        >
                                            <Typography sx={{ width: '100%' }} variant='caption'>{subInfo.className} : {subInfo.receivedSubmissions}/{subInfo.classTotal}</Typography>
                                            <LinearProgress sx={{ width: '100%' }} variant='determinate' value={(subInfo.receivedSubmissions / subInfo.classTotal) * 100} />




                                        </Box>
                                    </Tooltip>


                                ))}




                        </Box>
                    </CardContent> :
                    (
                        <CardContent sx={{ display: 'grid', placeItems: 'center' }}>
                            {userSubmission ? (

                                <Box sx={{
                                    minWidth:'90%',
                                    maxWidth:'100%',
                                    padding:'5px',
                                    backgroundColor:'whitesmoke',
                                    display: 'flex',
                                    alignItems: 'center',

                                    justifyContent: 'space-between'
                                }}>
                                     <a 
                                // href={value}
                                href={isMicrosoftDocument(userSubmission.studentSubmissionFileURL) ? `https://view.officeapps.live.com/op/view.aspx?src=${userSubmission.studentSubmissionFileURL}` : userSubmission.studentSubmissionFileURL}
                                target='_blank' style={{
                                    textDecoration:'none',
                                    color:'inherit'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        cursor: 'pointer'
                                    }}>
                                        <FileOpenIcon color='info' />
                                        <Typography variant='caption'>{userSubmission.fileName}</Typography>
                                    </Box>
                                    </a>
                                    <IconButton onClick={() => deleteSubmission(userSubmission?.id)}>
                                        <ClearIcon color='error' />
                                    </IconButton>

                                </Box>
                            ) : (


                                fileUploading ? <CircularProgress sx={{ textAlign: 'center' }} /> : (


                                        <Box
                                            sx={{
                                                border: '1px dashed grey',
                                                borderRadius: '10px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                minWidth:'90%',
                                                maxWidth:'100%',
                                                padding:'5px',
                                                display: 'flex',
                                                alignItems: 'center',
            
                                                justifyContent: 'space-between'

                                            }}
                                            onClick={handleFileUploadClick}
                                            onDrop={handleDrop}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                            }}



                                        >
                                            <Typography variant='caption'>Upload your submission</Typography>
                                            <IconButton>
                                                <AttachFileIcon color='info' />
                                                <input type="file" ref={fileInputRef} hidden onChange={uploadAssignmentToS3} />
                                            </IconButton>
                                        </Box>

                                )

                            )}
                        </CardContent>
                    )

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
                            display: "flex",
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            minWidth: '100%'
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