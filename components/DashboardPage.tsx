

import React from 'react';
import { 
    HomeIcon, ZooLogo, PawIcon, UserGroupIcon,
    AnimalIcon, VetKeeperIcon, HabitatIcon, AlertIcon,
    UserSolidIcon, GlobeAltIcon, BowlIcon
} from './Icons';
import AnimalManagementPage from './AnimalManagementPage';
import AnimalDetailsPage from './AnimalDetailsPage';
import AnimalFormPage from './AnimalFormPage';
import ConfirmationModal from './ConfirmationModal';
import GenericManagementPage from './GenericManagementPage';
import KeeperDetailsPage from './KeeperDetailsPage';
import KeeperFormPage from './KeeperFormPage';
import VetDetailsPage from './VetDetailsPage';
import VetFormPage from './VetFormPage';
import HabitatDetailsPage from './HabitatDetailsPage';
import HabitatFormPage from './HabitatFormPage';
import FeedingPlanDetailsPage from './FeedingPlanDetailsPage';
import FeedingPlanFormPage from './FeedingPlanFormPage';
import ToastNotification from './ToastNotification';
// FIX: Corrected type imports. The type names used in this component (e.g., Keeper) did not match the exported names from '../types/dashboard' (e.g., Cuidador). Aliases are used to resolve the mismatch.
import { AnimalDashboard as DashboardAnimal, Cuidador as Keeper, Veterinario as Vet, Habitat, PlanoAlimentar as FeedingPlan } from '../types/dashboard';


interface DashboardPageProps {
  setPage: (page: string) => void;
}

type PageName = 'dashboard' | 'animals' | 'animalDetails' | 'animalForm' | 'keepers' | 'keeperDetails' | 'keeperForm' | 'vets' | 'vetDetails' | 'vetForm' | 'habitats' | 'habitatDetails' | 'habitatForm' | 'feeding' | 'feedingPlanDetails' | 'feedingPlanForm';

interface ViewState {
    page: PageName;
    params?: { [key: string]: any };
}

const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
    { id: 'animals', name: 'Animais', icon: PawIcon },
    { id: 'keepers', name: 'Cuidadores', icon: UserGroupIcon },
    { id: 'vets', name: 'Veterinários', icon: UserSolidIcon },
    { id: 'habitats', name: 'Habitats', icon: GlobeAltIcon },
    { id: 'feeding', name: 'Alimentação', icon: BowlIcon },
];

// --- Initial Data Sets with Relational IDs ---

// FIX: Explicitly typed the initial data arrays to match their corresponding interfaces.
const initialKeeperData: Keeper[] = [
    { id: 1, name: 'David Chen', specialty: 'Grandes Felinos', contact: 'david@santuario.com', status: 'Ativo' },
    { id: 2, name: 'Maria Garcia', specialty: 'Aves e Répteis', contact: 'maria@santuario.com', status: 'Ativo' },
    { id: 3, name: 'João Silva', specialty: 'Primatas', contact: 'joao@santuario.com', status: 'Férias' },
];

const initialVetData: Vet[] = [
    { id: 1, name: 'Dr. Anya Sharma', specialty: 'Cirurgia Geral', crmv: 'CRMV-SP 12345', status: 'Ativo' },
    { id: 2, name: 'Dr. Carlos Lima', specialty: 'Animais Exóticos', crmv: 'CRMV-RJ 54321', status: 'Ativo' },
];

const initialHabitatData: Habitat[] = [
    { id: 1, name: 'Savana Africana', type: 'Terrestre', capacity: 15, status: 'Operacional' },
    { id: 2, name: 'Floresta Tropical', type: 'Misto', capacity: 20, status: 'Operacional' },
    { id: 3, name: 'Grande Aquário', type: 'Aquático', capacity: 30, status: 'Em Manutenção' },
    // FIX: Corrected habitat types to be more specific and consistent with the available options.
    { id: 4, name: 'Aviário', type: 'Aviário', capacity: 50, status: 'Operacional' },
    { id: 5, name: 'Reptilário', type: 'Reptilário', capacity: 25, status: 'Operacional' },
];

