
import React from 'react';
import Navbar from './components/Navbar';
import ToastNotification from './components/ToastNotification';
import { ApiError } from './utils/apiError';
import HeroCarousel from './components/HeroCarousel';
import AboutUs from './components/AboutUs';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';
import AnimalGalleryPage from './pages/AnimalGalleryPage';
import VisitContactPage from './pages/VisitContactPage';
import EmployeeLoginPage from './pages/EmployeeLoginPage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  const [page, setPage] = React.useState('home');

  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<'success' | 'error'>('success');

  const showAppToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const hideAppToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  if (page === 'login') {
    return <EmployeeLoginPage setPage={setPage} />;
  }
  
  if (page === 'dashboard') {
    return <DashboardPage setPage={setPage} showToast={showAppToast} />;
  }

  return (
    <div className="bg-dark-bg font-sans text-light-cream">
      <Navbar currentPage={page} setPage={setPage} />
      <main>
        {page === 'home' && (
          <>
            <HeroCarousel />
            <AboutUs />
            <TeamSection />
          </>
        )}
        {page === 'animals' && <AnimalGalleryPage />}
        {page === 'visit' && <VisitContactPage />}
      </main>
      <Footer />
      {showToast && (
        <ToastNotification
            message={toastMessage}
            onClose={hideAppToast}
            type={toastType}
        />
      )}
    </div>
  );
};

export default App;