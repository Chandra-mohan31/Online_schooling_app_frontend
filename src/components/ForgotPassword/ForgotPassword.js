import { Box, Button, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react'
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from 'react-router-dom';


function ForgotPassword() {
    const [passCodeSent,setPassCodeSent] = useState(false);
    const [passCodeValue,setPassCodeValue] = useState("");
    
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const baseUrl = process.env.REACT_APP_BACKEND;

    const navigate = useNavigate();

    const getPasswordResetCode = async () => {
        console.log("getting password reset code");
       
        try{
        const res = await fetch(`${baseUrl}/api/Authentication/forgot-password?email=${encodeURIComponent(email)}`,
        {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            }
        }
        )
        const data = await res.json();
        if(res.ok){
            console.log(data.message);
            setPassCodeSent(true);
            alert(data.message);
        }else{
            console.log(data); 
            alert("Failed to send Reset Code!"); 
        }
                 
        } catch(err){
            console.log(err);
        }
        
    }
    const resetPassword = async () => {
        console.log("resetPassword");

        try{
            const res = await fetch(`${baseUrl}/api/Authentication/reset-password?email=${encodeURIComponent(email)}&resetToken=${encodeURIComponent(passCodeValue)}&newPassword=${encodeURIComponent(password)}`,
            {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                }
            }
            )
            const data = await res.json();
            if(res.ok){
                console.log(data.message);
                
                alert(data.message);
                navigate("/login");
                
            }else{
                console.log("failed to reset Password!");
                console.log(data); 
                alert("Failed to reset Password!,",data.message);
            }
            } catch(err){
                console.log(err);
            }
    }


  return (
    <div
    style={{
        height:"100vh",
        display:"grid",
        placeItems:"center",
        backgroundColor:"grey"

    }}
    >
      
   <Box sx={{

        backgroundColor:"whitesmoke"
   }}>
        {
            passCodeSent ? (
                <div style={{
                    padding:"30px",
                    fontFamily:"Arial"
                }}>
            
                    <h1>Please enter your New Password</h1>
            
                    <TextField
                                label="received code via registered email"
                                name='Code'
                                onChange={(e)=>{
                                    setPassCodeValue(e.target.value)
                                }}
                                required
                                variant="standard"
                                color="info"
                                type="text"
                                value={passCodeValue}
                                fullWidth
                                sx={{ mb: 3 }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><VpnKeyIcon /></InputAdornment>
                                    
                                  }}
                            />
                    <TextField
                                label="Password"
                                name='password'
                                onChange={(e)=>setPassword(e.target.value)}
                                required
                                variant="standard"
                                color="secondary"
                                type="password"
                                value={password}
                                helperText="Password must have atleast 1 Uppercase 1 lowercase letter 1 digit and a special char"
                                fullWidth
                                sx={{ mb: 3 }}
                               
                            />
                        
                    <Button disabled={password == null || password.length == 0 || passCodeValue == null ||passCodeValue.length == 0} variant='contained' color='info' onClick={resetPassword} >Reset Password</Button>
            
                </div>
            ):(
                <div style={{
                    padding:"30px",
                    fontFamily:"Arial"
                }}>
            
                    <h1>Please enter your Registerd Email</h1>
                           
                          <TextField
                                name='email'
                                onChange={(e)=>  setEmail(e.target.value)}
                                required
                                variant="standard"
                                color="info"
                                label="email"
                                type="email"
                                value={email}
                                fullWidth
                                sx={{ mb: 3 }}

                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><EmailIcon /></InputAdornment>
                                    
                                  }}
                            />
                            <Button variant='contained' color='info' disabled={email.length == 0 || email == null} onClick={getPasswordResetCode} >Get Code</Button>
            
                </div>
            )
        }
   </Box>



    </div>
  )
}

export default ForgotPassword