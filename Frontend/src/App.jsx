import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
// import { AuthProvider } from './context/Auth.context';
import { useEffect, useState } from 'react';
import Loading from './components/Loading';
import axios from 'axios';
import getBaseUrl from './utils/baseURl';

function App() {
  useEffect(() => {
    const recordVisit = async () => {
      try {
        await axios.post(`${getBaseUrl()}/admin/record-visit`);
      } catch (error) {
        console.error('Failed to record visit:', error);
        }
    };

    recordVisit();
  }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />; 
  }

  return (
    <>
      {/* <AuthProvider> */}
        <Navbar />
        <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'>
          <Outlet />
        </main>
        <Footer />
      {/* </AuthProvider> */}

    </>
  )
}

export default App