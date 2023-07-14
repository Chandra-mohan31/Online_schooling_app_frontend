import React, { useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { AuthContext } from '../../context/authContext';

function ChatMessage({sender,message,timestamp}) {
  const {loggedInUser} = useContext(AuthContext);
  return (
    <Box sx={{minWidth:'95%',maxWidth:'95%',display:'flex',justifyContent:loggedInUser === sender ? 'flex-end' : 'flex-start',padding:'10px',margin:'10px'}}>
        <ListItem sx={{border:'1px solid lightgrey',width:'70%',borderRadius:'10px'}}>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={sender?.imageUrl} />
        </ListItemAvatar>
        <ListItemText
          secondary={`${message} - ${timestamp}`}
         
        />
      </ListItem>
    </Box>
  )
}

export default ChatMessage