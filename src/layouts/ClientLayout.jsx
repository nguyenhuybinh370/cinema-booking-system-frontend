import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const ClientLayout = () => (
  <div className="min-h-screen bg-(--client-bg) text-(--client-text)">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default ClientLayout;
