import { createTheme, alpha } from '@mui/material/styles';

// ── Brand palette ──────────────────────────────────────────────────────────
// ForkUp Manna: food rescue platform — warm, earthy, purposeful
//   Primary   · Emerald green  → freshness, abundance, hope
//   Secondary · Saffron amber  → warmth, cooked food, harvest
//   Background· Warm linen     → welcoming, not clinical
const EMERALD = {
  50:  '#E8F4EF',
  100: '#C3E2D3',
  200: '#9ACFB5',
  300: '#6DBB96',
  400: '#4CAD7D',
  500: '#1F9E64',
  main: '#147A54',   // primary.main — rich, clear emerald
  dark: '#0B5038',
  900: '#07321F',
  contrastText: '#FFFFFF',
};

const SAFFRON = {
  50:  '#FDF3E7',
  100: '#FAE0BE',
  200: '#F5C88C',
  light: '#E8793A',
  main: '#C9590A',   // secondary.main — deep saffron-burnt orange
  dark: '#9E4208',
  contrastText: '#FFFFFF',
};

const SIDEBAR_BG   = '#0C2318';   // near-black forest green for sidebar
const SIDEBAR_TEXT = '#D4E8DC';   // muted sage on dark
const WARM_BG      = '#F5F2EC';   // linen/parchment background
const WARM_DIVIDER = 'rgba(20, 122, 84, 0.10)';