const initialFeedingData: FeedingPlan[] = [
    { id: 1, planName: 'Dieta Carnívora Padrão', animalSpecies: 'Grandes Felinos', foodType: 'Carne Vermelha', quantity: '5kg', frequency: '2x ao dia' },
    { id: 2, planName: 'Dieta de Primatas', animalSpecies: 'Micos', foodType: 'Frutas e Insetos', quantity: '500g', frequency: '3x ao dia' },
    { id: 3, planName: 'Dieta de Aves de Bico Grande', animalSpecies: 'Tucano', foodType: 'Frutas e sementes', quantity: '300g', frequency: 'Contínuo' },
    { id: 4, planName: 'Dieta de Herbívoros', animalSpecies: 'Zebra', foodType: 'Feno e vegetais', quantity: '10kg', frequency: 'Contínuo' },
];

// FIX: Added the required 'sex' property to each animal object and explicitly typed the array.
const initialAnimalData: DashboardAnimal[] = [
  { id: 1, name: 'Leo o Leão', species: 'Leão', age: 5, sex: 'Macho', keeperId: 1, vetId: 1, habitatId: 1, feedingPlanId: 1, status: 'Ativo', arrivalDate: '2022-03-15' },
  { id: 2, name: 'Kiki', species: 'Mico-Leão-Dourado', age: 2, sex: 'Fêmea', keeperId: 3, vetId: 2, habitatId: 2, feedingPlanId: 2, status: 'Ativo', arrivalDate: '2023-01-20' },
  { id: 3, name: 'Paco', species: 'Tucano', age: 3, sex: 'Macho', keeperId: 2, vetId: 2, habitatId: 4, feedingPlanId: 3, status: 'Em Observação', arrivalDate: '2023-05-10' },
  { id: 4, name: 'Rajah', species: 'Tigre-de-bengala', age: 7, sex: 'Macho', keeperId: 1, vetId: 1, habitatId: 2, feedingPlanId: 1, status: 'Ativo', arrivalDate: '2024-08-01' },
  { id: 5, name: 'Zola', species: 'Zebra-da-planície', age: 4, sex: 'Fêmea', keeperId: 1, vetId: 2, habitatId: 1, feedingPlanId: 4, status: 'Ativo', arrivalDate: '2024-09-05' },
  { id: 6, name: 'Naga', species: 'Naja', age: 6, sex: 'Fêmea', keeperId: 2, vetId: 2, habitatId: 5, feedingPlanId: 1, status: 'Em Observação', arrivalDate: '2024-10-22' },
];


// --- Column Configurations for Generic Page ---
const KEEPER_COLUMNS = [
    { header: 'Nome', accessor: 'name' },
    { header: 'Especialidade', accessor: 'specialty' },
    { header: 'Contato', accessor: 'contact' },
    { header: 'Status', accessor: 'status', render: (status: string) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400' }`}>
            {status}
        </span>
    )},
];
const VET_COLUMNS = [
    { header: 'Nome', accessor: 'name' },
    { header: 'Especialidade', accessor: 'specialty' },
    { header: 'CRMV', accessor: 'crmv' },
    { header: 'Status', accessor: 'status', render: (status: string) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400' }`}>
            {status}
        </span>
    )},
];
const HABITAT_COLUMNS = [
    { header: 'Nome', accessor: 'name' },
    { header: 'Tipo', accessor: 'type' },
    { header: 'Capacidade', accessor: 'capacity' },
    { header: 'Status', accessor: 'status', render: (status: string) => (
         <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ status === 'Operacional' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400' }`}>
            {status}
        </span>
    )},
];
const FEEDING_COLUMNS = [
    { header: 'Nome do Plano', accessor: 'planName' },
    { header: 'Espécie Atendida', accessor: 'animalSpecies' },
    { header: 'Tipo de Comida', accessor: 'foodType' },
    { header: 'Quantidade', accessor: 'quantity' },
    { header: 'Frequência', accessor: 'frequency' },
];

