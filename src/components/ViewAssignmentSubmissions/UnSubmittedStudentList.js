import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function UnSubmittedStudentList({unSubmitted}) {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

      
        {
            unSubmitted && (
                unSubmitted.map(student => (
                    <ListItem key={student.email} alignItems="flex-start" sx={{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'space-between'
                      }}>
                        <ListItemAvatar>
                          <Avatar alt={student.email} src={student.imageUrl} />
                        </ListItemAvatar>
                        <ListItemText>
                        <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {student.email}
                              </Typography>
                        </ListItemText>
                          
                        
                              
                              
                            
                        
                      </ListItem>
                ))
            )
        }

      
      
    </List>
  );
}