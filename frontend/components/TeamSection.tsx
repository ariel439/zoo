import React from 'react';
import { MembroEquipe } from '../types/site';

const teamMembers: MembroEquipe[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop',
    name: 'Dr. Anya Sharma',
    role: 'Veterinária Chefe',
    bio: 'Dedicada a promover a saúde e o bem-estar animal através de cuidados compassivos e pesquisa.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop',
    name: 'David Chen',
    role: 'Zelador Chefe',
    bio: 'Especialista em manejo de animais e na criação de ambientes enriquecedores para nossos diversos residentes.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    name: 'Maria Garcia',
    role: 'Diretora de Conservação',
    bio: 'Liderando iniciativas globais para proteger espécies ameaçadas e restaurar habitats naturais.',
  },
];

const TeamMemberCard: React.FC<{ member: MembroEquipe }> = ({ member }) => (
  <div className="bg-brand-brown rounded-lg shadow-lg overflow-hidden text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-gold/20">
    <img 
      className="w-full h-56 object-cover" 
      src={member.image} 
      alt={member.name}
      style={{ objectPosition: 'center 25%' }}
    />
    <div className="p-6">
      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
      <p className="text-brand-gold font-semibold mb-3">{member.role}</p>
      <p className="text-light-cream text-sm">{member.bio}</p>
    </div>
  </div>
);

const TeamSection: React.FC = () => {
  return (
    <section className="py-20 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl leading-9 font-extrabold tracking-tight text-white sm:text-4xl">
            Nossos Especialistas Dedicados
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-light-cream">
            Conheça os indivíduos apaixonados que fazem do nosso santuário uma instituição de classe mundial.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
