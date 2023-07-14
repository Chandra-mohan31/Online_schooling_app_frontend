import React, { useEffect, useState } from 'react'
import { getUserDetails } from '../../backend_helper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';



function ChatSidebar() {
    const [users,setUsers] = useState([]);
    const getAllUsersToChat = async () => {
        const response = await getUserDetails();
        console.log(response);
        setUsers(response);

    }
    const params = useParams();
    const userChatingWith = params.userId;
    const navigate = useNavigate();
    useEffect(()=>{
        getAllUsersToChat();
    },[])
  return (
    <Box sx={{
        flex:'30%',
        
    }}>
      <List sx={{ width: '100%',maxHeight:'85vh',overflowY:'scroll', maxWidth: 360, bgcolor: 'background.paper' }}>

        {
            users?.map(user=>(
                <ListItem onClick={()=>{
                        navigate(`/chat/${user.id}`);
                }} key={user.id} alignItems="flex-start" sx={{cursor:'pointer',borderBottom:'1px solid lightgrey',backgroundColor: user.id == userChatingWith ? 'lightgrey' : 'whitesmoke'}}>
                <ListItemAvatar>
                  <Avatar alt={user.userName} src={user.imageUrl == "" ? user.userName : user.imageUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.email}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {user.userName}
                      </Typography>
                      
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))
        }

    </List>  
    </Box>
  )
}

export default ChatSidebar