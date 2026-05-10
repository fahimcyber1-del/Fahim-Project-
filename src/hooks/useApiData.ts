import { apiStorage } from '../utils/apiStorage';
import { useState, useEffect, useCallback } from 'react';

// Get the base URL from local storage or default to empty (relative)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const url = localStorage.getItem('global_api_url');
    if (url) {
      // Return absolute url without trailing slash
      return url.replace(/\/$/, "");
    }
  }
  return "";
};

export async function apiFetch<T>(tableName: string): Promise<T[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/data/${tableName}`);
  if (!res.ok) throw new Error(`API fetch error for ${tableName}`);
  return await res.json();
}

export async function apiSave<T>(tableName: string, data: T): Promise<T> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/data/${tableName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`API save error for ${tableName}`);
  const result = await res.json();
  return result.data as T;
}

export async function apiDelete(tableName: string, id: string): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/data/${tableName}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`API delete error for ${tableName}`);
}

export function useApiData<T>(tableName: string, fallbackData: T[]): T[] {
  const [data, setData] = useState<T[]>(fallbackData);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    apiFetch<T>(tableName)
      .then(json => {
        if (Array.isArray(json) && json.length > 0 && (json[0] as any).id === 'singleton' && (json[0] as any).collection) {
          setData((json[0] as any).collection);
        } else if (Array.isArray(json) && json.length > 0 && !(json[0] as any).collection) {
          setData(json);
        } else if (Array.isArray(json) && json.length === 0 && fallbackData.length > 0) {
          setData(fallbackData);
        }
      })
      .catch(err => {
        console.error('Failed to fetch from API:', err);
      });
  }, [tableName]);

  return data;
}

/**
 * A hook that loads data from API, provides a setter, and saves the ENTIRE array to the API.
 * Uses a special "collection" record under the hood if it's an array to make it easy to migrate apiStorage.
 * Actually, our CRUD endpoints save individual generic objects via POST. 
 * If we pass a whole array, the server needs to handle it or we use a separate endpoint.
 */
export function useApiStorage<T>(key: string, initialData: T[]): [T[], (newData: T[] | ((prev: T[]) => T[])) => void, boolean] {
  const [data, setLocalData] = useState<T[]>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = () => {
    apiFetch<any>(key)
      .then(json => {
        if (Array.isArray(json) && json.length > 0 && json[0].id === 'singleton' && json[0].collection) {
          setLocalData(json[0].collection);
        } else if (Array.isArray(json) && json.length > 0 && !json[0].collection) {
          setLocalData(json);
        } else if (Array.isArray(json) && json.length === 0 && initialData.length > 0) {
          setLocalData(initialData);
        }
        setIsLoaded(true);
      })
      .catch(err => {
        console.error(`Failed to fetch ${key}:`, err);
        const stored = apiStorage.getItem(key);
        if (stored) {
          try { setLocalData(JSON.parse(stored)); } catch { }
        }
        setIsLoaded(true);
      });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    loadData();

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent.detail || customEvent.detail.key === key) {
         const stored = apiStorage.getItem(key);
         if (stored) {
             try { setLocalData(JSON.parse(stored)); } catch { }
         }
      }
    };
    
    window.addEventListener('app-storage-sync', handleSync);
    return () => window.removeEventListener('app-storage-sync', handleSync);
  }, [key]);

  const setData = useCallback((newData: T[] | ((prev: T[]) => T[])) => {
    setLocalData(prev => {
      const nextData = typeof newData === 'function' ? (newData as Function)(prev) : newData;
      // Fire and forget generic save! We write it as a single JSON blob under a generic row id="global" 
      // or we sync each item. To match localStorage behavior perfectly, 
      // let's save the ENTIRE array as a single object with ID "singleton" in a generic table.
      
      const payload = { id: 'singleton', collection: nextData };
      const baseUrl = getBaseUrl();
      fetch(`${baseUrl}/api/data/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => {
        console.error(`Failed to sync ${key} to backend:`, err);
        // Fallback to localStorage
        apiStorage.setItem(key, JSON.stringify(nextData));
      });

      return nextData;
    });
  }, [key]);

  return [data, setData, isLoaded];
}
