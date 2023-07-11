import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import * as React from 'react';

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