// --- Dashboard Overview Component ---
const DashboardOverview: React.FC<{
    animals: any[],
    keepers: any[],
    habitats: any[],
    navigateTo: (view: ViewState) => void;
}> = ({ animals, keepers, habitats, navigateTo }) => {
    // Data processing for dashboard widgets
    const maintenanceHabitats = habitats.filter(h => h.status === 'Em Manutenção');
    const animalsInObservation = animals.filter(a => a.status === 'Em Observação');
    const activeKeepers = keepers.filter(k => k.status === 'Ativo');
    const recentAnimals = [...animals].sort((a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime()).slice(0, 5);

    const stats = [
        { title: 'Total de Animais', value: animals.length, icon: AnimalIcon },
        { title: 'Habitats Ativos', value: habitats.filter(h => h.status === 'Operacional').length, icon: HabitatIcon },
        { title: 'Cuidadores em Turno', value: activeKeepers.length, icon: VetKeeperIcon },
        { title: 'Alertas Pendentes', value: maintenanceHabitats.length + animalsInObservation.length, icon: AlertIcon },
    ];

    return (
        <>
            <header className="mb-10">
                <h1 className="font-serif text-4xl font-extrabold text-white">Dashboard Geral</h1>
                <p className="text-light-cream/80 mt-1">Bem-vindo de volta! Aqui está um resumo do santuário hoje.</p>
            </header>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map(card => (
                    <div key={card.title} className="bg-brand-brown p-6 rounded-lg shadow-lg flex items-center border border-brand-gold/20 transform hover:-translate-y-1 transition-all duration-300">
                        <card.icon className={`w-12 h-12 mr-5 ${card.title === 'Alertas Pendentes' && card.value > 0 ? 'text-brand-amber' : 'text-brand-gold'}`} />
                        <div>
                            <p className="text-sm text-light-cream/80">{card.title}</p>
                            <p className="text-3xl font-bold text-white">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-10 space-y-8">
                {/* Alerts and Keepers Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-brand-brown p-6 rounded-lg shadow-lg border border-brand-gold/20">
                        <h2 className="font-serif text-2xl font-bold text-white mb-4">Alertas e Tarefas Rápidas</h2>
                        <ul className="space-y-3">
                            {maintenanceHabitats.map(habitat => (
                                <li key={`h-alert-${habitat.id}`} className="flex items-center p-3 bg-dark-bg/40 rounded-md">
                                    <AlertIcon className="w-6 h-6 mr-4 text-brand-amber flex-shrink-0" />
                                    <p className="text-white font-semibold flex-grow">Habitat "{habitat.name}" requer manutenção.</p>
                                    <button onClick={() => navigateTo({ page: 'habitatDetails', params: { id: habitat.id }})} className="text-sm bg-brand-amber/80 text-dark-bg font-bold py-1 px-3 rounded-md hover:bg-brand-amber transition-colors">
                                        Ver
                                    </button>
                                </li>
                            ))}
                            {animalsInObservation.map(animal => (
                                <li key={`a-alert-${animal.id}`} className="flex items-center p-3 bg-dark-bg/40 rounded-md">
                                    <PawIcon className="w-6 h-6 mr-4 text-brand-gold flex-shrink-0" />
                                    <p className="text-white font-semibold flex-grow">{animal.name} ({animal.species}) está em observação.</p>
                                    <button onClick={() => navigateTo({ page: 'animalDetails', params: { id: animal.id }})} className="text-sm bg-brand-gold/80 text-dark-bg font-bold py-1 px-3 rounded-md hover:bg-brand-gold transition-colors">
                                        Ver Ficha
                                    </button>
                                </li>
                            ))}
                             {maintenanceHabitats.length === 0 && animalsInObservation.length === 0 && (
                                <p className="text-light-cream/70 italic">Nenhum alerta pendente.</p>
                            )}
                        </ul>
                    </div>
                    <div className="lg:col-span-2 bg-brand-brown p-6 rounded-lg shadow-lg border border-brand-gold/20">
                         <h2 className="font-serif text-2xl font-bold text-white mb-4">Cuidadores em Turno</h2>
                         <ul className="space-y-3">
                             {activeKeepers.map(keeper => (
                                <li key={keeper.id} className="flex items-center p-3 bg-dark-bg/40 rounded-md">
                                    <UserSolidIcon className="w-6 h-6 mr-4 text-brand-gold flex-shrink-0" />
                                    <div>
                                        <p className="text-white font-semibold">{keeper.name}</p>
                                        <p className="text-sm text-light-cream/70">{keeper.specialty}</p>
                                    </div>
                                </li>
                             ))}
                         </ul>
                    </div>
                </div>

                {/* Habitat Occupancy */}
                <div className="bg-brand-brown p-6 rounded-lg shadow-lg border border-brand-gold/20">
                     <h2 className="font-serif text-2xl font-bold text-white mb-4">Ocupação dos Habitats</h2>
                     <div className="space-y-4">
                        {habitats.filter(h => h.status === 'Operacional').map(habitat => {
                            const residentCount = animals.filter(a => a.habitatId === habitat.id).length;
                            const occupancy = (residentCount / habitat.capacity) * 100;
                            const barColor = occupancy > 80 ? 'bg-red-500' : occupancy > 60 ? 'bg-amber-500' : 'bg-green-500';
                            return (
                                <div key={habitat.id}>
                                    <div className="flex justify-between items-end mb-1 text-sm">
                                        <p className="font-semibold text-white">{habitat.name}</p>
                                        <p className="text-light-cream/80">{residentCount} / {habitat.capacity}</p>
                                    </div>
                                    <div className="w-full bg-dark-bg/50 rounded-full h-2.5">
                                        <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${occupancy}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                     </div>
                </div>

                {/* Recent Animals Table */}
                <div className="bg-brand-brown rounded-lg shadow-lg overflow-hidden border border-brand-gold/20">
                    <h2 className="font-serif text-2xl font-bold text-white p-6">Animais Adicionados Recentemente</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-bg/50">
                                <tr className="border-b-2 border-brand-gold/30">
                                    <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">Nome</th>
                                    <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">Espécie</th>
                                    <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider">Data de Chegada</th>
                                    <th className="p-4 text-sm font-semibold text-brand-gold uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAnimals.map((animal, index) => (
                                    <tr key={animal.id} className={`border-b border-brand-gold/10 ${index % 2 !== 0 ? 'bg-dark-bg/40' : ''}`}>
                                        <td className="p-4 whitespace-nowrap text-white font-medium">{animal.name}</td>
                                        <td className="p-4 whitespace-nowrap">{animal.species}</td>
                                        <td className="p-4 whitespace-nowrap">{new Date(animal.arrivalDate).toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => navigateTo({ page: 'animalDetails', params: { id: animal.id } })} className="text-brand-gold hover:underline text-sm font-semibold">
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};


type ModalItem = { id: number; type: string; name: string };

const typeToNameMap: { [key: string]: string } = {
    animal: 'Animal',
    keeper: 'Cuidador',
    vet: 'Veterinário',
    habitat: 'Habitat',
    feedingPlan: 'Plano de Alimentação',
};

const DashboardPage: React.FC<DashboardPageProps> = ({ setPage }) => {
    // State for all data
    const [animals, setAnimals] = React.useState(initialAnimalData);
    const [keepers, setKeepers] = React.useState(initialKeeperData);
    const [vets, setVets] = React.useState(initialVetData);
    const [habitats, setHabitats] = React.useState(initialHabitatData);
    const [feedingPlans, setFeedingPlans] = React.useState(initialFeedingData);

    // Navigation and Modal State
    const [viewStack, setViewStack] = React.useState<ViewState[]>([{ page: 'dashboard' }]);
    const [modalState, setModalState] = React.useState<{ isOpen: boolean; itemToDelete: ModalItem | null }>({ isOpen: false, itemToDelete: null });
    const [toastMessage, setToastMessage] = React.useState<string | null>(null);

    const currentView = viewStack[viewStack.length - 1];

    // Navigation Logic
    const navigateTo = (view: ViewState) => {
        if (['dashboard', 'animals', 'keepers', 'vets', 'habitats', 'feeding'].includes(view.page)) {
            setViewStack([view]);
        } else {
            setViewStack(prev => [...prev, view]);
        }
    };

    const navigateBack = () => {
        if (viewStack.length > 1) {
            setViewStack(prev => prev.slice(0, -1));
        }
    };
    
    // Generic Save/Update Logic
    const saveData = (itemData: any, type: string) => {
        const isEditing = itemData.id !== undefined && itemData.id !== null;
        
        const updateState = (
            stateArray: any[],
            setter: React.Dispatch<React.SetStateAction<any[]>>
        ) => {
            if (isEditing) {
                setter(prev => prev.map(item => item.id === itemData.id ? { ...item, ...itemData } : item));
            } else {
                const newId = Math.max(0, ...stateArray.map(i => i.id || 0)) + 1;
                setter(prev => [...prev, { ...itemData, id: newId }]);
            }
        };

        switch (type) {
            case 'animal': updateState(animals, setAnimals); break;
            case 'keeper': updateState(keepers, setKeepers); break;
            case 'vet': updateState(vets, setVets); break;
            case 'habitat': updateState(habitats, setHabitats); break;
            case 'feedingPlan': updateState(feedingPlans, setFeedingPlans); break;
        }

        const action = isEditing ? 'atualizado' : 'adicionado';
        const itemName = itemData.name || itemData.planName;
        const friendlyTypeName = typeToNameMap[type] || 'Item';

        if (type === 'animal') {
            const keeper = keepers.find(k => k.id === itemData.keeperId);
            if (keeper && keeper.contact) {
                setToastMessage(`Simulação: E-mail enviado para ${keeper.contact} (${itemName} foi ${action}).`);
            } else {
                 setToastMessage(`${friendlyTypeName} "${itemName}" foi ${action} com sucesso.`);
            }
        } else {
            setToastMessage(`${friendlyTypeName} "${itemName}" foi ${action} com sucesso.`);
        }
        
        navigateBack();
    };

    // Deletion Logic
    const handleDeleteRequest = (item: any, type: string) => {
        const name = item.name || item.planName || 'este item';
        setModalState({ isOpen: true, itemToDelete: { id: item.id, type, name } });
    };

    const handleModalClose = () => {
        setModalState({ isOpen: false, itemToDelete: null });
    };

    const handleConfirmDelete = () => {
        if (!modalState.itemToDelete) return;
        const { id, type, name } = modalState.itemToDelete;

        const detailPageName = `${type}Details`;
        if (currentView.page === detailPageName && currentView.params?.id === id) {
            navigateBack();
        }

        const deleteFromState = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
            setter(prev => prev.filter(item => item.id !== id));
        };

        switch(type) {
            case 'animal': deleteFromState(setAnimals); break;
            case 'keeper': deleteFromState(setKeepers); break;
            case 'vet': deleteFromState(setVets); break;
            case 'habitat': deleteFromState(setHabitats); break;
            case 'feedingPlan': deleteFromState(setFeedingPlans); break;
        }

        const friendlyTypeName = typeToNameMap[type] || 'Item';
        setToastMessage(`${friendlyTypeName} "${name}" foi excluído com sucesso.`);

        handleModalClose();
    };

    // Content Rendering Logic
    const renderContent = () => {
        switch (currentView.page) {
            case 'dashboard': return <DashboardOverview animals={animals} keepers={keepers} habitats={habitats} navigateTo={navigateTo} />;
            // Animals
            case 'animals':
                return <AnimalManagementPage 
                    animals={animals}
                    keepers={keepers}
                    habitats={habitats}
                    onNavigateTo={navigateTo}
                    onDeleteRequest={(item) => handleDeleteRequest(item, 'animal')}
                />;
            case 'animalDetails':
                return <AnimalDetailsPage 
                    animalId={currentView.params?.id} 
                    animals={animals}
                    keepers={keepers}
                    vets={vets}
                    habitats={habitats}
                    feedingPlans={feedingPlans}
                    onNavigateBack={navigateBack}
                    onNavigateTo={navigateTo}
                    onDeleteRequest={(item) => handleDeleteRequest(item, 'animal')}
                />;
            case 'animalForm':
                return <AnimalFormPage 
                    animalId={currentView.params?.id}
                    animals={animals}
                    keepers={keepers}
                    vets={vets}
                    habitats={habitats}
                    feedingPlans={feedingPlans}
                    onSave={(data) => saveData(data, 'animal')}
                    onNavigateBack={navigateBack}
                />;
            // Keepers
            case 'keepers':
                return <GenericManagementPage title="Gerenciamento de Cuidadores" data={keepers} columns={KEEPER_COLUMNS}
                    onAddItem={() => navigateTo({ page: 'keeperForm' })}
                    onEditItem={(item) => navigateTo({ page: 'keeperForm', params: { id: item.id } })}
                    onDeleteItem={(item) => handleDeleteRequest(item, 'keeper')}
                    onViewItem={(item) => navigateTo({ page: 'keeperDetails', params: { id: item.id } })}
                />;
             case 'keeperDetails':
                return <KeeperDetailsPage keeperId={currentView.params?.id} keepers={keepers} animals={animals} onNavigateBack={navigateBack} onNavigateTo={navigateTo}/>;
             case 'keeperForm':
                return <KeeperFormPage keeperId={currentView.params?.id} keepers={keepers} onSave={(data) => saveData(data, 'keeper')} onNavigateBack={navigateBack} />;
            // Vets
            case 'vets':
                 return <GenericManagementPage title="Gerenciamento de Veterinários" data={vets} columns={VET_COLUMNS}
                    onAddItem={() => navigateTo({ page: 'vetForm' })}
                    onEditItem={(item) => navigateTo({ page: 'vetForm', params: { id: item.id } })}
                    onDeleteItem={(item) => handleDeleteRequest(item, 'vet')}
                    onViewItem={(item) => navigateTo({ page: 'vetDetails', params: { id: item.id }})}
                />;
             case 'vetDetails':
                return <VetDetailsPage vetId={currentView.params?.id} vets={vets} animals={animals} onNavigateBack={navigateBack} onNavigateTo={navigateTo}/>;
             case 'vetForm':
                return <VetFormPage vetId={currentView.params?.id} vets={vets} onSave={(data) => saveData(data, 'vet')} onNavigateBack={navigateBack} />;
            // Habitats
            case 'habitats':
                 return <GenericManagementPage title="Gerenciamento de Habitats" data={habitats} columns={HABITAT_COLUMNS}
                    onAddItem={() => navigateTo({ page: 'habitatForm' })}
                    onEditItem={(item) => navigateTo({ page: 'habitatForm', params: { id: item.id } })}
                    onDeleteItem={(item) => handleDeleteRequest(item, 'habitat')}
                    onViewItem={(item) => navigateTo({ page: 'habitatDetails', params: { id: item.id }})}
                />;
             case 'habitatDetails':
                return <HabitatDetailsPage habitatId={currentView.params?.id} habitats={habitats} animals={animals} onNavigateBack={navigateBack} onNavigateTo={navigateTo}/>;
             case 'habitatForm':
                return <HabitatFormPage habitatId={currentView.params?.id} habitats={habitats} onSave={(data) => saveData(data, 'habitat')} onNavigateBack={navigateBack} />;
            // Feeding
            case 'feeding':
                return <GenericManagementPage title="Gerenciamento de Alimentação" data={feedingPlans} columns={FEEDING_COLUMNS}
                   onAddItem={() => navigateTo({ page: 'feedingPlanForm' })}
                   onEditItem={(item) => navigateTo({ page: 'feedingPlanForm', params: { id: item.id }})}
                   onDeleteItem={(item) => handleDeleteRequest(item, 'feedingPlan')}
                   onViewItem={(item) => navigateTo({ page: 'feedingPlanDetails', params: { id: item.id }})}
               />;
            case 'feedingPlanDetails':
                return <FeedingPlanDetailsPage planId={currentView.params?.id} plans={feedingPlans} animals={animals} onNavigateBack={navigateBack} onNavigateTo={navigateTo} />;
            case 'feedingPlanForm':
                return <FeedingPlanFormPage planId={currentView.params?.id} plans={feedingPlans} onSave={(data) => saveData(data, 'feedingPlan')} onNavigateBack={navigateBack} />;
            default:
                return <DashboardOverview animals={animals} keepers={keepers} habitats={habitats} navigateTo={navigateTo} />;
        }
    }

    const getActiveNavId = () => {
        const page = currentView.page;
        if (page.includes('animal')) return 'animals';
        if (page.includes('keeper')) return 'keepers';
        if (page.includes('vet')) return 'vets';
        if (page.includes('habitat')) return 'habitats';
        if (page.includes('feeding')) return 'feeding';
        return 'dashboard';
    }

    return (
        <div className="min-h-screen bg-dark-bg font-sans text-light-cream flex">
            <aside className="w-64 bg-brand-brown flex-shrink-0 p-6 flex flex-col shadow-2xl">
                <div className="flex justify-center mb-12">
                    <ZooLogo layout="vertical" />
                </div>
                <nav className="flex-grow">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.name} className="mb-2">
                                <a href="#" 
                                    onClick={(e) => { e.preventDefault(); navigateTo({ page: item.id as ViewState['page'] }); }}
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${getActiveNavId() === item.id ? 'bg-brand-amber text-dark-bg font-bold shadow-md' : 'hover:bg-dark-bg/50'}`}>
                                    <item.icon className="w-6 h-6 mr-4" />
                                    <span>{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                 <div className="mt-auto">
                    <button 
                        onClick={() => setPage('home')}
                        className="w-full flex items-center p-3 rounded-lg transition-colors duration-200 text-light-cream/70 hover:bg-dark-bg/50 hover:text-light-cream">
                        <svg className="w-6 h-6 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto">
                {renderContent()}
            </main>

            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Você tem certeza que deseja excluir "${modalState.itemToDelete?.name || ''}"? Esta ação não pode ser desfeita.`}
            />

            {toastMessage && (
                <ToastNotification 
                    message={toastMessage} 
                    onClose={() => setToastMessage(null)} 
                />
            )}
        </div>
    );
};

export default DashboardPage;