import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h1" color="primary" sx={{ fontWeight: 700, fontSize: '6rem', lineHeight: 1 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary">
        The page you are looking for does not exist.
      </Typography>
      <Button
        component={RouterLink}
        to="/dashboard"
        variant="contained"
        startIcon={<HomeIcon />}
        sx={{ mt: 1 }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}
