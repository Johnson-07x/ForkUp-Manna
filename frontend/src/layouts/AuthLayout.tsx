import { Box, Container, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left panel — brand story */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '42%',
          flexShrink: 0,
          p: 6,
          background: 'linear-gradient(160deg, #0B3D26 0%, #147A54 55%, #1A9060 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -60, left: -60,
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(201,89,10,0.18)',
        }} />
        <Box sx={{
          position: 'absolute', top: '40%', right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(255,255,255,0.035)',
        }} />

        {/* Logo */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: 2.5,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              🍽️
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.3rem', lineHeight: 1 }}>
                ForkUp
              </Typography>
              <Typography sx={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase' }}>
                Manna
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tagline + mission */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            sx={{
              color: '#FFFFFF',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 2.5,
            }}
          >
            Turning surplus<br />into sustenance.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '1rem', lineHeight: 1.7, mb: 4 }}>
            ForkUp Manna connects generous donors with people in need,
            delivered by volunteers who care — making every meal count.
          </Typography>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            {[
              { value: '2,400+', label: 'Meals shared' },
              { value: '380+', label: 'Donors' },
              { value: '120+', label: 'Volunteers' },
            ].map((s) => (
              <Box key={s.label}>
                <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>
                  {s.value}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', mt: 0.25 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Testimonial quote */}
        <Box sx={{
          position: 'relative', zIndex: 1,
          borderLeft: '3px solid rgba(201,89,10,0.7)',
          pl: 2,
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.80)', fontStyle: 'italic', fontSize: '0.875rem', lineHeight: 1.7 }}>
            "Because of ForkUp Manna, our family has warm meals
            three times a week. We are truly grateful."
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', mt: 0.75 }}>
            — Receiver, Chennai
          </Typography>
        </Box>
      </Box>

      {/* Right panel — form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5F2EC',
          py: 4,
          px: 2,
          position: 'relative',
        }}
      >
        {/* Subtle top-right accent */}
        <Box sx={{
          position: 'absolute', top: 0, right: 0,
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(20,122,84,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 4, alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#147A54' }}>
              🍽️ ForkUp Manna
            </Typography>
          </Box>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
