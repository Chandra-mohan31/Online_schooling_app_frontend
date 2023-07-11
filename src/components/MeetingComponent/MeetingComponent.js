import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getUserDetails } from '../../backend_helper';




export function getUrlParams(
  url = window.location.href
) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function MeetingComponent() {
    //   const roomID = getUrlParams().get('roomID'); 
      const params = useParams();
      const roomID = params.roomID;
      const {loggedInUser} = useContext(AuthContext);
      console.log(loggedInUser);
      const [usersDetails,setUsersDetails] = useState([]);
      const userName = loggedInUser?.userName;
      const userID = loggedInUser?.id;
      const navigate = useNavigate();
     let myMeeting = async (element) => {
     const AppID = 71715708;
     console.log(AppID);
    const serverSecret = process.env.REACT_APP_ZEGO_SECRET;
      
    const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(AppID, serverSecret, roomID, userID,userName);
      

     // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      // start the call
      if(loggedInUser && zp && usersDetails.length > 0){
        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: 'Personal link',
              url:
               window.location.protocol + '//' + 
               window.location.host + window.location.pathname +
                '?roomID=' +
                roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
          },
          maxUsers: 100,
          onUserAvatarSetter:(userList)=>{
            userList.forEach(user => {
              
              const currUser = usersDetails.find(u => u.id === user.userID);
              
              user.setUserAvatar(currUser?.imageUrl)
              
            })
          }
        });
      }


  };

  useEffect(()=>{
    
    getUserDetails().then(data=>{
      // console.log(data);
      setUsersDetails(data);
    })
  },[JSON.stringify(usersDetails)])

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}