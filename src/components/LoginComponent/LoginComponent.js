import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../../backend_helper';
import { AuthContext } from '../../context/authContext';
import bgImage from "../../images/elearning1.jpg";
import { useModal } from '../../utils/useModal';
import AlertModal from '../AlertModal/AlertModal';
import "./LoginComponent.css";

function LoginComponent() {
    const navigate = useNavigate();
    const [loggingIn,setLoggingIn] = useState(false);
    const [loginData,setLoginData] = useState({
        email:"",
        password:"",
        rememberme:true
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]:value
        });
    }

    const {open,alertMessage,setAlertMessage,closeModal,openModal,triggerNotification} = useModal();
    const {invokeStateUpdate} = useContext(AuthContext);

  return (
    <div style={{
        padding:"30px",
        backgroundColor:"white",
        height:"100vh",
        margin:0,
        fontFamily:"Arial",
        display:"grid",
        placeItems:"center"
    }} >
        <Box className='login_card'  sx={{
        display:"flex",
        backgroundColor:"whitesmoke",
        height:"550px",
    }}>
        <Box className='login_image' sx={{
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
        

        <Box className='login_form_container' style={{
            width:"100%"
        }}>
        <div className='login_title'>
            <Typography variant='h6' sx={{
                fontFamily:'Arial'
            }}>Login to your Account</Typography>
        </div>
        <form>
        <TextField
                    name='email'
                    onChange={handleChange}
                    required
                    variant="standard"
                    color="info"
                    label="email"
                    type="email"
                    value={loginData.email}
                    fullWidth
                    sx={{ mb: 3 }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><EmailIcon /></InputAdornment>
                        
                      }}
                    
                />
                     
                  <TextField
                    label="Password"
                    name='password'
                    onChange={handleChange}
                    required
                    variant="standard"
                    color="secondary"
                    type="password"
                    value={loginData.password}
                    error={false}
                    
                    fullWidth
                    sx={{ mb: 3 }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><LockOpenIcon /></InputAdornment>
                        
                      }}
                />
                      

<FormGroup>
  <FormControlLabel control={<Checkbox checked={loginData.rememberme} onChange={()=>{
    setLoginData({
        ...loginData,rememberme:!loginData.rememberme
    })
  }} />} label="Remember Me" />

</FormGroup>

{
    loggingIn ? (
        <CircularProgress />
    ):(
        <Button fullWidth color='info' variant='contained' disabled={(loginData.email.length===0 || loginData.password.length==0)  ? true : false}  onClick={()=>{
            console.log(loginData);
            setLoggingIn(true);
            handleLogin({email:loginData.email,password:loginData.password,rememberme:loginData.rememberme})
              .then(data=>{
                  console.log(data);
                  if(data.message==="Logged In successfully!"){
                      setLoggingIn(false);
                      invokeStateUpdate(true);
                      navigate("/dashboard");
                  }else{
                      setLoggingIn(false);
                      console.log(data);
                      if(typeof data.message === 'string'){
                        triggerNotification(data.message);
                      }else{
                        triggerNotification('something went wrong!')
                      }
                     
                  }
              })
              .catch(err=>{
                  setLoggingIn(false);
                  triggerNotification("error logging in ..")
              });
          }}>
              Login
          </Button>
    )
}

<Link to="/forgotpassword" style={{
    textAlign:"center",
    marginLeft:"38%",

}}>Forgot Password ?</Link>

<Box sx={{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    mt:8
}}>
    <span style={{
       margin:"10px"
    }}>Dont have an Account?</span>
    <Link style={{
        margin:"10px",
        textDecoration:"none",
        fontWeight:"bold",
        color:"blueviolet"
    }} to="/register">Register as a new user</Link>
</Box>
        </form>
        </Box>
        </Box>
        <AlertModal closeModal={closeModal} openModal={openModal} open={open} alertMessage={alertMessage} />

    </div>
  )
}

export default LoginComponent