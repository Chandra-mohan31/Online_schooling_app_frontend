import styled from '@emotion/styled';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Avatar, Card, CardContent, Grid, InputAdornment, TextField } from '@mui/material';
import React from 'react';

import BadgeIcon from '@mui/icons-material/Badge';

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor:'whitesmoke',
    boxShadow: '0px 2px 4px grey'
  }));
const UserCard = ({ user,editMode,setEditMode }) => {
  const { email, dob, phoneNumber, imageUrl,userName } = user;
  const formatDate = (datetime) => {
        const formattedDate = datetime.substring(0, 10);
  }
  return (
    <StyledCard sx={{
        
    }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
        <Grid container justifyContent="center">
  <Grid item>
    <Avatar sx={{
        height:'100px',
        width:'100px',
        objectFit:'contain',
        border:'2px solid lightblue',
        padding:'3px'
    }} alt="User Avatar" src={imageUrl} />
  </Grid>
</Grid>
<Grid item xs={12}>
  <TextField
    label="Email"
    variant="outlined"
    value={email}
    fullWidth
    disabled={!editMode}
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
                    value={userName}
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
    value={dob}
    fullWidth
    disabled={!editMode}
  />
</Grid>
<Grid item xs={12}>
  <TextField
    label="Phone"
    variant="outlined"
    value={phoneNumber}
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
  );
};

export default UserCard;
