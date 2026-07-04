import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export function UnauthorizedPage() {
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
      <LockIcon sx={{ fontSize: 64, color: 'warning.main' }} />
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary">
        You do not have permission to view this page.
      </Typography>
      <Button component={RouterLink} to="/dashboard" variant="contained">
        Back to Dashboard
      </Button>
    </Box>
  );
}
