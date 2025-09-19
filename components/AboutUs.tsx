import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="py-20 bg-brand-brown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-brand-gold font-semibold tracking-wide uppercase">Nossa Missão</h2>
          <p className="font-serif mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Conectando Pessoas e Vida Selvagem
          </p>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2 items-center">
          <div className="rounded-lg overflow-hidden shadow-2xl h-96">
            <img 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              src="https://i.imgur.com/tFEWXFn.png" 
              alt="Habitat exuberante do santuário"
            />
          </div>
          <div className="prose prose-invert lg:prose-xl text-light-cream">
            <p>
              Aninhado no coração da cidade, nosso santuário é um refúgio para animais e pessoas. Dedicamo-nos aos mais altos padrões de cuidado e conservação animal, trabalhando incansavelmente para proteger espécies ameaçadas e seus habitats.
            </p>
            <p>
              Nossa missão é inspirar uma conexão vitalícia com a nature, proporcionando experiências inesquecíveis que educam e envolvem nossa comunidade. Acreditamos que, ao promover um entendimento mais profundo do reino animal, podemos capacitar as futuras gerações a se tornarem guardiãs do nosso planeta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;