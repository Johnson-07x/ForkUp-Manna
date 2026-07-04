import { Box, Button, Divider, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    color?: 'primary' | 'secondary';
  };
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.6, maxWidth: 600 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && (
          <Button
            variant="contained"
            color={action.color ?? 'primary'}
            onClick={action.onClick}
            startIcon={action.icon}
            size="large"
            sx={{ flexShrink: 0 }}
          >
            {action.label}
          </Button>
        )}
      </Box>
      <Divider sx={{ mt: 2.5 }} />
    </Box>
  );
}
