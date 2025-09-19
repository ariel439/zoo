import React from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from './Icons';

interface Column {
    header: string;
    accessor: string;
    render?: (value: any) => React.ReactNode;
}

interface GenericManagementPageProps {
  title: string;
  data: any[];
  columns: Column[];
  onAddItem: () => void;
  onEditItem: (item: any) => void;
  onDeleteItem: (item: any) => void;
  onViewItem: (item: any) => void;
}

const GenericManagementPage: React.FC<GenericManagementPageProps> = ({ 
    title, 
    data, 
    columns,
    onAddItem,
    onEditItem,
    onDeleteItem,
    onViewItem
}) => {
  return (
    <div className="text-light-cream">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-extrabold text-white">{title}</h1>
        <p className="text-light-cream/80 mt-1">Veja, filtre e gerencie todos os registros do sistema.</p>
      </header>

      {/* Actions and Filters Bar */}
      <div className="mb-6 bg-brand-brown p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <button 
          onClick={onAddItem}
          className="w-full md:w-auto flex items-center justify-center bg-brand-amber text-dark-bg font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-md">
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Novo
        </button>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full md:w-auto bg-dark-bg/50 border border-brand-gold/30 rounded-lg py-2 px-3 text-light-cream placeholder-light-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-amber"
          />
          <button className="w-full md:w-auto bg-transparent border-2 border-brand-gold text-brand-gold font-bold py-2 px-4 rounded-lg hover:bg-brand-gold hover:text-dark-bg transition-colors">
            Filtrar
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-brand-brown rounded-lg shadow-lg overflow-hidden border border-brand-gold/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark-bg/50">
              <tr className="border-b-2 border-brand-gold/30">
                {columns.map(col => (
                    <th key={col.accessor} className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">{col.header}</th>
                ))}
                <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} className={`border-b border-brand-gold/10 ${index % 2 !== 0 ? 'bg-dark-bg/40' : ''}`}>
                  {columns.map((col, colIndex) => (
                    <td key={col.accessor} className="p-4 whitespace-nowrap">
                      {colIndex === 0 ? (
                        <button onClick={() => onViewItem(item)} className="hover:text-brand-gold transition-colors duration-200 font-medium text-left">
                           {col.render ? col.render(item[col.accessor]) : item[col.accessor]}
                        </button>
                      ) : (
                        col.render ? col.render(item[col.accessor]) : item[col.accessor]
                      )}
                    </td>
                  ))}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-3">
                      <button onClick={() => onEditItem(item)} className="text-brand-gold/80 hover:text-brand-gold transition-colors" aria-label="Editar">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDeleteItem(item)} className="text-red-500/80 hover:text-red-500 transition-colors" aria-label="Excluir">
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
    </div>
  );
};

export default GenericManagementPage;
