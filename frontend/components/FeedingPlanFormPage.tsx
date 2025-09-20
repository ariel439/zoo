import React, { useState, useEffect } from 'react';
import { PlanoAlimentar } from '../types/dashboard';

interface FeedingPlanFormPageProps {
  planId?: number;
  plans: PlanoAlimentar[];
  onNavigateBack: () => void;
  onSave: (planData: Partial<PlanoAlimentar>) => void;
}

const FormField: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-light-cream/80 mb-2">{label}</label>
        {children}
    </div>
);

const inputStyles = "w-full bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber";

const FeedingPlanFormPage: React.FC<FeedingPlanFormPageProps> = ({ planId, plans, onNavigateBack, onSave }) => {
  const isEditing = planId !== undefined;
  const [formData, setFormData] = useState<Partial<PlanoAlimentar>>({
      planName: '',
      animalSpecies: '',
      foodType: '',
      quantity: '',
      frequency: '',
  });

  useEffect(() => {
    if (isEditing) {
      const planToEdit = plans.find(p => p.id === planId);
      if (planToEdit) setFormData(planToEdit);
    }
  }, [planId, plans, isEditing]);

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
  
  const pageTitle = isEditing ? `Editar ${formData.planName}` : 'Adicionar Novo Plano Alimentar';
  const submitButtonText = isEditing ? 'Atualizar Plano' : 'Salvar Plano';

  return (
    <div className="text-light-cream">
       <nav className="text-sm text-light-cream/70 mb-4">
        <span>Dashboard</span> <span className="mx-2">&gt;</span>
        <a href="#" onClick={handleCancel} className="hover:text-brand-gold">Alimentação</a>
        <span className="mx-2">&gt;</span>
        <span className="text-white">{isEditing ? 'Editar' : 'Adicionar'}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-serif text-4xl font-extrabold text-white">{pageTitle}</h1>
      </header>
      
      <div className="bg-brand-brown p-8 rounded-lg shadow-lg border border-brand-gold/20">
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Nome do Plano">
                <input type="text" name="planName" value={formData.planName} onChange={handleChange} className={inputStyles} required />
            </FormField>
            <FormField label="Espécie Alvo">
                <input type="text" name="animalSpecies" value={formData.animalSpecies} onChange={handleChange} className={inputStyles} />
            </FormField>
             <FormField label="Tipo de Comida">
                <input type="text" name="foodType" value={formData.foodType} onChange={handleChange} className={inputStyles} required />
            </FormField>
             <FormField label="Quantidade">
                <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} className={inputStyles} required />
            </FormField>
             <FormField label="Frequência">
                <input type="text" name="frequency" value={formData.frequency} onChange={handleChange} className={inputStyles} required />
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

export default FeedingPlanFormPage;
