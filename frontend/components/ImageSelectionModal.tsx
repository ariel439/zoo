import React from 'react';
import { animalImageOptions, AnimalImageOption } from '../utils/animalImages';

interface ImageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  currentImage: string | null;
}

const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({ isOpen, onClose, onSelectImage, currentImage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark-bg bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-brown rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-brand-gold/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-2xl font-bold text-white">Selecionar Imagem do Animal</h2>
          <button onClick={onClose} className="text-light-cream hover:text-brand-amber transition-colors text-xl">
            &times;
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {animalImageOptions.map((option: AnimalImageOption) => (
            <div
              key={option.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-200 ${
                currentImage === option.image ? 'border-4 border-brand-amber' : 'border-2 border-transparent hover:border-brand-gold/50'
              }`}
              onClick={() => onSelectImage(option.image)}
            >
              <img src={option.image} alt={option.name} className="w-full h-32 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-dark-bg/70 text-light-cream text-xs p-1 text-center">
                {option.name}
              </div>
            </div>
          ))}
        </div>
        <div className="text-right">
          <button onClick={onClose} className="bg-brand-amber text-dark-bg font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity shadow-md">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelectionModal;
