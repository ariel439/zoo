import React from 'react';
// import { AnimalSite } from '../types/site'; // No longer needed if AnimalSite is only for animalsData
import { animalImageOptions, AnimalImageOption } from '../utils/animalImages'; // New import

// Remove the hardcoded animalsData array

const AnimalCard: React.FC<{ animal: AnimalImageOption }> = ({ animal }) => (
  <div className="bg-brand-brown rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
    <img 
      className="w-full h-56 object-cover" 
      src={animal.image} 
      alt={animal.name}
    />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="font-serif text-2xl font-bold text-white mb-1">{animal.name}</h3>
      {/* Remove scientificName and description as they are not in AnimalImageOption */}
      {/* <p className="text-light-cream/80 italic mb-3">{animal.scientificName}</p> */}
      {/* <p className="text-light-cream text-sm flex-grow">{animal.description}</p> */}
    </div>
  </div>
);

const ComingSoonCard: React.FC = () => (
    <div className="bg-brand-brown rounded-lg shadow-lg flex flex-col items-center justify-center p-6 border-2 border-dashed border-brand-gold/50 h-full">
        <svg className="w-12 h-12 text-brand-gold/60 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <h3 className="font-serif text-2xl font-bold text-white mb-1">Mais em Breve</h3>
        <p className="text-light-cream/80 text-sm text-center">Estamos adicionando mais perfis de animais. Volte em breve!</p>
    </div>
);


const AnimalGalleryPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 bg-dark-bg bg-[url('https://images.unsplash.com/photo-1552858220-3343357548a2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
         <div className="absolute inset-0 bg-dark-bg/70"></div>
         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">Nossos Incríveis Animais</h1>
            <p className="mt-4 text-lg md:text-xl text-light-cream drop-shadow-md">Conheça os moradores fascinantes do nosso santuário.</p>
         </div>
      </section>
      
      {/* Gallery Section */}
      <section className="pt-12 pb-20 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {animalImageOptions.map(animal => <AnimalCard key={animal.id} animal={animal} />)} {/* Use animalImageOptions */}
           </div>
        </div>
      </section>
    </>
  );
};

export default AnimalGalleryPage;
