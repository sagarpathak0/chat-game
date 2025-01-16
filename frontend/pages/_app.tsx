// pages/_app.tsx
import '../styles/globals.css';  // Ensure this line is present
import { AppProps } from 'next/app'; // Import AppProps from Next.js

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <Component {...pageProps} />
  );
}

export default MyApp;
