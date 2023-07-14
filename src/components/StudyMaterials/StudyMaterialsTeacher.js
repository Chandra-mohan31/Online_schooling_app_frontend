import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Checkbox, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { getHandlingSubjects } from '../../backend_helper';
import { fileUploadHelper } from '../../backend_helper/imageuploadhelper';
import { getPostedMaterialsTeacher, postStudyMaterial } from '../../backend_helper/studymaterialshelper';
import { AuthContext } from '../../context/authContext';
import { useModal } from '../../utils/useModal';
import GeneralModal from '../GenerelModal/GeneralModal';
import MaterialPreviewCard from './MaterialPreviewCard';
import debounce from 'lodash.debounce';
import {  Clear, Search } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';

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
    const [fileUploading, setFileUploading] = useState(false);
    const [chosenFile, setChosenFile] = useState();

    const [postedMaterials,setPostedMaterials] = useState([]);
    const [materialsCache,setMaterialsCache] = useState([]);
    const [stUp,setStUp] = useState(false);
    const inStUp =() => {
        setStUp(!stUp);
    }


    const { loggedInUser } = useContext(AuthContext);

    const getPostedMaterials = async () => {
        if(loggedInUser){
        const data = await getPostedMaterialsTeacher(loggedInUser?.id);
        console.log(data);
        setPostedMaterials(data?.materials);
        setMaterialsCache(data?.materials);
        }
    }


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
            subject: subject?.subject,

        });
    }

    const uploadMaterialToS3 = async (e) => {
        e.preventDefault();
        setFileUploading(true);
        if (e.target.files && e.target.files.length > 0){
        const file = e.target.files[0];
        setChosenFile(file);

        try {
            const response = await fileUploadHelper(file);


            console.log('File uploaded successfully:', response);
            setUploadMaterialBody({
                ...uploadMaterialBody, materialContentType: file.type, materialContentUrl: response
            });
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
            setUploadMaterialBody({
                ...uploadMaterialBody, materialContentType: file.type, materialContentUrl: response
            });
        } catch (error) {

            console.error('Error uploading file:', error);
        }
        setFileUploading(false);

      };

    const postMaterial = async (e) => {
        e.preventDefault();

        const body = { ...uploadMaterialBody };
        body.postedBy = loggedInUser?.id;
        console.log(cName);
        console.log(body);
        if (body.postedBy === '' ||
            body.subject === '' ||
            body.materialTitle === '' ||
            body.description === '' ||
            body.materialContentUrl === '' ||
            body.materialContentType === '') {
            alert('please provide all the neccessary fields!');
            return;
        }
        for (var c of cName) {
            console.log(c);
            body.forClass = c;
            await postStudyMaterial(body);
        }
        alert('posted materials successfully!');
        inStUp();
        closeModal();


    }


    const filterMaterials = (materials,titlePrefix) => {
        const filteredMaterials = [];
        console.log(materials);
        for (const material of materials) {
          const title = material?.materialTitle?.toLowerCase();
          if (title.startsWith(titlePrefix.toLowerCase())) {
            filteredMaterials.push(material);
          }
        }
        console.log(filteredMaterials);
        return filteredMaterials;
      };
      const [searchMaterialTitle,setSearchMaterialTitle] = useState('');
    
    
    
      const debouncedSearch = React.useCallback(
        debounce(async (query,materials) => {
          
          if(query == ''){
            setPostedMaterials(materials);
          }else{
            
            setPostedMaterials(filterMaterials(materials,query));
    
            
          }
        }, 500), 
        []
      );
    
      const handleQueryChange = (e) => {
          setSearchMaterialTitle(e.target.value);
          debouncedSearch(e.target.value,materialsCache);
          
      }



    useEffect(() => {
        getAvailableClasses();
        handlingSubject();
        getPostedMaterials();
    }, [stUp]);



    return (
        <Box>
             
    <Box sx={{
      display:'grid',
      placeItems:'center'
    }}>
    <Box sx={{
      display:'flex',
      flexDirection:'column',
      alignItems:'center'
    }}>
    <Typography variant='h5' textAlign='center' sx={{
      margin:'10px',
      
    }}>Posted Study Materials</Typography>
    <TextField
                        label="search"
                        name='search'
                        onChange={handleQueryChange}
                        variant="standard"
                        color="info"
                        type="text"
                        value={searchMaterialTitle}
                        fullWidth
                        sx={{ m: 4 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search  /></InputAdornment>,
                            endAdornment: <InputAdornment position='end'><IconButton onClick={()=>{
                                setSearchMaterialTitle('');
                                setPostedMaterials(materialsCache);
                            }}><Clear /></IconButton></InputAdornment>
                        }}
                    />
    </Box>
    </Box>
            
            <Box sx={{
                margin:'20px',
                display:'flex',
                flexDirection:'row',
                flexWrap:'wrap',
                justifyContent:'center',
                alignItems:'center'
            }}>
                {
                   (postedMaterials && postedMaterials.length > 0) ? postedMaterials.map(material => (
                        <MaterialPreviewCard material={material} key={material.id} inStUp={inStUp} isTeacher={true}/>
                    )) : <Typography variant='body1'>No study Materials have been Posted by You!</Typography>
                }
            </Box>

            

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
                                onChange={(e) => {
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
                                onChange={(e) => {
                                    setUploadMaterialBody({
                                        ...uploadMaterialBody, description: e.target.value
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
                                fileUploading ? <CircularProgress sx={{textAlign:'center'}} /> : (

                                    <Box sx={{
                                        mb:3
                                    }}>
                                        {chosenFile ? (
                                            <div style={{

                                                display:'flex',
                                                flexDirection:'column',
                                                justifyContent:'center',
                                                alignItems:'center',
                                                border: '2px dashed black',
                                                borderRadius: '10px',
                                                padding: 3,
                                                textAlign: 'center',
                                            }}>
                                                <p>Selected File: {chosenFile.name}</p>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => setChosenFile()}
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                        ) : (
                                            <Box
                                                sx={{
                                                    border: '2px dashed black',
                                                    borderRadius: '10px',
                                                    padding: 3,
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                }}
                                                onDrop={handleDrop}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    
                                                  }}
                                                
                                                
                                                
                                            >
                                                <p>Drag and drop a file here or click the button below.</p>
                                                <Button variant="contained" component="label">
                                                    Select File
                                                    <input type="file" hidden onChange={uploadMaterialToS3} />
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                )
                            }



                            <Box  sx={{
                                display:'flex',
                                justifyContent:'center',
                                alignItems:'center'
                            }} >
                            <Button type='submit' variant='outlined' disabled={( 
            uploadMaterialBody.subject === '' ||
            uploadMaterialBody.materialTitle === '' ||
            uploadMaterialBody.description === '' ||
            uploadMaterialBody.materialContentUrl === '' ||
            uploadMaterialBody.materialContentType === '')} color='secondary' onClick={postMaterial}>
                                Post
                            </Button>
                            </Box>
                            


                        </form>
                    </Box>
                </Box>
            </GeneralModal>
        </Box>
    )
}

export default StudyMaterialsTeacher