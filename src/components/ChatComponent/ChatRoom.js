import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import ChatMessage from './ChatMessage';
import { FieldValue, addDoc, collection, doc, setDoc ,serverTimestamp, getDocs, onSnapshot, query, where, and, or, orderBy} from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

function ChatRoom({userChattingWith,user,otherUsers}) {

    const [textMessage, setTextMessage] = useState('');
     const [textMessages,setTextMessages] = useState([]);
     const navigate = useNavigate();
    function combineUserIds(userId1, userId2) {
        const tmp = [userId1, userId2];
        const sortedIds = tmp.sort();
        const combinedId = sortedIds.join();
        return combinedId;
      }


    const sendMessage = async () => {
        console.log(textMessage);
        try {
            const docRef = await addDoc(collection(db, "messages"), {
              userA: user.id,
              userB: userChattingWith.id,
              timesent: (new Date()).toLocaleString(),
              message: textMessage,
              chatroomCode: combineUserIds(user.id,userChattingWith.id),
              timestamp:serverTimestamp()
            });
            console.log("Document written with ID: ", docRef.id);
            setTextMessage('');
              
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    const screenWidth = useMediaQuery('(min-width:700px)');
    const [selectedUser,setSelectedUser] = useState(null);


    const handleChangeChatUser = (event) => {
      const uName = event.target.value;
      setSelectedUser(uName);
      const u = otherUsers.find(usr => usr.userName == uName);
      if(u){
        navigate(`/chat/${u.id}`);
      }
    };


    const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
useEffect(()=>{
    // getMessages();
    const messagesRef = collection(db, "messages");
    if(user && userChattingWith){
    setSelectedUser(userChattingWith?.userName);
    const q = query(messagesRef, where("chatroomCode", "==", combineUserIds(user.id,userChattingWith.id)));

      onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map((doc) => doc.data());
        chats.sort((a, b) => a.timestamp - b.timestamp);
        scrollToBottom();

        setTextMessages(chats);

      });
      
    }

},[user,userChattingWith]);
    
    
    


    return (
        <Box sx={{
            flex: '70%',
            display:'flex',
            flexDirection:'column',
            border: '1px solid lightgrey',
            margin: '10px',
            padding: '10px',
            maxHeight:'80vh'
            
            
        }}>
{
  screenWidth ? (
<Typography variant='body1' textAlign='center'>{userChattingWith?.userName}</Typography>

  ) : (
    selectedUser && <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
    <Select
      labelId="demo-select-small-label"
      id="demo-select-small"
      value={selectedUser}
      label="userChattingWith"
      onChange={handleChangeChatUser}
    >
      
      {
        otherUsers?.map(u=>(
          <MenuItem id={u.id} value={u.userName}>{u.userName}</MenuItem>
        ))
      }
 
    </Select>
  </FormControl>
  )
}

            <Box sx={{minWidth:'100%',height:'70vh',overflowY:'scroll'}} ref={chatContainerRef} >
                
                {
                 
                   
              textMessages?.map(m=>(
                <ChatMessage sender={user.id == m.userA ? user : userChattingWith} message={m.message} timestamp={m.timesent} />

              ))
                        
              

                }

            </Box>

            <TextField
                label="your message"
                name='textMessage'

                onChange={(e) => {
                    setTextMessage(e.target.value);
                }}
                required
                variant="standard"
                color="info"
                type="text"
                value={textMessage}
                fullWidth
                sx={{
                    mb: 3,
                    alignSelf: 'flex-end'

                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end"><IconButton disabled={textMessage == '' ? true : false} onClick={sendMessage}><SendIcon /></IconButton></InputAdornment>

                }}

            />
        </Box>
    )
}

export default ChatRoom