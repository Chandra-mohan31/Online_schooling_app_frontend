import React, { useContext, useState } from 'react';
import { Typography, Box, Container, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { Card, CardContent, Avatar, Grid, TextField, InputAdornment } from '@mui/material';
import styled from '@emotion/styled';
import { AuthContext } from '../../context/authContext';
import UserCard from './UserCard';
import { Navigate, useNavigate } from 'react-router-dom';

import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

import BadgeIcon from '@mui/icons-material/Badge';
import { editUserProfile, logoutUser } from '../../backend_helper';
import { s3UploadUrl } from '../../backend_helper/imageuploadhelper';

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: 'whitesmoke',
    boxShadow: '0px 2px 4px grey'
}));
function ProfileComponent() {
    const { loggedInUser,inStUpdate } = useContext(AuthContext);

    const [updatedUserDetails, setUpdatedUserDetails] = useState({
        userName: '',
        email: '',
        phoneNumber: '',
        dob: '',
        imageUrl: '',
        gender: ''
    });



    const [imageChanging,setImageChanging] = useState(false);
    const handleUserDetailsChange = (event) => {
        const { name, value } = event.target;
        setUpdatedUserDetails((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }
    const [editMode, setEditMode] = useState(false);
    console.log(loggedInUser);

    const formatDate = (datetime) => {
        const formattedDate = datetime.substring(0, 10);
    }
    const navigate = useNavigate();

    const isUserDetailsChanged = (
        updatedUserDetails.userName !== loggedInUser?.userName ||
        updatedUserDetails.email !== loggedInUser?.email ||
        updatedUserDetails.phoneNumber !== loggedInUser?.phoneNumber ||
        updatedUserDetails.dob !== loggedInUser?.dob.slice(0, 10) ||
        updatedUserDetails.imageUrl !== loggedInUser?.imageUrl ||
        updatedUserDetails.gender !== loggedInUser?.gender
    );

    const updateUserInfo = async () => {
        const response = await editUserProfile(loggedInUser.id, updatedUserDetails);

        console.log(response);
        if (response.message == 'user details updated!') {
            alert('details updated successfully!');
            setEditMode(false);
            inStUpdate();
        } else {
            alert('failed updating try again or contact admin!');
        }
    }

    const handleImageProfileChange = async (e) => {
        setImageChanging(true);
        const image = e.target.files[0];

        try {
            const response = await s3UploadUrl(image);


            console.log('File uploaded successfully:', response);
            setUpdatedUserDetails({
                ...updatedUserDetails,imageUrl:response
            });
        } catch (error) {

            console.error('Error uploading file:', error);
        }
        setImageChanging(false);
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px'
        }}>


            <Box sx={{

                width: '90%',
                border: '1px solid black',
                display: 'flex',
                flexDirection: 'column',

            }}>

                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {loggedInUser && <Typography variant='h6' sx={{
                        textAlign: 'center',
                        margin: '10px'
                    }}>Welcome {loggedInUser.userName}</Typography>}

                    {
                        !editMode ? (
                            <Button sx={{
                                alignSelf: 'flex-end',
                                margin: '10px'
                            }} variant='contained' color='primary' onClick={() => {
                                setEditMode(true);
                                setUpdatedUserDetails({ ...updatedUserDetails, email: loggedInUser.email, userName: loggedInUser.userName, dob: loggedInUser.dob.slice(0, 10), gender: loggedInUser.gender, imageUrl: loggedInUser.imageUrl, phoneNumber: loggedInUser.phoneNumber });
                            }}>
                                Edit
                            </Button>
                        ) : (
                            <Button sx={{
                                alignSelf: 'flex-end',
                                margin: '10px'
                            }} variant='contained' color='error' onClick={() => {
                                setEditMode(false);
                            }}>
                                Cancel
                            </Button>
                        )
                    }


                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {
                        xs: 'column',
                        md: 'row'
                    }
                }}>


                    <Box sx={{
                        flexBasis: '50%'
                    }}>
                        {
                            loggedInUser && (
                                <StyledCard>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid container justifyContent="center">
                                                {
                                                    imageChanging ? (<CircularProgress />):(
                                                        <Grid item>
                                                    <label htmlFor="avatar-input">
                                                        <Avatar
                                                            sx={{
                                                                height: '100px',
                                                                width: '100px',
                                                                objectFit: 'contain',
                                                                border: '2px solid lightblue',
                                                                padding: '3px',
                                                                cursor: 'pointer',
                                                            }}
                                                            alt="User Avatar"
                                                            src={!editMode ? loggedInUser?.imageUrl : updatedUserDetails?.imageUrl}
                                                        />
                                                        <input
                                                            id="avatar-input"
                                                            type="file"
                                                            disabled={!editMode}
                                                            onChange={handleImageProfileChange}
                                                            style={{ display: 'none' }}
                                                        />
                                                    </label>
                                                </Grid>
                                                    )
                                                }

                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Email"
                                                    variant="outlined"
                                                    type='email'
                                                    required
                                                    value={!editMode ? loggedInUser?.email : updatedUserDetails?.email}
                                                    onChange={handleUserDetailsChange}
                                                    fullWidth
                                                    disabled={true}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end"><EmailIcon /></InputAdornment>

                                                    }}

                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    label="User Name"
                                                    name='userName'

                                                    variant="outlined"
                                                    color="info"
                                                    type="text"
                                                    value={!editMode ? loggedInUser?.userName : updatedUserDetails?.userName}
                                                    onChange={handleUserDetailsChange}
                                                    fullWidth
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end"><BadgeIcon /></InputAdornment>

                                                    }}
                                                    disabled={!editMode}

                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Date of Birth"
                                                    variant="outlined"
                                                    name='dob'
                                                    type='date'
                                                    value={!editMode ? loggedInUser?.dob?.slice(0, 10) : updatedUserDetails?.dob}
                                                    onChange={handleUserDetailsChange}
                                                    fullWidth
                                                    disabled={!editMode}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Phone"
                                                    variant="outlined"
                                                    type='text'
                                                    name='phoneNumber'
                                                    value={!editMode ? loggedInUser?.phoneNumber : updatedUserDetails?.phoneNumber}
                                                    onChange={handleUserDetailsChange}
                                                    fullWidth
                                                    disabled={!editMode}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end"><PhoneIcon /></InputAdornment>

                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </StyledCard>
                            )
                        }
                    </Box>
                    <Box sx={{
                        flexBasis: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        margin: '20px',
                        backgroundColor:'whitesmoke',
                        padding:'10px',
                        boxShadow:'1px 1px 2px 2px lightgrey',
                        borderRadius:'10px'
                    }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={!editMode ? (loggedInUser?.gender || '') : updatedUserDetails?.gender}
                                onChange={handleUserDetailsChange}
                                label="Gender"
                                name='gender'
                                disabled={!editMode}
                            >
                                <MenuItem value='male'>Male</MenuItem>
                                <MenuItem value='female'>Female</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography variant='body1'>Your Role : <span style={{ color: 'violet' }}>{loggedInUser?.role}</span></Typography>

                        <Button variant='outlined' color='secondary' onClick={() => {
                            console.log("logic for changing password!");
                            // navigate("/forgotpassword")
                        }}>Click to reset password</Button>
                    </Box>
                </Box>
                {
                    editMode && (
                        <Box sx={{
                            display: 'grid',
                            placeItems: 'center',
                            margin: '10px'
                        }}>
                            <Button disabled={!isUserDetailsChanged} variant='contained' onClick={() => {
                                console.log(updatedUserDetails);
                                updateUserInfo();
                            }}>
                                update details
                            </Button>
                        </Box>
                    )
                }
            </Box>



        </Box>
    )
}

export default ProfileComponent