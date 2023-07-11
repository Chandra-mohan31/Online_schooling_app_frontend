import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearLoading({children}) {
  return (
    <Box sx={{ width: '100%' }}>
      {children}
      <LinearProgress color='info' />
    </Box>
  );
}