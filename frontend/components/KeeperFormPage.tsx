import React, { useState, useEffect } from 'react';
import { Cuidador } from '../types/dashboard';

interface KeeperFormPageProps {
  keeperId?: number;
  keepers: Cuidador[];
  onNavigateBack: () => void;
  onSave: (keeperData: Partial<Cuidador>) => void;
}

const FormField: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-light-cream/80 mb-2">{label}</label>
        {children}
    </div>
);

const inputStyles = "w-full bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber";

const KeeperFormPage: React.FC<KeeperFormPageProps> = ({ keeperId, keepers, onNavigateBack, onSave }) => {
  const isEditing = keeperId !== undefined;
  const [formData, setFormData] = useState<Partial<Cuidador>>({
      name: '',
      specialty: '',
      contact: '',
      status: 'Ativo',
      workShift: 'Manhã', // Initialize workShift
  });

  useEffect(() => {
    if (isEditing) {
      const keeperToEdit = keepers.find(k => k.id === keeperId);
      if (keeperToEdit) setFormData(keeperToEdit);
    }
  }, [keeperId, keepers, isEditing]);

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
  
  const pageTitle = isEditing ? `Editar ${formData.name}` : 'Adicionar Novo Cuidador';
  const submitButtonText = isEditing ? 'Atualizar Cuidador' : 'Salvar Cuidador';

  return (
    <div className="text-light-cream">
       <nav className="text-sm text-light-cream/70 mb-4">
        <span>Dashboard</span> <span className="mx-2">&gt;</span>
        <a href="#" onClick={handleCancel} className="hover:text-brand-gold">Cuidadores</a>
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
             <FormField label="Contato (Email)">
                <input type="email" name="contact" value={formData.contact} onChange={handleChange} className={inputStyles} required />
            </FormField>
            <FormField label="Status">
                <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                    <option>Ativo</option>
                    <option>Férias</option>
                    <option>Inativo</option>
                </select>
            </FormField>
            <FormField label="Turno de Trabalho">
                <select name="workShift" value={formData.workShift} onChange={handleChange} className={inputStyles}>
                    <option>Manhã</option>
                    <option>Tarde</option>
                    <option>Noite</option>
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

export default KeeperFormPage;