// ── Theme ──────────────────────────────────────────────────────────────────
const theme = createTheme({
  cssVariables: false,

  palette: {
    primary: {
      main:          EMERALD.main,
      light:         EMERALD[400],
      dark:          EMERALD.dark,
      contrastText:  '#FFFFFF',
    },
    secondary: {
      main:          SAFFRON.main,
      light:         SAFFRON.light,
      dark:          SAFFRON.dark,
      contrastText:  '#FFFFFF',
    },
    success: {
      main: '#1B8A52',
      light: '#43C47A',
      dark: '#0D5A34',
    },
    warning: {
      main: '#C98A0A',
      light: '#F5B83A',
      dark: '#9A6400',
    },
    error: {
      main: '#C0392B',
      light: '#E05040',
      dark: '#8E2219',
    },
    info: {
      main: '#1565A8',
      light: '#3A84CE',
      dark: '#0C4078',
    },
    background: {
      default: WARM_BG,
      paper:   '#FFFFFF',
    },
    divider: WARM_DIVIDER,
    text: {
      primary:   '#1A2820',
      secondary: '#4D6257',
      disabled:  '#94A89D',
    },
  },

  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.5px' },
    h2: { fontWeight: 800, letterSpacing: '-0.25px' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700, letterSpacing: '-0.25px' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
    button: { fontWeight: 700, letterSpacing: '0.01em' },
    caption: { letterSpacing: '0.01em' },
  },

  shape: { borderRadius: 12 },

  shadows: [
    'none',
    `0 1px 3px ${alpha(EMERALD.main, 0.06)}, 0 1px 2px rgba(0,0,0,0.04)`,
    `0 2px 6px ${alpha(EMERALD.main, 0.08)}, 0 1px 3px rgba(0,0,0,0.05)`,
    `0 4px 12px ${alpha(EMERALD.main, 0.10)}, 0 2px 4px rgba(0,0,0,0.06)`,
    `0 6px 16px ${alpha(EMERALD.main, 0.10)}, 0 3px 6px rgba(0,0,0,0.06)`,
    `0 8px 24px ${alpha(EMERALD.main, 0.12)}, 0 4px 8px rgba(0,0,0,0.06)`,
    `0 10px 28px ${alpha(EMERALD.main, 0.12)}, 0 5px 10px rgba(0,0,0,0.07)`,
    `0 12px 32px ${alpha(EMERALD.main, 0.13)}, 0 6px 12px rgba(0,0,0,0.07)`,
    `0 14px 36px ${alpha(EMERALD.main, 0.13)}, 0 7px 14px rgba(0,0,0,0.07)`,
    `0 16px 40px ${alpha(EMERALD.main, 0.14)}, 0 8px 16px rgba(0,0,0,0.08)`,
    `0 18px 44px ${alpha(EMERALD.main, 0.14)}, 0 9px 18px rgba(0,0,0,0.08)`,
    `0 20px 48px ${alpha(EMERALD.main, 0.15)}, 0 10px 20px rgba(0,0,0,0.08)`,
    `0 22px 52px ${alpha(EMERALD.main, 0.15)}, 0 11px 22px rgba(0,0,0,0.09)`,
    `0 24px 56px ${alpha(EMERALD.main, 0.16)}, 0 12px 24px rgba(0,0,0,0.09)`,
    `0 26px 60px ${alpha(EMERALD.main, 0.16)}, 0 13px 26px rgba(0,0,0,0.09)`,
    `0 28px 64px ${alpha(EMERALD.main, 0.17)}, 0 14px 28px rgba(0,0,0,0.10)`,
    `0 30px 68px ${alpha(EMERALD.main, 0.17)}, 0 15px 30px rgba(0,0,0,0.10)`,
    `0 32px 72px ${alpha(EMERALD.main, 0.18)}, 0 16px 32px rgba(0,0,0,0.10)`,
    `0 34px 76px ${alpha(EMERALD.main, 0.18)}, 0 17px 34px rgba(0,0,0,0.11)`,
    `0 36px 80px ${alpha(EMERALD.main, 0.19)}, 0 18px 36px rgba(0,0,0,0.11)`,
    `0 38px 84px ${alpha(EMERALD.main, 0.19)}, 0 19px 38px rgba(0,0,0,0.11)`,
    `0 40px 88px ${alpha(EMERALD.main, 0.20)}, 0 20px 40px rgba(0,0,0,0.12)`,
    `0 42px 92px ${alpha(EMERALD.main, 0.20)}, 0 21px 42px rgba(0,0,0,0.12)`,
    `0 44px 96px ${alpha(EMERALD.main, 0.21)}, 0 22px 44px rgba(0,0,0,0.12)`,
    `0 46px 100px ${alpha(EMERALD.main, 0.21)}, 0 23px 46px rgba(0,0,0,0.13)`,
  ],

  components: {
    // ── Button ──────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.925rem',
          fontWeight: 700,
          transition: 'all 0.18s ease',
        },
        sizeLarge: { padding: '13px 32px', fontSize: '1rem' },
        sizeSmall: { padding: '6px 16px', fontSize: '0.8125rem' },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: `linear-gradient(135deg, ${EMERALD.main} 0%, ${EMERALD.dark} 100%)`,
            boxShadow: `0 4px 14px ${alpha(EMERALD.main, 0.35)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${EMERALD[400]} 0%, ${EMERALD.main} 100%)`,
              boxShadow: `0 6px 20px ${alpha(EMERALD.main, 0.45)}`,
              transform: 'translateY(-1px)',
            },
            '&:active': { transform: 'translateY(0)' },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            background: `linear-gradient(135deg, ${SAFFRON.light} 0%, ${SAFFRON.main} 100%)`,
            boxShadow: `0 4px 14px ${alpha(SAFFRON.main, 0.30)}`,
            '&:hover': {
              boxShadow: `0 6px 20px ${alpha(SAFFRON.main, 0.40)}`,
              transform: 'translateY(-1px)',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: alpha(EMERALD.main, 0.5),
            '&:hover': {
              borderColor: EMERALD.main,
              background: alpha(EMERALD.main, 0.06),
            },
          },
        },
      ],
    },

    // ── Card ────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: `0 2px 12px ${alpha(EMERALD.main, 0.08)}, 0 1px 4px rgba(0,0,0,0.05)`,
          border: `1px solid ${alpha(EMERALD.main, 0.07)}`,
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        },
      },
    },

    // ── Paper ───────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
        elevation1: {
          boxShadow: `0 2px 12px ${alpha(EMERALD.main, 0.08)}, 0 1px 4px rgba(0,0,0,0.05)`,
        },
      },
    },

    // ── TextField ───────────────────────────────────────────────────────
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            background: alpha(EMERALD.main, 0.022),
            transition: 'background 0.15s',
            '&:hover': { background: alpha(EMERALD.main, 0.04) },
            '&.Mui-focused': { background: '#FFFFFF' },
            '& fieldset': { borderColor: alpha(EMERALD.main, 0.22) },
            '&:hover fieldset': { borderColor: alpha(EMERALD.main, 0.50) },
            '&.Mui-focused fieldset': { borderColor: EMERALD.main },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: EMERALD.main },
        },
      },
    },

    // ── Chip ────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.78rem' },
        colorSuccess: {
          background: alpha('#1B8A52', 0.12),
          color: '#0D5A34',
          '& .MuiChip-icon': { color: '#1B8A52' },
        },
        colorWarning: {
          background: alpha('#C98A0A', 0.12),
          color: '#7A5200',
        },
        colorError: {
          background: alpha('#C0392B', 0.11),
          color: '#8E2219',
        },
        colorInfo: {
          background: alpha('#1565A8', 0.10),
          color: '#0C4078',
        },
        colorPrimary: {
          background: alpha(EMERALD.main, 0.12),
          color: EMERALD.dark,
        },
      },
    },

    // ── Table ───────────────────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            background: alpha(EMERALD.main, 0.05),
            fontWeight: 700,
            fontSize: '0.775rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#4D6257',
            borderBottom: `2px solid ${alpha(EMERALD.main, 0.12)}`,
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root:last-child .MuiTableCell-root': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { background: alpha(EMERALD.main, 0.025) },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha(EMERALD.main, 0.08),
          fontSize: '0.875rem',
          padding: '14px 16px',
        },
      },
    },

    // ── Tabs ────────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: `linear-gradient(90deg, ${EMERALD.main}, ${EMERALD[400]})`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 44,
          '&.Mui-selected': { color: EMERALD.main },
        },
      },
    },

    // ── AppBar ──────────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          color: '#1A2820',
          borderBottom: `1px solid ${alpha(EMERALD.main, 0.10)}`,
        },
      },
    },

    // ── Drawer ──────────────────────────────────────────────────────────
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: SIDEBAR_BG,
          color: SIDEBAR_TEXT,
          borderRight: 'none',
          boxShadow: `4px 0 24px rgba(0,0,0,0.18)`,
        },
      },
    },

    // ── Divider ─────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: alpha(EMERALD.main, 0.10) },
      },
    },

    // ── Badge ───────────────────────────────────────────────────────────
    MuiBadge: {
      styleOverrides: {
        colorError: {
          background: SAFFRON.main,
          color: '#FFFFFF',
        },
      },
    },

    // ── Alert ───────────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },

    // ── Dialog ──────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: `0 24px 64px rgba(0,0,0,0.18)`,
        },
      },
    },

    // ── Popover ─────────────────────────────────────────────────────────
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          boxShadow: `0 8px 40px rgba(0,0,0,0.14)`,
          border: `1px solid ${alpha(EMERALD.main, 0.08)}`,
        },
      },
    },

    // ── Tooltip ─────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: SIDEBAR_BG,
          fontSize: '0.78rem',
          borderRadius: 6,
          padding: '6px 12px',
        },
      },
    },

    // ── Skeleton ────────────────────────────────────────────────────────
    MuiSkeleton: {
      styleOverrides: {
        root: { background: alpha(EMERALD.main, 0.08) },
      },
    },

    // ── Link ────────────────────────────────────────────────────────────
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        },
      },
    },

    // ── Stepper ─────────────────────────────────────────────────────────
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: alpha(EMERALD.main, 0.25),
          '&.Mui-active': { color: EMERALD.main },
          '&.Mui-completed': { color: '#1B8A52' },
        },
      },
    },
  },
});

// Export sidebar constants for use in components
export const SIDEBAR = {
  bg:          SIDEBAR_BG,
  text:        SIDEBAR_TEXT,
  activeText:  '#FFFFFF',
  activeBg:    alpha(EMERALD.main, 0.30),
  hoverBg:     alpha('#FFFFFF', 0.07),
  iconColor:   alpha(SIDEBAR_TEXT, 0.7),
  divider:     alpha('#FFFFFF', 0.10),
  badge:       SAFFRON.main,
};

export const BRAND = {
  gradient: `linear-gradient(135deg, ${EMERALD.main} 0%, ${EMERALD.dark} 100%)`,
  gradientWarm: `linear-gradient(135deg, ${SAFFRON.light} 0%, ${SAFFRON.main} 100%)`,
  gradientAuth: `linear-gradient(145deg, #0B3D26 0%, #1A6B4A 40%, #C9590A 100%)`,
};

export default theme;
