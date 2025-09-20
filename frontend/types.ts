
export interface VeterinarioRequestDTO {
  name?: string;
  contactInfo?: string;
  licenseNumber?: string;
}

export interface VeterinarioResponseDTO {
  id: number;
  name?: string;
  contactInfo?: string;
  licenseNumber?: string;
}

export interface HabitatRequestDTO {
  name?: string;
  description?: string;
  temperature?: number;
  humidity?: number;
}

export interface HabitatResponseDTO {
  id: number;
  name?: string;
  description?: string;
  temperature?: number;
  humidity?: number;
}

export interface CuidadorRequestDTO {
  name?: string;
  contactInfo?: string;
  specialty?: string;
}

export interface CuidadorResponseDTO {
  id: number;
  name?: string;
  contactInfo?: string;
  specialty?: string;
}

export interface AnimalRequestDTO {
  name?: string;
  species?: string;
  breed?: string;
  age?: number;
  location?: string;
  healthStatus?: string;
}

export interface AnimalResponseDTO {
  id: number;
  name?: string;
  species?: string;
  breed?: string;
  age?: number;
  location?: string;
  healthStatus?: string;
}

export interface AlimentacaoRequestDTO {
  foodType?: string;
  quantity?: number;
  feedingTime?: string; 
}

export interface AlimentacaoResponseDTO {
  id: number;
  foodType?: string;
  quantity?: number;
  feedingTime?: string; 
}
