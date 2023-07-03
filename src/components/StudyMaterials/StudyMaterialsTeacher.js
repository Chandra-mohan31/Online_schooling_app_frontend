import React, { useContext, useEffect, useState } from 'react'
import GeneralModal from '../GenerelModal/GeneralModal'
import { useModal } from '../../utils/useModal';
import { Box, Button, Checkbox, CircularProgress, FormControl, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getHandlingSubjects } from '../../backend_helper';
import { AuthContext } from '../../context/authContext';
import { fileUploadHelper } from '../../backend_helper/imageuploadhelper';
import { postStudyMaterial } from '../../backend_helper/studymaterialshelper';


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


function StudyMaterialsTeacher() {
    const { open, openModal, closeModal } = useModal();
    const [cName, setCName] = React.useState([]);
    const [classes, setClasses] = useState([]);
    const [handlingSub, setHandlingSub] = useState();
    const [fileUploading,setFileUploading] = useState(false);



    const {loggedInUser} = useContext(AuthContext);




    const [uploadMaterialBody, setUploadMaterialBody] = useState(
        {
            postedBy: "",
            subject: "",
            forClass: "",
            materialTitle: "",
            description: "",
            materialContentUrl: "",
            materialContentType: ""
        }
    );

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
        setHandlingSub(subject?.subject);
        setUploadMaterialBody({
            ...uploadMaterialBody,
            subject:subject?.subject,
            
        });
    }
    
    const uploadMaterialToS3 = async (e) => {
        setFileUploading(true);
        
        const file = e.target.files[0];

        try {
            const response = await fileUploadHelper(file);


            console.log('File uploaded successfully:', response);
            setUploadMaterialBody({
                ...uploadMaterialBody,materialContentType:file.type,materialContentUrl:response
            });
        } catch (error) {

            console.error('Error uploading file:', error);
        }
        setFileUploading(false);
    }


    const postMaterial = async (e) =>  {
        e.preventDefault();
        const body = {...uploadMaterialBody};
        body.postedBy = loggedInUser?.id;
        console.log(cName);
        console.log(body);
        for(var c of cName){
            console.log(c);
            body.forClass = c;
            await postStudyMaterial(body);
        }
        console.log('posted materials successfully!');
        closeModal();
        
        
    }


   

    useEffect(() => {
        getAvailableClasses();
        handlingSubject();
    }, [JSON.stringify(classes)]);



    return (
        <Box>

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
                <Box>
                    <Typography variant='body1' color='InfoText' sx={{
                        mb: 3
                    }}>Upload Study Material</Typography>
                    <Box>
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
                                label="Title"
                                name='materialTitle'
                                value={uploadMaterialBody.materialTitle}
                                onChange={(e)=>{
                                    setUploadMaterialBody({
                                        ...uploadMaterialBody,
                                        materialTitle: e.target.value
                                    })
                                }}
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
                                value={uploadMaterialBody.description}
                                onChange={(e)=>{
                                    setUploadMaterialBody({
                                        ...uploadMaterialBody,description:e.target.value
                                    })
                                }}
                                required
                                color="info"
                                type="text"
                                fullWidth
                                multiline
                                sx={{ mb: 3 }}

                            />

                            {
                                fileUploading ? <CircularProgress /> : (
                                    <TextField sx={{
                                        mb: 3
                                    }} type='file' onChange={uploadMaterialToS3} />
                                )
                            }


                            <Button type='submit' variant='contained' color='info' onClick={postMaterial}>
                                Post
                            </Button>


                        </form>
                    </Box>
                </Box>
            </GeneralModal>
        </Box>
    )
}

export default StudyMaterialsTeacher