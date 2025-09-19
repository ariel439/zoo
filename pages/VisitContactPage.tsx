import React from 'react';
import { PhoneIcon, EmailIcon, LocationMarkerIcon } from '../components/Icons';

const VisitContactPage: React.FC = () => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here.
    alert('Mensagem enviada! (Funcionalidade de demonstração)');
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-dark-bg bg-cover bg-center"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')" }}
      >
        <div className="absolute inset-0 bg-dark-bg/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">Planeje Sua Visita</h1>
          <p className="mt-4 text-lg md:text-xl text-light-cream/90 drop-shadow-md max-w-3xl mx-auto">
            Estamos ansiosos para receber você. Encontre todas as informações que precisa abaixo.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left Column: Map and Address */}
            <div className="flex flex-col justify-center">
              <div className="space-y-8">
                <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-brand-brown">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.558296312521!2d-49.06933672368936!3d-26.91772229239462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94df18f3a34a40a5%3A0x8b305009a6ef062!2sR.%20das%20Palmeiras%2C%20123%20-%20Centro%2C%20Blumenau%20-%20SC%2C%2089010-020!5e0!3m2!1spt-BR!2sbr!4v1721326848135!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="filter invert(90%) grayscale(80%)"
                    title="Localização do Santuário"
                  ></iframe>
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-2xl font-bold text-white mb-3">Nosso Endereço</h3>
                  <div className="inline-flex items-start space-x-3 text-light-cream text-left">
                      <LocationMarkerIcon className="w-6 h-6 text-brand-gold mt-1 flex-shrink-0" />
                      <span>Rua das Palmeiras, 123<br/>Centro, Blumenau, SC<br/>CEP 89010-020</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Info and Form */}
            <div className="space-y-12">
              {/* Hours */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">Nosso Horário</h3>
                <ul className="space-y-2 text-light-cream list-inside">
                  <li className="flex justify-between border-b border-brand-brown pb-2"><span>Terça a Sexta:</span> <span>09:00 - 17:00</span></li>
                  <li className="flex justify-between border-b border-brand-brown pb-2"><span>Sábados e Domingos:</span> <span>09:00 - 18:00</span></li>
                  <li className="flex justify-between border-b border-brand-brown pb-2"><span>Feriados:</span> <span>09:00 - 18:00</span></li>
                  <li className="flex justify-between text-light-cream/70 pt-1"><span>Segundas-feiras:</span> <span>Fechado</span></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">Contato</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-light-cream">
                        <PhoneIcon className="w-6 h-6 text-brand-gold" />
                        <a href="tel:+5547999998888" className="hover:text-brand-gold transition-colors duration-300">(47) 99999-8888</a>
                    </div>
                    <div className="flex items-center space-x-3 text-light-cream">
                        <EmailIcon className="w-6 h-6 text-brand-gold" />
                        <a href="mailto:contato@santuario.com.br" className="hover:text-brand-gold transition-colors duration-300">contato@santuario.com.br</a>
                    </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">Envie uma Mensagem</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="sr-only">Seu Nome</label>
                    <input type="text" name="name" id="name" required placeholder="Seu Nome" className="w-full bg-brand-brown border border-brand-gold/30 rounded-lg py-2 px-4 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber"/>
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Seu E-mail</label>
                    <input type="email" name="email" id="email" required placeholder="Seu E-mail" className="w-full bg-brand-brown border border-brand-gold/30 rounded-lg py-2 px-4 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber"/>
                  </div>
                  <div>
                    <label htmlFor="subject" className="sr-only">Assunto</label>
                    <input type="text" name="subject" id="subject" required placeholder="Assunto" className="w-full bg-brand-brown border border-brand-gold/30 rounded-lg py-2 px-4 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber"/>
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">Mensagem</label>
                    <textarea name="message" id="message" rows={4} required placeholder="Sua Mensagem" className="w-full bg-brand-brown border border-brand-gold/30 rounded-lg py-2 px-4 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-brand-amber text-dark-bg font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg text-lg">
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default VisitContactPage;