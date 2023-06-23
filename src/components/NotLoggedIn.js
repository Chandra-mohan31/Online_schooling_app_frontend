import React from 'react'
import { isLoggedIn } from '../backend_helper'
import { Navigate } from 'react-router-dom'

function NotLoggedIn({children}) {
    if(isLoggedIn() == false){
        return children;
    }
    
    return <Navigate to="/dashboard" replace={false} />
}

export default NotLoggedIn