import React, { useState, useEffect } from 'react';
import { Habitat } from '../types/dashboard';

interface HabitatFormPageProps {
  habitatId?: number;
  habitats: Habitat[];
  onNavigateBack: () => void;
  onSave: (habitatData: Partial<Habitat>) => void;
}

const FormField: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-light-cream/80 mb-2">{label}</label>
        {children}
    </div>
);

const inputStyles = "w-full bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber";

const HabitatFormPage: React.FC<HabitatFormPageProps> = ({ habitatId, habitats, onNavigateBack, onSave }) => {
  const isEditing = habitatId !== undefined;
  const [formData, setFormData] = useState<Partial<Habitat>>({
      name: '',
      type: 'Terrestre',
      capacity: 10,
      status: 'Operacional',
  });

  useEffect(() => {
    if (isEditing) {
      const habitatToEdit = habitats.find(h => h.id === habitatId);
      if (habitatToEdit) setFormData(habitatToEdit);
    }
  }, [habitatId, habitats, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value) : value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateBack();
  };
  
  const pageTitle = isEditing ? `Editar ${formData.name}` : 'Adicionar Novo Habitat';
  const submitButtonText = isEditing ? 'Atualizar Habitat' : 'Salvar Habitat';

  return (
    <div className="text-light-cream">
       <nav className="text-sm text-light-cream/70 mb-4">
        <span>Dashboard</span> <span className="mx-2">&gt;</span>
        <a href="#" onClick={handleCancel} className="hover:text-brand-gold">Habitats</a>
        <span className="mx-2">&gt;</span>
        <span className="text-white">{isEditing ? 'Editar' : 'Adicionar'}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-serif text-4xl font-extrabold text-white">{pageTitle}</h1>
      </header>
      
      <div className="bg-brand-brown p-8 rounded-lg shadow-lg border border-brand-gold/20">
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Nome do Habitat">
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
            </FormField>
            <FormField label="Tipo">
                <select name="type" value={formData.type} onChange={handleChange} className={inputStyles}>
                    <option>Terrestre</option>
                    <option>Aquático</option>
                    <option>Misto</option>
                    <option>Aviário</option>
                    <option>Reptilário</option>
                </select>
            </FormField>
            <FormField label="Capacidade">
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className={inputStyles} required />
            </FormField>
            <FormField label="Status">
                <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                    <option>Operacional</option>
                    <option>Em Manutenção</option>
                    <option>Fechado</option>
                </select>
            </FormField>
            <div className="pt-6 flex justify-end space-x-4">
                <button type="button" onClick={handleCancel} className="bg-transparent border-2 border-brand-gold/50 text-brand-gold/80 font-bold py-2 px-6 rounded-lg hover:bg-brand-gold/20">
                    Cancelar
                </button>
                <button type="submit" className="bg-brand-amber text-dark-bg font-bold py-2 px-6 rounded-lg hover:opacity-90">
                    {submitButtonText}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default HabitatFormPage;
