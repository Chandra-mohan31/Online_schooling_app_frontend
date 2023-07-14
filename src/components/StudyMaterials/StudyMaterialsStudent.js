import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { getMaterialsOfClass } from "../../backend_helper/studymaterialshelper";
import { getStudentClass } from '../../backend_helper/timetablehelper';
import { AuthContext } from '../../context/authContext';
import MaterialPreviewCard from './MaterialPreviewCard';
import debounce from 'lodash.debounce';
import { Clear, Search } from '@mui/icons-material';



function StudyMaterialsStudent() {

  const [classMaterials, setClassMaterials] = useState();
  const [tmpStoreAllMaterials,setTempStoreAllMaterial] = useState([]);
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
      setTempStoreAllMaterial(response?.classMaterials);
    }


  }

  const filterMaterials = (materials,titlePrefix) => {
    const filteredMaterials = [];
    console.log(materials);
    for (const material of materials) {
      const title = material?.materialTitle?.toLowerCase();
      if (title.startsWith(titlePrefix.toLowerCase())) {
        filteredMaterials.push(material);
      }
    }
    console.log(filteredMaterials);
    return filteredMaterials;
  };
  const [searchMaterialTitle,setSearchMaterialTitle] = useState('');



  const debouncedSearch = React.useCallback(
    debounce(async (query,materials) => {
      
      if(query == ''){
        setClassMaterials(materials);
      }else{
        
        setClassMaterials(filterMaterials(materials,query));

        
      }
    }, 500), 
    []
  );

  const handleQueryChange = (e) => {
      setSearchMaterialTitle(e.target.value);
      debouncedSearch(e.target.value,tmpStoreAllMaterials);
      
  }
  useEffect(() => {
    getStudentBelongingClassMaterials();




  }, [])
  return (
    <Box>
    <Box sx={{
      display:'grid',
      placeItems:'center'
    }}>
    <Box sx={{
      display:'flex',
      flexDirection:'column',
      alignItems:'center'
    }}>
    <Typography variant='h5' textAlign='center' sx={{
      margin:'10px',
      
    }}>Study Materials</Typography>
    <TextField
                        label="search"
                        name='search'
                        onChange={handleQueryChange}
                        variant="standard"
                        color="info"
                        type="text"
                        value={searchMaterialTitle}
                        fullWidth
                        sx={{ m: 4 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Search  /></InputAdornment>,
                          endAdornment: <InputAdornment position='end'><IconButton onClick={()=>{
                              setSearchMaterialTitle('');
                              setClassMaterials(tmpStoreAllMaterials);
                          }}><Clear /></IconButton></InputAdornment>

                        }}
                    />
    </Box>
    </Box>
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