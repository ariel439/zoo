import React from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from './Icons';
import { AnimalDashboard, Cuidador, Habitat } from '../types/dashboard';

interface ViewState {
    page: string; 
    params?: { [key: string]: any };
}

interface AnimalManagementPageProps {
  animals: AnimalDashboard[];
  keepers: Cuidador[];
  habitats: Habitat[];
  onNavigateTo: (view: ViewState) => void;
  onDeleteRequest: (animal: AnimalDashboard) => void;
  onFilter: (filters: { name?: string; species?: string; ageMin?: number; ageMax?: number }) => void;
}

const AnimalManagementPage: React.FC<AnimalManagementPageProps> = ({ animals, keepers, habitats, onNavigateTo, onDeleteRequest, onFilter }) => {
  const [filterName, setFilterName] = React.useState<string>('');
  const [filterSpecies, setFilterSpecies] = React.useState<string>('');
  const [filterAgeMin, setFilterAgeMin] = React.useState<number | undefined>(undefined);
  const [filterAgeMax, setFilterAgeMax] = React.useState<number | undefined>(undefined);

  const handleFilter = () => {
    onFilter({
      name: filterName || undefined,
      species: filterSpecies === 'Filtrar por espécie' ? undefined : filterSpecies || undefined,
      ageMin: filterAgeMin,
      ageMax: filterAgeMax,
    });
  };

  const getKeeperName = (keeperId: number) => keepers.find(k => k.id === keeperId)?.name || 'N/A';
  const getHabitatName = (habitatId: number) => habitats.find(h => h.id === habitatId)?.name || 'N/A';

  return (
    <div className="text-light-cream">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-extrabold text-white">Gerenciamento de Animais</h1>
        <p className="text-light-cream/80 mt-1">Veja, filtre e gerencie todos os animais do sistema.</p>
      </header>

      {/* Actions and Filters Bar */}
      <div className="mb-6 bg-brand-brown p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <button 
          onClick={() => onNavigateTo({ page: 'animalForm' })}
          className="w-full md:w-auto flex items-center justify-center bg-brand-amber text-dark-bg font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-md">
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Novo Animal
        </button>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full md:w-auto bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber"
          />
          <select 
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            className="w-full md:w-auto bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream focus:outline-none focus:ring-2 focus:ring-brand-amber">
            <option value="">Filtrar por espécie</option>
            <option value="Leão">Leão</option>
            <option value="Mico-Leão-Dourado">Mico-Leão-Dourado</option>
            <option value="Tucano">Tucano</option>
          </select>
          <div className="flex items-center gap-2">
             <input 
                type="number" 
                placeholder="Idade Mín" 
                value={filterAgeMin || ''}
                onChange={(e) => setFilterAgeMin(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-24 bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber" 
             />
             <input 
                type="number" 
                placeholder="Idade Máx" 
                value={filterAgeMax || ''}
                onChange={(e) => setFilterAgeMax(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-24 bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber" 
             />
          </div>
          <button 
            onClick={handleFilter}
            className="w-full md:w-auto bg-transparent border-2 border-brand-gold text-brand-gold font-bold py-2 px-4 rounded-lg hover:bg-brand-gold hover:text-dark-bg transition-colors">
            Filtrar
          </button>
        </div>
      </div>

      {/* Animal Data Table */}
      <div className="bg-brand-brown rounded-lg shadow-lg overflow-hidden border border-brand-gold/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark-bg/50">
              <tr className="border-b-2 border-brand-gold/30">
                <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">Nome</th>
                <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">Espécie</th>
                <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">Idade</th>
                <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">Habitat</th>
                <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">Cuidador</th>
                <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">Status</th>
                <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal, index) => (
                <tr key={animal.id} className={`border-b border-brand-gold/10 ${index % 2 !== 0 ? 'bg-dark-bg/40' : ''}`}>
                  <td className="p-4 whitespace-nowrap text-white font-medium">
                    <button 
                      onClick={() => onNavigateTo({ page: 'animalDetails', params: { id: animal.id }})}
                      className="hover:text-brand-gold transition-colors duration-200"
                    >
                      {animal.name}
                    </button>
                  </td>
                  <td className="p-4 whitespace-nowrap">{animal.species}</td>
                  <td className="p-4 whitespace-nowrap">{animal.age}</td>
                  <td className="p-4 whitespace-nowrap">{getHabitatName(animal.habitatId)}</td>
                  <td className="p-4 whitespace-nowrap">{getKeeperName(animal.keeperId)}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      animal.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {animal.status}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-3">
                      <button onClick={() => onNavigateTo({ page: 'animalForm', params: { id: animal.id }})} className="text-brand-gold/80 hover:text-brand-gold transition-colors" aria-label="Editar">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDeleteRequest(animal)} className="text-red-500/80 hover:text-red-500 transition-colors" aria-label="Excluir">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between text-sm">
         <p className="text-light-cream/70">Página 1 de 5</p>
         <div className="flex gap-2">
             <button className="bg-brand-brown border border-brand-gold/30 py-2 px-4 rounded-lg hover:bg-dark-bg/50 transition-colors">
                Anterior
             </button>
             <button className="bg-brand-brown border border-brand-gold/30 py-2 px-4 rounded-lg hover:bg-dark-bg/50 transition-colors">
                Próxima
             </button>
         </div>
      </div>

    </div>
  );
};

export default AnimalManagementPage;
