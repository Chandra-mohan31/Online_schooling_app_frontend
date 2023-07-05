import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Delete } from '@mui/icons-material';
import { Box, Button, Tooltip } from '@mui/material';
import { deleteMaterial } from '../../backend_helper/studymaterialshelper';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate, useParams } from 'react-router-dom';

import DownloadIcon from '@mui/icons-material/Download';
import OfficeDocumentThumbnail from '../OfficeDocumenetThumbnail';


export default function MaterialPreviewCard({material,inStUp,isTeacher}) {

 
  const navigate = useNavigate();

 
  const deletePostedMaterial = async (materialId) => {
    const response = await deleteMaterial(materialId);
    inStUp();
  }

  return (
    <Card sx={{ width: 350,height:400 ,m:'10px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
 <Box>
 <CardHeader
  action={
    isTeacher && (
      <IconButton
        aria-label="settings"
        onClick={() => {
          console.log(`delete the material of ID: `, material?.id);
          deletePostedMaterial(material?.id);
        }}
      >
        <Delete color="error" />
      </IconButton>
    )
  }
  title={material.materialTitle}
  subheader={new Date(material.postedOn).toLocaleString()}
  subheaderTypographyProps={{ variant: 'caption' }} // Specify variant for the subheader
>
  
</CardHeader>


 </Box>

      {/* preview the file */}
      <CardContent sx={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between'
      }}>
        
        
        
       
        <div style={{
          cursor:'pointer'
        }} onClick={()=>{
          navigate(`/viewmaterial/${material?.id}`)
        }}>
        <OfficeDocumentThumbnail documentUrl={material?.materialContentUrl} />

          </div>
        <Button variant='outlined' color='secondary' sx={{
          width:'100%',
          

        }} onClick={()=>{
            navigate(`/viewmaterial/${material?.id}`);
        }}>OPEN MATERIAL</Button>
   
      </CardContent>
     
      <CardActions sx={{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }} >
        

        {!isTeacher ? (
          <Tooltip title={material?.email}>
          <Typography 
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '120px', 
              fontWeight: 'bold',
            }}
          variant="caption">
           
            {material?.email}
          </Typography>
          </Tooltip>
        ) : (
          <Typography variant='body2'>{material.className}</Typography>
        )}
        
        <Typography variant='body2'>{material.subjectName}</Typography>


        <a href={material?.materialContentUrl} target='_blank' style={{
          textDecoration:'none',
          color:'inherit'
        }}>
        {/* <Button variant='outlined' color="info">Download</Button> */}
        <IconButton>
          <DownloadIcon sx ={{
            fontSize:'30px'
          }} color='info' />
        </IconButton>

        </a>

        
        
      </CardActions>
      
    </Card>
  );
}