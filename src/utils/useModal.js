import { useState } from "react";


export const useModal = (
    initialMode = false,
    initialTextMessage = ""
) =>{
    const [open,setOpen] = useState(initialMode);
    const [alertMessage,setAlertMessage] = useState(initialTextMessage);
    const openModal = () => {
        setOpen(true);
    }

    const closeModal = () => {
        setOpen(false);
    }

    const triggerNotification = (message) =>{
        setAlertMessage(message);
        openModal();
    }

    return {open,closeModal,openModal,alertMessage,setAlertMessage,triggerNotification};
}