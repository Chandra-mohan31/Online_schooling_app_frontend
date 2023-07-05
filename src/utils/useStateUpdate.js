import React, { useState } from "react";


export const useStateUpdate = (
    initialMode = false,
) =>{
    const [stUpVal,setStUpVal] = useState(initialMode);
   
    const triggerStateUpdate = () =>{
        setStUpVal(!stUpVal);
    }

    return {stUpVal,triggerStateUpdate};
}