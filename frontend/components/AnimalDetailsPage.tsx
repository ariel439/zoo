import React from 'react';
import { AnimalDashboard, Cuidador, Veterinario, Habitat, PlanoAlimentar } from '../types/dashboard';

type PageName = 'dashboard' | 'animals' | 'animalDetails' | 'animalForm' | 'keepers' | 'keeperDetails' | 'keeperForm' | 'vets' | 'vetDetails' | 'vetForm' | 'habitats' | 'habitatDetails' | 'habitatForm' | 'feeding' | 'feedingPlanDetails' | 'feedingPlanForm';

interface ViewState {
    page: PageName;
    params?: { [key: string]: any };
}

interface AnimalDetailsPageProps {
  animalId: number;
  animals: AnimalDashboard[];
  keepers: Cuidador[];
  vets: Veterinario[];
  habitats: Habitat[];
  feedingPlans: PlanoAlimentar[];
  onNavigateBack: () => void;
  onNavigateTo: (view: ViewState) => void;
  onDeleteRequest: (animal: AnimalDashboard) => void;
}

const InfoCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-brand-brown p-6 rounded-lg shadow-lg border border-brand-gold/20">
        <h3 className="font-serif text-xl font-bold text-brand-gold mb-4">{title}</h3>
        {children}
    </div>
);

const AnimalDetailsPage: React.FC<AnimalDetailsPageProps> = ({ 
    animalId, 
    animals, 
    keepers,
    vets,
    habitats,
    feedingPlans,
    onNavigateBack, 
    onNavigateTo, 
    onDeleteRequest 
}) => {
  const animal = animals.find(a => a.id === animalId);

  if (!animal) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Animal Não Encontrado</h2>
            <p className="text-light-cream/80 mb-6">O animal que você está procurando não existe ou foi removido.</p>
            <button onClick={onNavigateBack} className="bg-brand-amber text-dark-bg font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity shadow-md">
                Voltar à Lista
            </button>
        </div>
    );
  }

  // Look up related data
  const keeper = keepers.find(k => k.id === animal.keeperId);
  const vet = vets.find(v => v.id === animal.vetId);
  const habitat = habitats.find(h => h.id === animal.habitatId);
  const feedingPlan = feedingPlans.find(p => p.id === animal.feedingPlanId);

  // Fallback data for the details view
  const displayAnimal = {
    ...animal,
    image: animal.image || 'https://i.imgur.com/lFn440i.png',
  };

  const handleLinkClick = (e: React.MouseEvent, page: PageName, id: number) => {
      e.preventDefault();
      onNavigateTo({ page, params: { id } });
  };

  return (
    <div className="text-light-cream">
      {/* Breadcrumbs */}
      <nav className="text-sm text-light-cream/70 mb-4">
        <span>Dashboard</span>
        <span className="mx-2">&gt;</span>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigateTo({ page: 'animals' }); }} className="hover:text-brand-gold transition-colors">Animais</a>
        <span className="mx-2">&gt;</span>
        <span className="text-white">{displayAnimal.name}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="font-serif text-4xl font-extrabold text-white">{displayAnimal.name}</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onNavigateTo({ page: 'animalForm', params: { id: animalId }})}
            className="bg-brand-amber text-dark-bg font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity shadow-md">
            Editar
          </button>
          <button 
            onClick={() => onDeleteRequest(animal)}
            className="bg-transparent border-2 border-red-500/80 text-red-500/80 font-bold py-2 px-5 rounded-lg hover:bg-red-500/80 hover:text-white transition-colors">
            Excluir
          </button>
        </div>
      </header>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-brand-brown rounded-lg shadow-lg overflow-hidden border border-brand-gold/20">
                <img src={displayAnimal.image} alt={displayAnimal.name} className="w-full h-80 object-cover" />
            </div>
            <InfoCard title="Informações Principais">
                <ul className="space-y-3 text-light-cream">
                    <li className="flex justify-between"><span className="font-semibold text-light-cream/80">Espécie:</span><span>{displayAnimal.species}</span></li>
                    <li className="flex justify-between"><span className="font-semibold text-light-cream/80">Idade:</span><span>{displayAnimal.age} anos</span></li>
                    <li className="flex justify-between"><span className="font-semibold text-light-cream/80">Sexo:</span><span>{displayAnimal.sex}</span></li>
                    <li className="flex justify-between"><span className="font-semibold text-light-cream/80">Data de Chegada:</span><span>{displayAnimal.arrivalDate}</span></li>
                     <li className="flex justify-between items-center"><span className="font-semibold text-light-cream/80">Status:</span>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${displayAnimal.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {displayAnimal.status}
                        </span>
                    </li>
                </ul>
            </InfoCard>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-8">
            <InfoCard title="Habitat Atual">
                <div className="text-light-cream">
                    <p className="text-lg">
                        <a href="#" onClick={(e) => habitat && handleLinkClick(e, 'habitatDetails', habitat.id)} className="text-brand-amber hover:underline font-semibold">{habitat?.name || 'N/A'}</a>
                    </p>
                    <p className="text-light-cream/80">Tipo: {habitat?.type || 'N/A'}</p>
                </div>
            </InfoCard>
            <InfoCard title="Equipe de Cuidados">
                <ul className="space-y-3 text-light-cream">
                    <li className="flex justify-between">
                        <span className="font-semibold text-light-cream/80">Cuidador:</span>
                        <a href="#" onClick={(e) => keeper && handleLinkClick(e, 'keeperDetails', keeper.id)} className="text-brand-amber hover:underline">{keeper?.name || 'N/A'}</a>
                    </li>
                     <li className="flex justify-between">
                        <span className="font-semibold text-light-cream/80">Veterinário:</span>
                        <a href="#" onClick={(e) => vet && handleLinkClick(e, 'vetDetails', vet.id)} className="text-brand-amber hover:underline">{vet?.name || 'N/A'}</a>
                    </li>
                </ul>
            </InfoCard>
             <InfoCard title="Plano Alimentar">
                <ul className="space-y-3 text-light-cream mb-4">
                    <li className="flex justify-between"><span className="font-semibold text-light-cream/80">Tipo de Comida:</span><span>{feedingPlan?.foodType || 'N/A'}</span></li>
                    <li className="flex justify-between"><span className="font-semibold text-light-cream/80">Quantidade Diária:</span><span>{feedingPlan?.quantity || 'N/A'}</span></li>
                    <li className="flex justify-between"><span className="font-semibold text-light-cream/80">Frequência:</span><span>{feedingPlan?.frequency || 'N/A'}</span></li>
                </ul>
                <a href="#" onClick={(e) => feedingPlan && handleLinkClick(e, 'feedingPlanDetails', feedingPlan.id)} className="text-brand-amber hover:underline text-sm font-semibold">Ver plano completo ({feedingPlan?.planName || 'N/A'})</a>
            </InfoCard>
            <InfoCard title="Notas e Observações Recentes">
                 <ul className="space-y-4 text-sm">
                    <li className="border-l-2 border-brand-gold pl-3"><p className="text-light-cream">Exibiu comportamento normal. Bom apetite.</p><p className="text-light-cream/60 text-xs mt-1">18/09/2025 - {vet?.name || 'Vet'}</p></li>
                    <li className="border-l-2 border-brand-gold/50 pl-3"><p className="text-light-cream/90">Interagiu bem com novo enriquecimento ambiental.</p><p className="text-light-cream/60 text-xs mt-1">17/09/2025 - {keeper?.name || 'Keeper'}</p></li>
                </ul>
            </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailsPage;
