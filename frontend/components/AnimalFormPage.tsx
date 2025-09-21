import React, { useState, useEffect, useMemo } from 'react';
import { AnimalDashboard, Cuidador, Veterinario, Habitat, PlanoAlimentar } from '../types/dashboard';

interface AnimalFormPageProps {
  animalId?: number;
  animals: AnimalDashboard[];
  keepers: Cuidador[];
  vets: Veterinario[];
  habitats: Habitat[];
  feedingPlans: PlanoAlimentar[];
  onNavigateBack: () => void;
  onSave: (animalData: Partial<AnimalDashboard>) => Promise<void>; // onSave now returns a Promise<void>
}

const FormField: React.FC<{ label: string, children: React.ReactNode, error?: string }> = ({ label, children, error }) => (
    <div>
        <label className="block text-sm font-medium text-light-cream/80 mb-2">{label}</label>
        {children}
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
);

const inputStyles = "w-full bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber";

const AnimalFormPage: React.FC<AnimalFormPageProps> = ({ 
    animalId, 
    animals, 
    keepers,
    vets,
    habitats,
    feedingPlans,
    onNavigateBack, 
    onSave 
}) => {
  const isEditing = animalId !== undefined;
  const [formData, setFormData] = useState<Partial<AnimalDashboard>>({
      name: '',
      species: '',
      age: 0,
      sex: 'Macho',
      arrivalDate: '',
      habitatId: undefined,
      keeperId: undefined,
      vetId: undefined,
      feedingPlanId: undefined,
      status: 'Ativo',
      image: 'https://i.imgur.com/lFn440i.png', // Default image for new animals
  });
  const [habitatError, setHabitatError] = useState<string | undefined>(undefined);
  const [keeperError, setKeeperError] = useState<string | undefined>(undefined);

  const habitatOccupancy = useMemo(() => {
    const occupancy: { [key: number]: number } = {};
    for (const animal of animals) {
      if (animal.habitatId) {
        occupancy[animal.habitatId] = (occupancy[animal.habitatId] || 0) + 1;
      }
    }
    return occupancy;
  }, [animals]);

  useEffect(() => {
    if (isEditing) {
      const animalToEdit = animals.find(a => a.id === animalId);
      if (animalToEdit) {
        setFormData(animalToEdit);
      }
    }
  }, [animalId, animals, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumericField = ['age', 'keeperId', 'vetId', 'habitatId', 'feedingPlanId'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumericField && value ? parseInt(value) : value }));
    // Clear errors when user starts typing/changing input
    if (name === 'habitatId') setHabitatError(undefined);
    if (name === 'keeperId') setKeeperError(undefined);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateBack();
  };
  
  const pageTitle = isEditing ? `Editar ${formData.name}` : 'Adicionar Novo Animal';
  const submitButtonText = isEditing ? 'Atualizar Informações' : 'Salvar Animal';

  return (
    <div className="text-light-cream">
      {/* Breadcrumbs */}
      <nav className="text-sm text-light-cream/70 mb-4">
        <span>Dashboard</span>
        <span className="mx-2">&gt;</span>
        <a href="#" onClick={handleCancel} className="hover:text-brand-gold transition-colors">Animais</a>
        <span className="mx-2">&gt;</span>
        <span className="text-white">{isEditing ? 'Editar' : 'Adicionar Novo'}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-extrabold text-white">{pageTitle}</h1>
      </header>
      
      {/* Form Container */}
      <div className="bg-brand-brown p-8 rounded-lg shadow-lg border border-brand-gold/20">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <FormField label="Nome do Animal"><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required /></FormField>
                    <FormField label="Espécie"><input type="text" name="species" value={formData.species} onChange={handleChange} className={inputStyles} required/></FormField>
                    <FormField label="Idade (anos)"><input type="number" name="age" value={formData.age} onChange={handleChange} className={inputStyles} required/></FormField>
                    <FormField label="Sexo">
                        <select name="sex" value={formData.sex} onChange={handleChange} className={inputStyles}>
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                        </select>
                    </FormField>
                    <FormField label="Data de Chegada"><input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className={inputStyles} /></FormField>
                </div>
                {/* Right Column */}
                <div className="space-y-6">
                    <FormField label="Habitat">
                        <select name="habitatId" value={formData.habitatId || ''} onChange={handleChange} className={inputStyles} required>
                             <option value="">Selecione um habitat...</option>
                             {habitats.map(h => {
                                const occupancy = habitatOccupancy[h.id] || 0;
                                const isFull = occupancy >= h.capacity;
                                const isDisabled = isFull && h.id !== formData.habitatId;

                                return (
                                    <option key={h.id} value={h.id} disabled={isDisabled}>
                                        {h.name} ({occupancy}/{h.capacity}) {isDisabled ? '(Lotado)' : ''}
                                    </option>
                                );
                             })}
                        </select>
                    </FormField>
                     <FormField label="Cuidador">
                        <select name="keeperId" value={formData.keeperId || ''} onChange={handleChange} className={inputStyles} required>
                            <option value="">Selecione um cuidador...</option>
                            {keepers.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                        </select>
                    </FormField>
                     <FormField label="Veterinário">
                        <select name="vetId" value={formData.vetId || ''} onChange={handleChange} className={inputStyles} required>
                            <option value="">Selecione um veterinário...</option>
                            {vets.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Plano Alimentar">
                        <select name="feedingPlanId" value={formData.feedingPlanId || ''} onChange={handleChange} className={inputStyles} required>
                            <option value="">Selecione um plano...</option>
                            {feedingPlans.map(p => <option key={p.id} value={p.id}>{p.planName}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Status">
                        <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                            <option>Ativo</option>
                            <option>Em Observação</option>
                            <option>Em Quarentena</option>
                        </select>
                    </FormField>
                    <FormField label="URL da Imagem"><input type="text" name="image" value={formData.image || ''} onChange={handleChange} className={inputStyles} /></FormField>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex justify-end space-x-4">
                <button type="button" onClick={handleCancel} className="bg-transparent border-2 border-brand-gold/50 text-brand-gold/80 font-bold py-2 px-6 rounded-lg hover:bg-brand-gold/20 hover:text-brand-gold transition-colors">
                    Cancelar
                </button>
                <button type="submit" className="bg-brand-amber text-dark-bg font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md">
                    {submitButtonText}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AnimalFormPage;