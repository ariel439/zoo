import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-brand-brown rounded-xl shadow-2xl p-8 w-full max-w-md border border-brand-gold/20 transform transition-all animate-fade-in-up">
        <h2 className="font-serif text-2xl font-bold text-white mb-4">{title}</h2>
        <p className="text-light-cream/80 mb-8">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-transparent border-2 border-brand-gold/50 text-brand-gold/80 font-bold py-2 px-6 rounded-lg hover:bg-brand-gold/20 hover:text-brand-gold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
