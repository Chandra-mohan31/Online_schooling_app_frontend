


import { Man, Man2Outlined, Woman, WomanOutlined } from '@mui/icons-material';
import BadgeIcon from '@mui/icons-material/Badge';
import ClearIcon from '@mui/icons-material/Clear';
import EmailIcon from '@mui/icons-material/Email';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import AWS from "aws-sdk";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from "../../images/elearning2.jpg";
import { useModal } from '../../utils/useModal';
import AlertModal from '../AlertModal/AlertModal';



const aws_access_key = process.env.REACT_APP_AWS_ACCESS_KEY;
const aws_secret_key = process.env.REACT_APP_AWS_SECRET_KEY;

AWS.config.update({
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_key,
    region: 'us-east-1',
});

function RegisterComponent() {
    const [formData, setFormData] = useState({
        userName: '',
        phoneNumber: '',
        email: '',
        password: '',
        repeatPassword: '',
        imageUrl: '',
        dob: '',
        gender: '',
        userRole: '',
        subject: '',
        class: '',
    });
    const [availableClasses, setAvailableClass] = useState();
    const [availableSubjects, setAvailableSubjects] = useState();
    const [registering, setRegistering] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const baseUrl = process.env.REACT_APP_BACKEND;
    const [image, setImage] = useState();
    const { openModal, closeModal, open, alertMessage, triggerNotification } = useModal();


    const navigate = useNavigate();

    const getAvailableClassesAndSubjects = () => {

        fetch(`${baseUrl}/api/SchoolClasses`)
            .then(res => res.json())
            .then(data => {
                setAvailableClass(data);
            }).catch(err => console.log(err));

        fetch(`${baseUrl}/api/SchoolSubjects`)
            .then(res => res.json())
            .then(data => {
                setAvailableSubjects(data);
            }).catch(err => console.log(err));
    }





    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox' && name === 'gender') {
            console.log("gender option");
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value
            }));

        } else if (type === 'checkbox') {
            console.log('in check box handle change');
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: checked
            }));
        }
        else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };
    const validatePassword = () => {
        // Password should have at least 8 characters
        // It should contain at least one lowercase letter, one uppercase letter, one digit, and one special character
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        return passwordRegex.test(formData.password);
    };
    // have a loading indicator while registering and once registerd show a custom message
    const registerUser = () => {
        const requestBody = {
            "email": formData.email,
            "password": formData.password,
            "imageUrl": formData.imageUrl,
            "userName": formData.userName,
            "phoneNumber": formData.phoneNumber,
            "dob": formData.dob,
            "userRole": formData.userRole,
            "subject": formData.subject,
            "class": formData.class,
            "gender": formData.gender
        }

        fetch(`${baseUrl}/api/Authentication/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody),

        })
            .then((response) => {

                console.log(response);
                if (response.ok) {

                    triggerNotification("Registerd successfully!,Please confirm your email..");
                    setRegistering(false);
                    navigate("/login");
                } else {
                    response.json().then((data) => {
                        const errorMessage = data.errorMessage;
                        console.log("Registration error:", errorMessage);
                        setRegistering(false);
                        triggerNotification(errorMessage);
                    });
                }
                setRegistering(false);

            })
            .catch(function (error) {
                console.log(error);
                setRegistering(false);
                triggerNotification("something went wrong!, try again!");
            });
    }

    const submitFormHandler = (e) => {
        e.preventDefault();
        setRegistering(true);
        if (validatePassword()) {
            if (formData.repeatPassword === formData.password) {
                console.log(formData);
                registerUser();
            } else {
                triggerNotification('passwords dont match!');
                setRegistering(false);
            }






        } else {
            triggerNotification('password did not pass the requirements');
            setRegistering(false);

        }
    }

    




    const uploadFileToS3AndGenerateUrl = async () => {
        setImageUploading(true);
        console.log(image);
        const s3 = new AWS.S3();
        if (!image) {
            triggerNotification("please choose an image");
            return;
        }
        const params = {
            Bucket: 'onlineschool-files',
            Key: `${Date.now()}.${image.name}`,
            Body: image,
            ContentType: image.type
        };
        const { Location } = await s3.upload(params).promise();
        setImageUploading(false);

        setFormData({ ...formData, imageUrl: Location });
        console.log('uploaded to s3', Location);

    }

    useEffect(() => {
        getAvailableClassesAndSubjects();
    },[])




    return (
        <div style={{
            padding: "30px",
            backgroundColor: "white",
            fontFamily: "Arial"
        }}>

            <div style={{
                display: "flex",
                backgroundColor: "whitesmoke",
                borderRadius: "30px"
            }}>
                <Box className='register_image' sx={{
                    display: {
                        xs: "none",
                        md: "block"
                    },
                    width: "100%"

                    // height:"100%",
                    // width:"100%",
                }}>
                    <img src={bgImage} style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: "30px",
                        borderBottomLeftRadius: "30px",
                    }} alt='elearning_image' />
                </Box>
                <form autoComplete='true' onSubmit={submitFormHandler} style={{
                    margin: "10px",
                    padding: "20px"
                }}>
                    <h2 style={{
                        textAlign: "center",
                        fontFamily: "Arial"
                    }}>Register as a user</h2>

                    <TextField
                        label="User Name"
                        name='userName'

                        onChange={handleChange}
                        required
                        variant="standard"
                        color="info"
                        type="text"
                        value={formData.userName}
                        fullWidth
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><BadgeIcon /></InputAdornment>

                        }}

                    />


                    <TextField
                        label="Mobile"
                        name='phoneNumber'
                        onChange={handleChange}
                        required
                        variant="standard"
                        color="info"
                        type="text"
                        value={formData.phoneNumber}
                        fullWidth
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><PhoneIcon /></InputAdornment>

                        }}
                    />

                    <TextField
                        name='email'
                        onChange={handleChange}
                        required
                        variant="standard"
                        color="info"
                        label="email"
                        type="email"
                        value={formData.email}
                        fullWidth
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><EmailIcon /></InputAdornment>

                        }}

                    />

                    {
                        formData.imageUrl.length > 0 ? (
                            <InputLabel htmlFor="image" sx={{ marginBottom: '2px', display: 'block' }}>
                                Chosen Profile Image
                            </InputLabel>
                        ) : (
                            <InputLabel htmlFor="image" sx={{ marginBottom: '2px', display: 'block', textAlign: "center" }}>
                                Please choose and upload your image
                            </InputLabel>
                        )
                    }
                    {
                        (image != null && formData.imageUrl.length > 0) ? (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",



                            }}>
                                <img src={formData.imageUrl} alt='uploaded_image' style={{
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "contain"
                                }} />
                                <IconButton sx={{
                                    marginLeft: "5px"
                                }} onClick={() => {
                                    setImage(null);
                                    setFormData({
                                        ...formData, imageUrl: ''
                                    })
                                }}>
                                    <ClearIcon />
                                </IconButton>
                            </Box>
                        ) : (

                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                mb: 3

                            }}>

                                <TextField
                                    name="image"
                                    inputProps={{
                                        accept: 'image/*',
                                        onChange: (e) => {
                                            setImage(e.target.files[0]);
                                        },
                                    }}
                                    required
                                    variant='standard'
                                    color='info'

                                    type='file'
                                    fullWidth


                                />

                                {
                                    imageUploading ? (
                                        <CircularProgress color='secondary' />
                                    ) : (

                                        image && (<Button variant='contained' color='primary' onClick={uploadFileToS3AndGenerateUrl} sx={{
                                            marginLeft: "5px"
                                        }}
                                            startIcon={<FileUploadOutlinedIcon />}
                                        >
                                            Upload
                                        </Button>)

                                    )
                                }
                            </Box>
                        )
                    }

                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <label htmlFor="dob" style={{ marginBottom: '8px', display: 'block' }}>
                            DOB :
                        </label>
                        <TextField
                            name='dob'
                            onChange={handleChange}
                            required
                            variant="filled"
                            color="secondary"
                            type="date"

                            value={formData.dob}
                            sx={{ mb: 3, width: "80%" }}


                        />

                    </Box>









                    <FormControl sx={{ mb: 3 }} component="fieldset" variant="standard">

                        <FormGroup sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",

                        }}>
                            <label
                                style={{

                                    color: "black",
                                    marginRight: "30px",
                                    textDecoration: "none"
                                }}
                            >Gender :</label>

                            <FormControlLabel
                                name='gender'
                                control={
                                    <Checkbox checked={formData.gender === 'male'} onChange={handleChange} name='gender' value="male" icon={<Man2Outlined />}
                                        checkedIcon={<Man />} />
                                }
                                label="Male"
                            />
                            <FormControlLabel
                                name='gender'
                                control={
                                    <Checkbox checked={formData.gender === 'female'} onChange={handleChange} name="gender" value="female" icon={<WomanOutlined />}
                                        checkedIcon={<Woman />} />
                                }
                                label="Female"
                            />

                        </FormGroup>

                    </FormControl>

                    <TextField
                        label="Password"
                        name='password'
                        onChange={handleChange}
                        required
                        variant="standard"
                        color="secondary"
                        type="password"
                        value={formData.password}
                        error={false}
                        helperText="Password must have atleast 1 Uppercase 1 lowercase letter 1 digit and a special char"
                        fullWidth
                        sx={{ mb: 3 }}

                    />
                    <TextField
                        label="repeat password"
                        name='repeatPassword'
                        onChange={handleChange}
                        required
                        variant="standard"
                        color="secondary"
                        type="password"
                        value={formData.repeatPassword}
                        // error={() => triggerNotification("password doesnt match")} // handle this
                        fullWidth
                        sx={{ mb: 3 }}

                    />

                    <FormControl fullWidth sx={{
                        mb: "10px"
                    }}>
                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.userRole}
                            label="Role"
                            name='userRole'
                            required
                            onChange={handleChange}

                        >
                            <MenuItem value="teacher">Teacher</MenuItem>
                            <MenuItem value="student">Student</MenuItem>
                        </Select>
                    </FormControl>

                    {formData.userRole === "student"
                        &&
                        <FormControl fullWidth sx={{
                            mb: "10px"
                        }}>
                            <InputLabel id="demo-simple-select-label">Class</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData.class}
                                label="class"
                                name='class'
                                onChange={handleChange}
                                required

                            >
                                {
                                    availableClasses?.map(availableClass => (
                                        <MenuItem key={availableClass.className} value={availableClass.className}>{availableClass.className}</MenuItem>

                                    ))
                                }

                            </Select>
                        </FormControl>
                    }

                    {formData.userRole === "teacher"
                        &&
                        <FormControl fullWidth sx={{
                            mb: "10px"
                        }}>
                            <InputLabel id="demo-simple-select-label">Handling Subject</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData.subject}
                                label="subject"
                                name='subject'
                                onChange={handleChange}
                                required

                            >
                                {
                                    availableSubjects?.map(availableSubject => (
                                        <MenuItem key={availableSubject.subjectName} value={availableSubject.subjectName}>{availableSubject.subjectName}</MenuItem>

                                    ))
                                }

                            </Select>
                        </FormControl>
                    }

                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {
                            registering ? (
                                <CircularProgress />
                            ) : (
                                <Button variant="contained" color="primary" type="submit" sx={{
                                    width: "50%"
                                }}>Register</Button>
                            )
                        }

                    </Box>

                    <Box sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <span style={{
                            margin: "5px"
                        }}>Existing user?</span><Link style={{
                            margin: "5px",
                            textDecoration: "none",
                            color: "blueviolet"
                        }} to="/login">Login</Link>
                    </Box>
                </form>

                <AlertModal closeModal={closeModal} openModal={openModal} open={open} alertMessage={alertMessage} />
            </div>
        </div>
    )
}

export default RegisterComponent