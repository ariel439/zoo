import { AlimentacaoRequestDTO, AlimentacaoResponseDTO, AnimalRequestDTO, AnimalResponseDTO, CuidadorRequestDTO, CuidadorResponseDTO, HabitatRequestDTO, HabitatResponseDTO, VeterinarioRequestDTO, VeterinarioResponseDTO, BackendError } from '../types/types';
import { ApiError } from '../utils/apiError';

const BASE_URL = 'https://zoo-production.up.railway.app/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorData: BackendError = {
            timestamp: new Date().toISOString(),
            status: response.status,
            error: 'Unknown Error',
            message: `Network response was not ok (Status: ${response.status})`,
            path: response.url,
        };

        try {
            const errorBody = await response.json();
            // Check if the errorBody matches the BackendError structure
            if (errorBody && typeof errorBody === 'object' && errorBody.message) {
                errorData = {
                    timestamp: errorBody.timestamp || errorData.timestamp,
                    status: errorBody.status || errorData.status,
                    error: errorBody.error || errorData.error,
                    message: errorBody.message,
                    path: errorBody.path || errorData.path,
                };
            } else if (typeof errorBody === 'string') {
                errorData.message = errorBody;
            }
        } catch (e) {
            const errorText = await response.text();
            if (errorText) {
                errorData.message = errorText;
            }
        }
        // Throw an ApiError object that contains the structured error data
        throw new ApiError(errorData.message, errorData);
    }
    if (response.status === 204) { // No Content
        return null;
    }
    return response.json();
};

// Animal API
export const getAnimals = async (species?: string, ageMin?: number, ageMax?: number, name?: string): Promise<AnimalResponseDTO[]> => {
    const params = new URLSearchParams();
    if (species) {
        params.append('species', species);
    }
    if (ageMin) {
        params.append('ageMin', ageMin.toString());
    }
    if (ageMax) {
        params.append('ageMax', ageMax.toString());
    }
    if (name) {
        params.append('name', name);
    }
    const queryString = params.toString();
    const url = `${BASE_URL}/animals${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url);
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
export const getHabitats = async (type?: string): Promise<HabitatResponseDTO[]> => {
    const params = new URLSearchParams();
    if (type) {
        params.append('type', type);
    }
    const queryString = params.toString();
    const url = `${BASE_URL}/habitats${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url);
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
export const getCuidadores = async (specialty?: string): Promise<CuidadorResponseDTO[]> => {
    const params = new URLSearchParams();
    if (specialty) {
        params.append('specialty', specialty);
    }
    const queryString = params.toString();
    const url = `${BASE_URL}/cuidadores${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url);
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
export const getVeterinarios = async (specialty?: string): Promise<VeterinarioResponseDTO[]> => {
    const params = new URLSearchParams();
    if (specialty) {
        params.append('specialty', specialty);
    }
    const queryString = params.toString();
    const url = `${BASE_URL}/veterinarios${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url);
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
export const getAlimentacoes = async (foodType?: string, animalId?: number): Promise<AlimentacaoResponseDTO[]> => {
    const params = new URLSearchParams();
    if (foodType) {
        params.append('foodType', foodType);
    }
    if (animalId) {
        params.append('animalId', animalId.toString());
    }
    const queryString = params.toString();
    const url = `${BASE_URL}/alimentacoes${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url);
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