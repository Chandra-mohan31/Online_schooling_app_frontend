import React from 'react'
import { isLoggedIn } from '../backend_helper'
import { Navigate } from 'react-router-dom'

function Protected({children}) {
    if(isLoggedIn() == false){
        return <Navigate to="/login" replace />
    }
    return children;
}

export default Protected