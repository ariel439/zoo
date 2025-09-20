
import React from 'react';
import { GoogleIcon, ZooLogo } from './Icons';

interface EmployeeLoginPageProps {
  setPage: (page: string) => void;
}

const EmployeeLoginPage: React.FC<EmployeeLoginPageProps> = ({ setPage }) => {
  
  const handleBackToSite = (e: React.MouseEvent) => {
    e.preventDefault();
    setPage('home');
  };
  
  const handleLogin = () => {
    setPage('dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-dark-bg text-light-cream p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: "url('https://i.imgur.com/xLJdJ8C.png')" }}
      ></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 w-full h-full bg-dark-bg/70"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-brand-brown rounded-xl shadow-2xl p-8 space-y-6 text-center border border-brand-gold/20">
        
        {/* Logo */}
        <div className="flex justify-center">
          <ZooLogo />
        </div>
        
        {/* Title */}
        <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold text-white">Acesso Restrito</h1>
            <p className="text-light-cream/80">
                Faça login com sua conta Google para acessar o painel de gerenciamento.
            </p>
        </div>

        {/* Login Button */}
        <div className="pt-4">
            <button 
                onClick={handleLogin}
                className="w-full flex items-center justify-center bg-light-cream text-dark-bg font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-brown focus:ring-brand-amber"
            >
                <GoogleIcon className="w-6 h-6 mr-3" />
                <span>Entrar com o Google</span>
            </button>
        </div>

        {/* Return Link */}
        <div className="pt-2">
            <a 
                href="#"
                onClick={handleBackToSite}
                className="text-sm text-brand-gold hover:underline transition-colors duration-300"
            >
                ← Voltar ao site principal
            </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLoginPage;
