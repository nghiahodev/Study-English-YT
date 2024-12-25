import { createTheme } from '@mui/material/styles'

const getTheme = (mode) =>
  createTheme({
    // Common app settings
    app: {
      headerHeight: '56px',
      sidebarWidth: '300px',
      border: '1px solid #ddd',
      highlight: '#fffad2'
    },
    typography: {
      fontFamily: 'Nunito, sans-serif'
    },
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#0077B6' : '#00e1e3', // Ocean blue (main color)
        contrastText: '#ffffff' // Text color for buttons or components with this color
      },
      secondary: {
        main: '#00B4D8' // Lighter blue for secondary actions,
      },
      background: {
        default: mode === 'light' ? '#f1f5f8' : '#062a3f', // Light background for light mode, dark for dark mode
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e', // Paper background color
        highlight: mode === 'light' ? '#e2f6ff' : '#34526b'
      },
      text: {
        primary: mode === 'light' ? '#000' : '#f1f1f1', // Primary text color
        secondary: mode === 'light' ? '#3b3b3b' : '#dfdfdf' // Secondary text color
      },
      divider: mode === 'light' ? '#e0e0e0' : '#333333', // Divider line color
      action: {
        active: '#ed6c02'
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            '*::-webkit-scrollbar': {
              width: '8px',
              height: '8px' // Horizontal scrollbar height if needed
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: '#0077B6', // Ocean blue for the scrollbar thumb
              borderRadius: '10px',
              border: '2px solid transparent',
              backgroundClip: 'content-box',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#005f8b' // Darker ocean blue when hovered
              }
            },
            '*::-webkit-scrollbar-track': {
              backgroundColor: mode === 'light' ? '#f5f5f5' : '#2c2c2c' // Track color depending on the mode
            }
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: '#959595' // Icons will have the ocean blue color
          }
        }
      }
    }
  })

export default getTheme
