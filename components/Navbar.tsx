
import React from 'react';
import { ZooLogo } from './Icons';

const navLinks = [
  { name: "Início", id: "home" },
  { name: "Nossos Animais", id: "animals" },
  { name: "Visite-nos", id: "visit" },
];


interface NavbarProps {
  currentPage: string;
  setPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleNavClick = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault();
    setPage(pageId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
             <button
                onClick={() => setPage('home')}
                aria-label="Voltar para a página inicial"
                className="focus:outline-none focus:ring-2 focus:ring-brand-gold rounded-lg"
              >
                <ZooLogo />
              </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href="#"
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    currentPage === link.id
                      ? (link.id === 'visit' ? 'text-brand-amber font-bold' : 'text-brand-gold')
                      : 'text-light-cream hover:bg-brand-brown hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
             <button onClick={() => setPage('login')} className="bg-brand-gold text-dark-bg font-bold py-2 px-4 rounded-lg hover:bg-brand-gold-dark transition-all duration-300 shadow-lg">
                Login
              </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-brand-brown inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href="#"
                onClick={(e) => handleNavClick(e, link.id)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                  currentPage === link.id
                    ? (link.id === 'visit' ? 'text-brand-amber bg-brand-brown font-bold' : 'text-brand-gold bg-brand-brown')
                    : 'text-light-cream hover:bg-brand-brown hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
             <button onClick={() => setPage('login')} className="w-full mt-2 bg-brand-gold text-dark-bg font-bold py-2 px-4 rounded-lg hover:bg-brand-gold-dark transition-all duration-300 shadow-lg">
                Login
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
