import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../backend_helper';

function NotLoggedIn({children}) {
    if(isLoggedIn() === false){
        return children;
    }
    
    return <Navigate to="/dashboard"  />
}

export default NotLoggedIn