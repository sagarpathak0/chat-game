// pages/dashboard.tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useAuth } from '@/contexts/AuthContext'; // If you're using context for auth

const Dashboard = () => {
  const { isAuthenticated } = useAuth(); // Assuming you're using context to track auth
  const router = useRouter();

  // Client-side redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null; // Do not render the page while redirecting
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  );
};

// Server-side protection for the dashboard route
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  const token = cookies.token; // Assuming the token is stored as 'token'

  if (!token) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
