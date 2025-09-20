
import React from 'react';
import Navbar from './components/Navbar';
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

  if (page === 'login') {
    return <EmployeeLoginPage setPage={setPage} />;
  }
  
  if (page === 'dashboard') {
    return <DashboardPage setPage={setPage} />;
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
    </div>
  );
};

export default App;