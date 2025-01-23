import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@/context/themeContext';
import '@/styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;