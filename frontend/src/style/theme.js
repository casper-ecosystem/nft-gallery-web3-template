import { extendTheme } from '@chakra-ui/react';

export const mainTheme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: 'Public Sans, sans-serif',
        mx: '0',
        marginInlineStart: '0',
      },
    },
  },
  colors: {
    grey: {
      50: '#ffffff',
      100: '#e6e6e6',
      150: '#cccccc',
      200: '#b3b3b3',
      250: '#999999',
      300: '#808080',
      350: '#666666',
      400: '#333333',
    },
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    '2xl': '1600px',
  },
});
