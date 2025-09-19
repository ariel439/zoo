import React, { useState, useEffect } from 'react';
import { Slide } from '../types/site';

const slidesData: Slide[] = [
  {
    id: 1,
    image: 'https://i.imgur.com/xLJdJ8C.png',
    headline: 'Vivencie a Vida Selvagem',
    subheadline: 'Descubra animais incríveis de todo o mundo.',
  },
  {
    id: 2,
    image: 'https://i.imgur.com/yqy4Dq8.png',
    headline: 'Um Mundo de Cores',
    subheadline: 'Explore nossos viveiros deslumbrantes e aves exóticas.',
  },
  {
    id: 3,
    image: 'https://i.imgur.com/SqheH3q.png',
    headline: 'Diversão para Toda a Família',
    subheadline: 'Uma aventura inesquecível espera por você.',
  },
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slidesData.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slidesData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-lg mb-4 animate-fade-in-down">
              {slide.headline}
            </h1>
            <p className="text-lg md:text-2xl max-w-2xl drop-shadow-md animate-fade-in-up">
              {slide.subheadline}
            </p>
          </div>
        </div>
      ))}
       <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-brand-gold scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
