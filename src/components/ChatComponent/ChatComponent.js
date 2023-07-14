import React, { useContext, useEffect, useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatRoom from './ChatRoom';
import { Box, useMediaQuery } from '@mui/material';
import { getUserDetails } from '../../backend_helper';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

function ChatComponent() {
    const [users, setUsers] = useState([]);
    const getAllUsersToChat = async () => {
        const response = await getUserDetails();
        console.log(response);
        setUsers(response);

    }

    const params = useParams();
    const userChatingWith = params.userId;
    const { loggedInUser } = useContext(AuthContext);

  const screenWidth = useMediaQuery('(min-width:700px)');
    
    useEffect(() => {
        getAllUsersToChat();

    }, [])
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row'
        }}>
            {
                (users && screenWidth) && <ChatSidebar users={users} userChatingWith={userChatingWith} />}
            {
                users && <ChatRoom userChattingWith={users.find(u => u.id == userChatingWith) } user={loggedInUser} otherUsers={users} />
            }
        </Box>
    )
}

export default ChatComponent