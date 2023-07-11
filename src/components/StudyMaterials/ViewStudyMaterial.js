import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMaterialInfo } from '../../backend_helper/studymaterialshelper';
import TextViewer from '../TextViewer';

function ViewStudyMaterial() {
    const params = useParams();
    const materialId = params.materialId;
    const [material,setMaterial] = useState();

    const getMaterialDetails = async () =>{
        const response = await getMaterialInfo(materialId);   
        console.log(response);
        setMaterial(response.classMaterials);
    }
    const isOfficeViewableFunc = (contentValue) => {
        const isPPT = contentValue?.endsWith('.ppt') || contentValue?.endsWith('.pptx');
        const isDOC = contentValue?.endsWith('.doc') || contentValue?.endsWith('.docx');
        const isXLS = contentValue?.endsWith('.xls') || contentValue?.endsWith('.xlsx');
      
        

        const isOfficeViewable = isPPT || isDOC || isXLS;
        if(isOfficeViewable){
            return true;
        }
    }   

    const isImageFunc = (contentUri) => {
        const isIMG = contentUri?.endsWith('.jpg') ||  contentUri?.endsWith('.jpeg') ||  contentUri?.endsWith('.png');
        return isIMG;
    }


    const isPDF = (uri) => uri?.endsWith('.pdf');
        
        
    const isTXT =  (uri) => uri?.endsWith('.txt');


    useEffect(()=>{
        if(materialId){
        getMaterialDetails();

        }
    },[])
  return (
    <Box>
        
        <Box className='material_infobox'>
  
        
        <Box sx={{
            display:'grid',
            placeItems:'center',
            padding:'10px'
        }}>
            <Box>
            <Typography textAlign='center' sx={{
            margin:'10px',
            fontWeight:'bold',
            color:'#1F6E8C'
        }} variant='h5'>{material?.materialTitle}</Typography>
                <span style={{
                    color:'#B73E3E',
                    fontWeight:'bold'
                }}>Description : &nbsp;</span>{material?.description}
            </Box>
            </Box>
           
            <Box sx={{
                display:'grid',
                placeItems:'center',
                margin:'20px'

            }}>


                {
                 isOfficeViewableFunc(material?.materialContentUrl) ?
                  (
                    <iframe
                title={'DOC-Viewer'}
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${material?.materialContentUrl}`}
                frameBorder={0}
                style={{ height: '80vh', width: '80vw' }}></iframe>
                 ):(
                    isImageFunc(material?.materialContentUrl) ? (
                        <img src={material?.materialContentUrl} alt='image' style={{
                            height:'50vh',
                            width:'50vh',
                            objectFit:'contain'
                        }} />
                    ) :(
                        isPDF(material?.materialContentUrl) ? (
                            <iframe
                title={'DOC-Viewer'}
                src={`${material?.materialContentUrl}`}
                frameBorder={0}
                style={{ height: '80vh', width: '80vw' }}></iframe>
                        ) : (
                            isTXT(material?.materialContentUrl) ? (
                                <TextViewer url={material?.materialContentUrl} />
                            ) : null
                        )
                    )
                 )


                }
                
                </Box>
        </Box>
        <Box  sx={{
            display:'flex',
            flexDirection:{
                xs:'column',
                md:'row'
            },
            justifyContent:{
                xs:'center',
                md:'space-between'
            },
            alignItems:'center',
            margin:'10px'
        }} >
                 <Box>
                <Typography  sx={{
                    margin:'10px'
                }}><span style={{
                    color:'#B73E3E',
                    fontWeight:'bold'
                }}>Subject : &nbsp;</span>{material?.subjectName}</Typography>
            </Box>
            <Box>
                <Typography  sx={{
                    margin:'10px',
                    fontWeight:'bold'
                }}><span style={{
                    color:'#B73E3E'
                }}>Teacher Email : &nbsp;</span>{material?.email}</Typography>
                <Typography  sx={{
                    margin:'10px',
                    fontWeight:'bold'
                }}><span style={{
                    color:'#B73E3E',
                    fontWeight:'bold'
                }}>Posted On : &nbsp;</span>{(new Date(material?.postedOn)).toLocaleString()}</Typography>

            </Box>
            
        </Box>
    </Box>
  )
}

export default ViewStudyMaterial