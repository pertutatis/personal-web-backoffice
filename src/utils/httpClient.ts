/**
 * Cliente HTTP para interactuar con la API
 */

import { ApiError } from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Opciones para configurar peticiones HTTP
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

/**
 * Formatea URL con parámetros query de forma segura
 */
const formatUrl = (url: string, params?: Record<string, any>): string => {
  if (!params) return url;

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

/**
 * Procesa la respuesta HTTP
 */
const processResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: ApiError;

    try {
      errorData = await response.json();
    } catch (e) {
      errorData = {
        statusCode: response.status,
        message: response.statusText || 'Error desconocido'
      };
    }

    throw errorData;
  }

  // Si la respuesta es 204 No Content o vacía, devolvemos un objeto vacío
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return await response.json();
};

/**
 * Cliente HTTP con métodos para realizar peticiones a la API
 */
export const httpClient = {
  /**
   * Realiza una petición GET
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = formatUrl(`${API_BASE_URL}${endpoint}`, options.params);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: options.signal
    });

    return processResponse<T>(response);
  },

  /**
   * Realiza una petición POST
   */
  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const url = formatUrl(`${API_BASE_URL}${endpoint}`, options.params);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      signal: options.signal
    });

    return processResponse<T>(response);
  },

  /**
   * Realiza una petición PUT
   */
  async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    const url = formatUrl(`${API_BASE_URL}${endpoint}`, options.params);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      signal: options.signal
    });

    return processResponse<T>(response);
  },

  /**
   * Realiza una petición DELETE
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = formatUrl(`${API_BASE_URL}${endpoint}`, options.params);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: options.signal
    });

    return processResponse<T>(response);
  }
};
