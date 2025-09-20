import { AlimentacaoRequestDTO, AlimentacaoResponseDTO, AnimalRequestDTO, AnimalResponseDTO, CuidadorRequestDTO, CuidadorResponseDTO, HabitatRequestDTO, HabitatResponseDTO, VeterinarioRequestDTO, VeterinarioResponseDTO, } from '../types';

const BASE_URL = 'https://zoo-production.up.railway.app/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Network response was not ok: ${error}`);
    }
    if (response.status === 204) { // No Content
        return null;
    }
    return response.json();
};

// Animal API
export const getAnimals = async (): Promise<AnimalResponseDTO[]> => {
    const response = await fetch(`${BASE_URL}/animals`);
    return handleResponse(response);
};

export const getAnimalById = async (id: number): Promise<AnimalResponseDTO> => {
    const response = await fetch(`${BASE_URL}/animals/${id}`);
    return handleResponse(response);
};

export const createAnimal = async (animal: AnimalRequestDTO): Promise<AnimalResponseDTO> => {
    const response = await fetch(`${BASE_URL}/animals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animal),
    });
    return handleResponse(response);
};

export const updateAnimal = async (id: number, animal: AnimalRequestDTO): Promise<AnimalResponseDTO> => {
    const response = await fetch(`${BASE_URL}/animals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animal),
    });
    return handleResponse(response);
};

export const deleteAnimal = async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/animals/${id}`, {
        method: 'DELETE',
    });
};

// Habitat API
export const getHabitats = async (): Promise<HabitatResponseDTO[]> => {
    const response = await fetch(`${BASE_URL}/habitats`);
    return handleResponse(response);
};

export const getHabitatById = async (id: number): Promise<HabitatResponseDTO> => {
    const response = await fetch(`${BASE_URL}/habitats/${id}`);
    return handleResponse(response);
};

export const createHabitat = async (habitat: HabitatRequestDTO): Promise<HabitatResponseDTO> => {
    const response = await fetch(`${BASE_URL}/habitats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitat),
    });
    return handleResponse(response);
};

export const updateHabitat = async (id: number, habitat: HabitatRequestDTO): Promise<HabitatResponseDTO> => {
    const response = await fetch(`${BASE_URL}/habitats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitat),
    });
    return handleResponse(response);
};

export const deleteHabitat = async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/habitats/${id}`, {
        method: 'DELETE',
    });
};

// Cuidador API
export const getCuidadores = async (): Promise<CuidadorResponseDTO[]> => {
    const response = await fetch(`${BASE_URL}/cuidadores`);
    return handleResponse(response);
};

export const getCuidadorById = async (id: number): Promise<CuidadorResponseDTO> => {
    const response = await fetch(`${BASE_URL}/cuidadores/${id}`);
    return handleResponse(response);
};

export const createCuidador = async (cuidador: CuidadorRequestDTO): Promise<CuidadorResponseDTO> => {
    const response = await fetch(`${BASE_URL}/cuidadores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuidador),
    });
    return handleResponse(response);
};

export const updateCuidador = async (id: number, cuidador: CuidadorRequestDTO): Promise<CuidadorResponseDTO> => {
    const response = await fetch(`${BASE_URL}/cuidadores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuidador),
    });
    return handleResponse(response);
};

export const deleteCuidador = async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/cuidadores/${id}`, {
        method: 'DELETE',
    });
};

// Veterinario API
export const getVeterinarios = async (): Promise<VeterinarioResponseDTO[]> => {
    const response = await fetch(`${BASE_URL}/veterinarios`);
    return handleResponse(response);
};

export const getVeterinarioById = async (id: number): Promise<VeterinarioResponseDTO> => {
    const response = await fetch(`${BASE_URL}/veterinarios/${id}`);
    return handleResponse(response);
};

export const createVeterinario = async (veterinario: VeterinarioRequestDTO): Promise<VeterinarioResponseDTO> => {
    const response = await fetch(`${BASE_URL}/veterinarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veterinario),
    });
    return handleResponse(response);
};

export const updateVeterinario = async (id: number, veterinario: VeterinarioRequestDTO): Promise<VeterinarioResponseDTO> => {
    const response = await fetch(`${BASE_URL}/veterinarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veterinario),
    });
    return handleResponse(response);
};

export const deleteVeterinario = async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/veterinarios/${id}`, {
        method: 'DELETE',
    });
};

// Alimentacao API
export const getAlimentacoes = async (): Promise<AlimentacaoResponseDTO[]> => {
    const response = await fetch(`${BASE_URL}/alimentacoes`);
    return handleResponse(response);
};

export const getAlimentacaoById = async (id: number): Promise<AlimentacaoResponseDTO> => {
    const response = await fetch(`${BASE_URL}/alimentacoes/${id}`);
    return handleResponse(response);
};

export const createAlimentacao = async (alimentacao: AlimentacaoRequestDTO): Promise<AlimentacaoResponseDTO> => {
    const response = await fetch(`${BASE_URL}/alimentacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alimentacao),
    });
    return handleResponse(response);
};

export const updateAlimentacao = async (id: number, alimentacao: AlimentacaoRequestDTO): Promise<AlimentacaoResponseDTO> => {
    const response = await fetch(`${BASE_URL}/alimentacoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alimentacao),
    });
    return handleResponse(response);
};

export const deleteAlimentacao = async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/alimentacoes/${id}`, {
        method: 'DELETE',
    });
};