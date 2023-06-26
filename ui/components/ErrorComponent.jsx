/* eslint-disable react/prop-types */
import { Box, Typography } from '@mui/material';
import { purple, deepPurple } from '@mui/material/colors';

export function Error({ statusCode, message }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: statusCode > 404 ? purple[500] : deepPurple[500],
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        {statusCode}
      </Typography>
      <Typography variant="h4" style={{ color: 'white' }}>
        {message}
      </Typography>
    </Box>
  );
}