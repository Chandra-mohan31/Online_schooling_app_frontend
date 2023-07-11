import { Box, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { getMaterialsOfClass } from "../../backend_helper/studymaterialshelper";
import { getStudentClass } from '../../backend_helper/timetablehelper';
import { AuthContext } from '../../context/authContext';
import MaterialPreviewCard from './MaterialPreviewCard';



function StudyMaterialsStudent() {

  const [classMaterials, setClassMaterials] = useState();
  const [className, setClassName] = useState();
  const { loggedInUser } = useContext(AuthContext);
  const getStudentBelongingClassMaterials = async () => {
    if (loggedInUser) {
      const studentClassResponse = await getStudentClass(loggedInUser?.id);
      let belongingClass = studentClassResponse.studentClass.className;
      setClassName(belongingClass);
      const response = await getMaterialsOfClass(belongingClass);
      console.log(response);
      setClassMaterials(response?.classMaterials);
    }


  }



  useEffect(() => {
    getStudentBelongingClassMaterials();




  }, [])
  return (
    <Box>
    <Typography variant='h5' textAlign='center' sx={{
      margin:'10px',
      
    }}>Available Study Materials</Typography>
    <Box sx={{
      margin: '20px',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
  
      {
        classMaterials ? classMaterials.map(material => (
          <MaterialPreviewCard material={material} key={material.id} isTeacher={false} />
        )) :<Typography variant='body1' textAlign='center'>No Materials Found!</Typography>
      }
    </Box>
    </Box>

  )
}

export default StudyMaterialsStudent