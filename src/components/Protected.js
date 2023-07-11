import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../backend_helper';

function Protected({children}) {
    if(isLoggedIn() == false){
        return <Navigate to="/login" />
    }
    return children;
}

export default Protected