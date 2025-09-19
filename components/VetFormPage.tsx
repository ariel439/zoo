import React, { useState, useEffect } from 'react';
import { Veterinario } from '../types/dashboard';

interface VetFormPageProps {
  vetId?: number;
  vets: Veterinario[];
  onNavigateBack: () => void;
  onSave: (vetData: Partial<Veterinario>) => void;
}

const FormField: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-light-cream/80 mb-2">{label}</label>
        {children}
    </div>
);

const inputStyles = "w-full bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber";

const VetFormPage: React.FC<VetFormPageProps> = ({ vetId, vets, onNavigateBack, onSave }) => {
  const isEditing = vetId !== undefined;
  const [formData, setFormData] = useState<Partial<Veterinario>>({
      name: '',
      specialty: '',
      crmv: '',
      status: 'Ativo',
  });

  useEffect(() => {
    if (isEditing) {
      const vetToEdit = vets.find(v => v.id === vetId);
      if (vetToEdit) setFormData(vetToEdit);
    }
  }, [vetId, vets, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateBack();
  };
  
  const pageTitle = isEditing ? `Editar ${formData.name}` : 'Adicionar Novo Veterinário';
  const submitButtonText = isEditing ? 'Atualizar Veterinário' : 'Salvar Veterinário';

  return (
    <div className="text-light-cream">
       <nav className="text-sm text-light-cream/70 mb-4">
        <span>Dashboard</span> <span className="mx-2">&gt;</span>
        <a href="#" onClick={handleCancel} className="hover:text-brand-gold">Veterinários</a>
        <span className="mx-2">&gt;</span>
        <span className="text-white">{isEditing ? 'Editar' : 'Adicionar'}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-serif text-4xl font-extrabold text-white">{pageTitle}</h1>
      </header>
      
      <div className="bg-brand-brown p-8 rounded-lg shadow-lg border border-brand-gold/20">
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Nome Completo">
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
            </FormField>
            <FormField label="Especialidade">
                <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className={inputStyles} />
            </FormField>
             <FormField label="CRMV">
                <input type="text" name="crmv" value={formData.crmv} onChange={handleChange} className={inputStyles} required />
            </FormField>
            <FormField label="Status">
                <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                    <option>Ativo</option>
                    <option>Inativo</option>
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

export default VetFormPage;
