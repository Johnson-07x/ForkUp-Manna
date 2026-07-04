import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthLayout } from '@/layouts/AuthLayout';
import { authApi } from '@/api/auth';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    try {
      await authApi.forgotPassword(values.email);
      setSubmitted(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardContent sx={{ p: 4 }}>
          {submitted ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Check your email
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                If an account exists with that email address, a password reset link has been sent.
              </Typography>
              <Button component={RouterLink} to="/login" variant="contained" fullWidth>
                Back to Sign in
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 3.5 }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: 2,
                  bgcolor: 'primary.main', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', mb: 2,
                }}>
                  <EmailIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Forgot your password?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter your email and we'll send you a reset link.
                </Typography>
              </Box>

              {serverError && (
                <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  label="Email address"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 3 }}
                  {...register('email')}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending…' : 'Send Reset Link'}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" align="center" color="text.secondary">
                Remember your password?{' '}
                <Link component={RouterLink} to="/login" color="primary" sx={{ fontWeight: 600 }}>
                  Sign in
                </Link>
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
