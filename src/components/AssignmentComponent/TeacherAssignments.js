import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Checkbox, CircularProgress, FormControl, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getHandlingSubjects } from '../../backend_helper';
import { getAssignmentsTeacher, postAssignment } from '../../backend_helper/assignmentshelper';
import { AuthContext } from '../../context/authContext';
import { useModal } from '../../utils/useModal';
import { useStateUpdate } from '../../utils/useStateUpdate';
import GeneralModal from '../GenerelModal/GeneralModal';
import AssignmentInfoCard from './AssignmentInfoCard/AssignmentInfoCard';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
function TeacherAssignments() {

    const { open, openModal, closeModal } = useModal();
    const [cName, setCName] = React.useState([]);
    const { loggedInUser } = useContext(AuthContext);
    const [classes, setClasses] = useState([]);
    const [postingAssignment,setPostingAssignment] = useState(false);
    const {stUpVal,triggerStateUpdate} = useStateUpdate();

    const handleChangeClasses = (event) => {
        const {
            target: { value },
        } = event;
        setCName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const getAvailableClasses = () => {
        const baseURL = process.env.REACT_APP_BACKEND;

        fetch(`${baseURL}/api/SchoolClasses`)
            .then(res => res.json())
            .then(data => {
                setClasses(data);
            }).catch(err => console.log(err));
    }
    const handlingSubject = async () => {
        const subject = await getHandlingSubjects(loggedInUser?.id);
        console.log(subject);

        setAssignmentBody({
            ...assignmentBody,
            subjectName: subject.subject,

        });
    }
    const [assignmentBody, setAssignmentBody] = useState({
        forClass: "",
        postedByEmail: "",
        subjectName: "",
        title: "",
        description: "",
        dueDateTime: null,
        assignmentCode : ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignmentBody({
            ...assignmentBody,
            [name]: value
        })

    }
    const checkRequiredFields = () => {
        if(assignmentBody.description === '' || assignmentBody.title === '' || assignmentBody.dueDateTime === null || cName.length === 0){
            return false;
        }
        return true;
    }

    const handlePostAssignment = async (e) => {
        setPostingAssignment(true);
        e.preventDefault();
        const body = {...assignmentBody};
        body.postedByEmail = loggedInUser?.email;
        body.assignmentCode = uuidv4();

        for(var c of cName){
            console.log(c);
            body.forClass = c;
            console.log(body);
            await postAssignment(body);
           
          

        }
        triggerStateUpdate();
        closeModal();
        setPostingAssignment(false);
        
        
    }


    const [postedAssignments,setPostedAssignments] = useState();

    const getAllPostedAssignments = async () => {
        if(loggedInUser){
            const data = await getAssignmentsTeacher(loggedInUser.id);
            console.log(data);
            setPostedAssignments(data?.assignmentsPosted);
        }
    }
    useEffect(() => {
        getAvailableClasses();
        handlingSubject();
        getAllPostedAssignments();
    }, [stUpVal])

    return (
        <div>



        <div style={{
            display:'flex',

            justifyContent:'center',
            alignItems:'center',
            flexWrap:'wrap'
        }}>
            {(postedAssignments && postedAssignments.length > 0) ? 
            
            (
                postedAssignments.map(assignmentInfo => (
                    <AssignmentInfoCard assignmentInfo={assignmentInfo} invokeStateUpdate={triggerStateUpdate} />
                ))
            ) : (
                <Typography variant='body1' textAlign='center'>No Assignments were Posted by You!</Typography>
            )
            }
        </div>







            


            <Box
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#f50057',
                    borderRadius: '50%',
                    padding: '10px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                }}
            >
                <IconButton onClick={openModal}>
                    <AddIcon sx={{ color: 'white', fontSize: '30px' }} />
                </IconButton>
            </Box>


            <GeneralModal open={open} closeModal={closeModal}>
                <Box sx={{
                    padding:'10px',
                    margin:'20px'
                }}>

                    <form>

                        {
                            classes.length > 0 && (
                                <FormControl sx={{ mb: 3, width: '100%' }}>
                                    <InputLabel id="demo-multiple-checkbox-label">Classes</InputLabel>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        variant='standard'
                                        value={cName}
                                        onChange={handleChangeClasses}
                                        input={<OutlinedInput label="Tag" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {classes.map((name) => (
                                            <MenuItem key={name.className} value={name.className}>
                                                <Checkbox checked={cName.indexOf(name.className) > -1} />
                                                <ListItemText primary={name.className} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )
                        }

                        <TextField
                            label="Task"
                            name='title'
                            value={assignmentBody.title}
                            onChange={handleChange}
                            required
                            variant="standard"
                            color="info"
                            type="text"
                            fullWidth
                            sx={{ mb: 3 }}

                        />

                        <TextField
                            label="Description"
                            name='description'
                            value={assignmentBody.description}
                            onChange={handleChange}
                            required
                            color="info"
                            type="text"
                            fullWidth
                            multiline
                            sx={{ mb: 3 }}

                        />

                        
                        <InputLabel htmlFor="dueDateTimeInput">Due Date Time</InputLabel>
                        <TextField
                            name="dueDateTime"
                            value={assignmentBody.dueDateTime}
                            onChange={handleChange}
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


                        {
                            postingAssignment ? <CircularProgress sx={{textAlign:'center'}} /> : <Box sx={{
                                display:'grid',
                                placeItems:'center'
                            }}><Button type='submit' variant='outlined' color='warning' disabled={!checkRequiredFields()} onClick={handlePostAssignment}>POST</Button></Box>
                        }




                    </form>


                </Box>
            </GeneralModal>
        </div>
    )
}

export default TeacherAssignments