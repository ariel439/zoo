
import React from 'react';
import { ZooLogo, TwitterIcon, InstagramIcon, FacebookIcon } from './Icons';

const navLinks = ["Início", "Nossos Animais", "Visite-nos"];

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-brown text-light-cream">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-center lg:text-left">
          {/* Column 1: Logo and Copyright */}
          <div className="space-y-4 flex flex-col items-center lg:items-start">
            <ZooLogo />
            <p className="text-sm text-gray-400">
              © 2025 Plataforma Santuário. Todos os direitos reservados.
            </p>
          </div>

          {/* Column 2: Links and Social */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Links Rápidos</h3>
              <ul className="mt-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-base text-light-cream hover:text-brand-gold transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Siga-nos</h3>
              <div className="flex justify-center lg:justify-start space-x-6 mt-4">
                <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors duration-300">
                  <span className="sr-only">Twitter</span>
                  <TwitterIcon />
                </a>
                <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors duration-300">
                  <span className="sr-only">Instagram</span>
                  <InstagramIcon />
                </a>
                <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors duration-300">
                  <span className="sr-only">Facebook</span>
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;