import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { PageHeader } from '@/components/common/PageHeader';
import { useChangePassword } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';

const ROLE_COLOR: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
  DONOR:     'success',
  RECEIVER:  'info',
  VOLUNTEER: 'warning',
  ADMIN:     'error',
};

function stringAvatar(name: string) {
  const parts = name.trim().split(' ');
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();
}

export function ProfilePage() {
  const { data: user, isLoading } = useProfile();
  const { mutate: update, isPending: saving } = useUpdateProfile();
  const { mutate: changePassword, isPending: changingPassword } = useChangePassword();
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSave = () => {
    let valid = true;
    setNameError('');
    setPhoneError('');

    if (!name.trim() || name.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      valid = false;
    }
    if (!phone.trim() || !/^[0-9+\-\s()]{7,15}$/.test(phone.trim())) {
      setPhoneError('Enter a valid phone number.');
      valid = false;
    }

    if (!valid) return;

    update(
      { name: name.trim(), phone: phone.trim() },
      { onSuccess: () => setEditing(false) }
    );
  };

  const handleCancel = () => {
    if (user) { setName(user.name); setPhone(user.phone); }
    setNameError('');
    setPhoneError('');
    setEditing(false);
  };

  const handleChangePassword = () => {
    setPwdError('');
    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwdError('New passwords do not match.');
      return;
    }
    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setChangingPwd(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Alert severity="error">Failed to load profile.</Alert>;
  }

  return (
    <Box>
      <PageHeader
        title="My Profile"
        subtitle="View and manage your account details"
      />

      <Grid container spacing={3} sx={{ maxWidth: 800 }}>
        {/* Avatar card */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 96, height: 96, bgcolor: 'primary.main',
                  fontSize: 32, mx: 'auto', mb: 2,
                }}
              >
                {stringAvatar(user.name)}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user.email}
              </Typography>
              <Chip
                label={user.role}
                color={ROLE_COLOR[user.role] ?? 'default'}
                size="small"
                variant="outlined"
              />
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={user.status}
                  color={user.status === 'ACTIVE' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Details card */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Account Details
                </Typography>
                {!editing && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              {editing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                  />
                  <TextField
                    label="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={!!phoneError}
                    helperText={phoneError}
                  />
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { icon: <PersonIcon fontSize="small" color="action" />, label: 'Full name', value: user.name },
                    { icon: <EmailIcon fontSize="small" color="action" />, label: 'Email address', value: user.email },
                    { icon: <PhoneIcon fontSize="small" color="action" />, label: 'Phone number', value: user.phone },
                  ].map((field) => (
                    <Box key={field.label}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {field.icon}
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {field.label}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500, pl: 3 }}>
                        {field.value}
                      </Typography>
                      <Divider sx={{ mt: 1.5 }} />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Security note */}
          <Alert severity="info" sx={{ mt: 3 }}>
            Your email and role cannot be changed. Contact an administrator if you need assistance.
          </Alert>

          {/* Change Password */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: changingPwd ? 2 : 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon fontSize="small" color="action" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Password</Typography>
                </Box>
                {!changingPwd && (
                  <Button variant="outlined" size="small" onClick={() => setChangingPwd(true)}>
                    Change Password
                  </Button>
                )}
              </Box>
              {changingPwd && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {pwdError && <Alert severity="error">{pwdError}</Alert>}
                  <TextField
                    label="Current password"
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPasswords((p) => !p)} edge="end">
                              {showPasswords ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField
                    label="New password"
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <TextField
                    label="Confirm new password"
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                    >
                      {changingPassword ? 'Saving…' : 'Update Password'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setChangingPwd(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                        setPwdError('');
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
