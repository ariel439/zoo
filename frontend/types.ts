
export interface VeterinarioRequestDTO {
  name: string;
  crmv: string;
  specialty: string;
  status: string;
}

export interface VeterinarioResponseDTO {
  id: number;
  name: string;
  crmv: string;
  specialty: string;
  status: string;
}

export interface HabitatRequestDTO {
  name: string;
  type: string;
  capacity: number;
  status: string;
}

export interface HabitatResponseDTO {
  id: number;
  name: string;
  type: string;
  capacity: number;
  status: string;
}

export interface CuidadorRequestDTO {
  name: string;
  contact: string;
  specialty: string;
  status: string;
}

export interface CuidadorResponseDTO {
  id: number;
  name: string;
  contact: string;
  specialty: string;
  status: string;
}

export interface AnimalRequestDTO {
  name: string;
  species: string;
  age: number;
  sex: string;
  arrivalDate: string;
  status: string;
  image?: string; // Optional
  keeperId?: number; // Optional, using number for Long
  vetId?: number; // Optional, using number for Long
  habitatId?: number; // Optional, using number for Long
  feedingPlanId?: number; // Optional, using number for Long
}

export interface AnimalResponseDTO {
  id: number;
  name: string;
  species: string;
  age: number;
  sex: string;
  arrivalDate: string;
  status: string;
  image?: string; // Optional
  keeperId?: number; // Optional, using number for Long
  vetId?: number; // Optional, using number for Long
  habitatId?: number; // Optional, using number for Long
  feedingPlanId?: number; // Optional, using number for Long
}


export interface AlimentacaoRequestDTO {
  planName: string;
  animalSpecies: string;
  foodType: string;
  quantity: string;
  frequency: string;
}

export interface AlimentacaoResponseDTO {
  id: number;
  planName: string;
  animalSpecies: string;
  foodType: string;
  quantity: string;
  frequency: string;
}
