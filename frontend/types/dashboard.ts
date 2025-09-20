// types/dashboard.ts
// Estes tipos correspondem às entidades do backend para as operações CRUD do painel.

export interface Cuidador {
  id: number;
  name: string;
  specialty: string;
  contact: string; // Assumindo e-mail para notificações
  status: 'Ativo' | 'Férias' | 'Inativo';
}

export interface Veterinario {
  id: number;
  name: string;
  crmv: string;
  specialty: string;
  status: 'Ativo' | 'Inativo';
}

export interface Habitat {
  id: number;
  name: string;
  type: 'Terrestre' | 'Aquático' | 'Misto' | 'Aéreo' | 'Reptilário' | 'Aviário';
  capacity: number;
  status: 'Operacional' | 'Em Manutenção' | 'Fechado';
}

export interface PlanoAlimentar {
  id: number;
  planName: string;
  animalSpecies: string;
  foodType: string;
  quantity: string;
  frequency: string;
}

export interface AnimalDashboard {
  id: number;
  name: string;
  species: string;
  age: number;
  sex: 'Macho' | 'Fêmea';
  arrivalDate: string; // YYYY-MM-DD
  status: 'Ativo' | 'Em Observação' | 'Em Quarentena';
  image?: string; // Imagem opcional para a página de detalhes

  // IDs Relacionais
  keeperId: number;
  vetId: number;
  habitatId: number;
  feedingPlanId: number;
}
