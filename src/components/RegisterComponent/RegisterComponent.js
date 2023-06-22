import React, { useEffect, useState } from 'react';
import { TextField, FormControl, Button, FormControlLabel, Checkbox, InputLabel, MenuItem, Select, FormLabel, FormGroup, Container, Box, IconButton, Icon, CircularProgress, Typography } from "@mui/material";
import { Man, Man2Outlined, Woman, WomanOutlined } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AWS from "aws-sdk";
import { Link, useNavigate } from 'react-router-dom';
import bgImage from "../../images/elearning2.jpg";

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
    const [registering,setRegistering] = useState(false);
    const [imageUploading,setImageUploading] = useState(false);
    const baseUrl = process.env.REACT_APP_BACKEND;
    const [image,setImage] = useState();
    const navigate = useNavigate();

    const getAvailableClassesAndSubjects = () => {

        fetch(`${baseUrl}/api/SchoolClasses`)
            .then(res => res.json())
            .then(data => {
                setAvailableClass(data);
            }).catch(err=>console.log(err));
            
        fetch(`${baseUrl}/api/SchoolSubjects`)
            .then(res => res.json())
            .then(data => {
                setAvailableSubjects(data);
            }).catch(err=>console.log(err));
    }



    const [validPass, setValidPass] = useState(false);


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


                if (response.ok) {
                    
                    alert("Registerd successfully!,Please confirm your email..");
                    setRegistering(false);
                    navigate("/login");
                  } else {
                    response.json().then((data) => {
                      const errorMessage = data.errorMessage;
                      console.log("Registration error:", errorMessage);
                      alert( errorMessage);
                    });
                }

            })
            .catch(function (error) {
                console.log(error);
                alert(error);
            });
    }

    const submitFormHandler = (e) => {
        e.preventDefault();
        setRegistering(true);
        if (formData.repeatPassword === formData.password && validatePassword()) {


            console.log(formData);
            registerUser();




        } else {
            alert('passwords dont match,also do check other details!')
        }
    }

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const uploadFileToS3AndGenerateUrl = async () => {
        setImageUploading(true);
        console.log(image);
        const s3 = new AWS.S3();
        if (!image) {
            alert("please choose an image");
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

          setFormData({...formData,imageUrl : Location});
          console.log('uploaded to s3', Location);

    }

    useEffect(() => {
        getAvailableClassesAndSubjects();
    }, [])

    return (
        <div style={{
            padding:"30px",
            backgroundColor:"grey"
        }}>

        <div style={{
            display:"flex",
            backgroundColor:"whitesmoke",
            borderRadius:"30px"
        }}>
        <Box className='register_image' sx={{
            display:{
                xs:"none",
                md:"block"
            },
            width:"100%"

            // height:"100%",
            // width:"100%",
        }}>
            <img src={bgImage} style={{
                 height:"100%",
                 width:"100%",
                 objectFit:"cover",
                 borderTopLeftRadius:"30px",
                 borderBottomLeftRadius:"30px",
            }} alt='elearning_image' />
        </Box>
            <form autoComplete='true' onSubmit={submitFormHandler} style={{
                margin: "10px"
            }}>
                <h2  style={{
                    textAlign:"center",
                    fontFamily:"cursive"
                }}>Register as a user</h2>

                <TextField
                    label="User Name"
                    name='userName'
                    onChange={handleChange}
                    required
                    variant="standard"
                    color="secondary"
                    type="text"
                    value={formData.userName}
                    fullWidth
                    sx={{ mb: 3 }}
                />


                <TextField
                    label="Mobile"
                    name='phoneNumber'
                    onChange={handleChange}
                    required
                    variant="standard"
                    color="secondary"
                    type="text"
                    value={formData.phoneNumber}
                    fullWidth
                    sx={{ mb: 3 }}
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

                />

                {
                    formData.imageUrl.length > 0 ? (
                        <InputLabel htmlFor="image" sx={{ marginBottom: '2px', display: 'block' }}>
                    Choosen Profile Image
                </InputLabel>
                    ):(
                        <InputLabel htmlFor="image" sx={{ marginBottom: '2px', display: 'block' }}>
                    Please choose and upload an image
                </InputLabel>
                    )
                }
             {
                (image != null &&  formData.imageUrl.length > 0) ? (
                    <Box>
                    <img src={formData.imageUrl} alt='uploaded_image' style={{
                        height:"100px",
                        width:"100px",
                        borderRadius:"50%",
                        objectFit:"contain"
                    }} />
                </Box>
                ):(
                 
                      <Box sx={{
                        display:"flex",
                        flexDirection:"row",
                        alignItems:"center",
                        mb:3
                        
                    }}>
    
                        <TextField
                        name="image"
                        onChange={(e)=>{
                            setImage(e.target.files[0]);
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
                        ):(
                            <Button variant='contained' color='primary' onClick={uploadFileToS3AndGenerateUrl} sx={{
                                marginLeft:"5px"
                               }}
                               startIcon={<FileUploadOutlinedIcon />}
                               >
                                Upload
                               </Button>
                        )
                       }
                    </Box>
                )
             }

                <Box sx={{
                    // display:"flex",
                    // flexDirection:"row",
                    // alignItems:"center"
                }}>
                <InputLabel htmlFor="dob" sx={{ marginBottom: '8px', display: 'block' }}>
                    DOB
                </InputLabel>
                <TextField
                    name='dob'
                    onChange={handleChange}
                    required
                    variant="filled"
                    color="secondary"
                    type="date"
                    value={formData.dob}
                    fullWidth
                    sx={{ mb: 3 }}

                />

                </Box>









                <FormControl sx={{ mb: 3 }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Gender</FormLabel>
                    <FormGroup sx={{
                        display: "flex",
                        flexDirection: "row"
                    }}>
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
                    // error={() => alert("password doesnt match")} // handle this
                    fullWidth
                    sx={{ mb: 3 }}
                />

                <FormControl fullWidth sx={{
                    mb:"10px"
                }}>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.userRole}
                        label="Role"
                        name='userRole'
                        onChange={handleChange}
                    >
                        <MenuItem value="teacher">Teacher</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                    </Select>
                </FormControl>

                {formData.userRole == "student"
                 && 
                 <FormControl fullWidth sx={{
                    mb:"10px"
                 }}>
                 <InputLabel id="demo-simple-select-label">Class</InputLabel>
                 <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     value={formData.class}
                     label="class"
                     name='class'
                     onChange={handleChange}
                 >
                     {
                        availableClasses.map(availableClass=>(
                        <MenuItem value={availableClass.className}>{availableClass.className}</MenuItem>
                            
                        ))
                     }
                     
                 </Select>
             </FormControl>
                }

                {formData.userRole == "teacher"
                    &&
                    <FormControl fullWidth sx={{
                        mb:"10px"
                    }}>
                        <InputLabel id="demo-simple-select-label">Handling Subject</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.subject}
                            label="subject"
                            name='subject'
                            onChange={handleChange}
                        >
                            {
                                availableSubjects.map(availableSubject => (
                                    <MenuItem value={availableSubject.subjectName}>{availableSubject.subjectName}</MenuItem>

                                ))
                            }

                        </Select>
                    </FormControl>
                }

                <Box sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                 {
                    registering ? (
                        <CircularProgress />
                    ):(
                        <Button variant="contained" color="secondary" type="submit" sx={{
                            width:"50%"
                        }}>Register</Button>
                    )
                 }

                </Box>

                <Box sx={{
                    mt:3,
                    display:"flex",
                    justifyContent:"center"
                }}>
                    <span style={{
                        margin:"5px"
                    }}>Existing user?</span><Link style={{
                        margin:"5px",
                        textDecoration:"none",
                        color:"blueviolet"
                    }} to="/login">Login</Link>
                </Box>
            </form>
        </div>
        </div>
    )
}

export default RegisterComponent