import React from 'react';
import { Veterinario, AnimalDashboard } from '../types/dashboard';

interface ViewState {
    page: string;
    params?: { [key: string]: any };
}

interface VetDetailsPageProps {
  vetId: number;
  vets: Veterinario[];
  animals: AnimalDashboard[];
  onNavigateBack: () => void;
  onNavigateTo: (view: ViewState) => void;
}

const VetDetailsPage: React.FC<VetDetailsPageProps> = ({ vetId, vets, animals, onNavigateBack, onNavigateTo }) => {
  const vet = vets.find(v => v.id === vetId);
  const assignedAnimals = animals.filter(a => a.vetId === vetId);

  if (!vet) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Veterinário Não Encontrado</h2>
            <button onClick={onNavigateBack} className="bg-brand-amber text-dark-bg font-bold py-2 px-5 rounded-lg">
                Voltar à Lista
            </button>
        </div>
    );
  }

  return (
    <div className="text-light-cream">
      {/* Breadcrumbs */}
      <nav className="text-sm text-light-cream/70 mb-4">
        <span>Dashboard</span> <span className="mx-2">&gt;</span>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigateTo({ page: 'vets' }); }} className="hover:text-brand-gold">Veterinários</a>
        <span className="mx-2">&gt;</span>
        <span className="text-white">{vet.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-extrabold text-white">{vet.name}</h1>
        <p className="text-brand-gold font-semibold">{vet.specialty}</p>
      </header>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-brand-brown p-8 rounded-lg shadow-lg border border-brand-gold/20 space-y-4">
             <div>
                <h3 className="font-serif text-xl font-bold text-brand-gold mb-2">Informações</h3>
                <ul className="space-y-3">
                    <li className="flex justify-between items-center border-b border-brand-gold/10 pb-2"><span className="font-semibold text-light-cream/80">CRMV:</span><span>{vet.crmv}</span></li>
                    <li className="flex justify-between items-center pt-2"><span className="font-semibold text-light-cream/80">Status:</span>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ vet.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400' }`}>
                            {vet.status}
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="bg-brand-brown p-8 rounded-lg shadow-lg border border-brand-gold/20">
            <h3 className="font-serif text-xl font-bold text-brand-gold mb-4">Pacientes Atuais</h3>
            {assignedAnimals.length > 0 ? (
                 <ul className="space-y-3">
                    {assignedAnimals.map(animal => (
                        <li key={animal.id} className="flex justify-between items-center p-2 bg-dark-bg/40 rounded-md">
                           <div>
                                <p className="font-medium text-white">{animal.name}</p>
                                <p className="text-sm text-light-cream/70">{animal.species}</p>
                           </div>
                            <button onClick={() => onNavigateTo({ page: 'animalDetails', params: { id: animal.id } })} className="text-brand-gold hover:underline text-sm">
                                Ver Ficha
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-light-cream/70 italic">Nenhum animal sob os cuidados deste veterinário.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default VetDetailsPage;
