import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import * as React from 'react';

export default function LinearLoading({children}) {
  return (
    <Box sx={{ width: '100%' }}>
      {children}
      <LinearProgress color='info' />
    </Box>
  );
}