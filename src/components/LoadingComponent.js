import { Box, CircularProgress } from '@mui/material'
import React from 'react'

function LoadingComponent() {
  return (
    <Box sx={{height:'80vh',display:'grid',placeItems:'center'}}>
    <CircularProgress  />
  </Box>
  )
}

export default LoadingComponent