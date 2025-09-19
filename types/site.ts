// types/site.ts

export interface Slide {
  id: number;
  image: string;
  headline: string;
  subheadline: string;
}

export interface MembroEquipe {
  id: number;
  image: string;
  name: string;
  role: string;
  bio: string;
}

// Tipo para Animal na página pública (galeria)
export interface AnimalSite {
  id: number;
  image: string;
  name: string;
  scientificName: string;
  description: string;
}
