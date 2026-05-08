export let inMemoryCache: Record<string, string> = {};

export const initApiStorage = async () => {
    try {
        const res = await fetch('/api/data/global_storage');
        if (res.ok) {
            const data = await res.json();
            data.forEach((row: any) => {
               if (row.value) {
                 inMemoryCache[row.id] = row.value;
                 // Push down to actual localStorage to ensure it's available synchronously if needed
                 localStorage.setItem(row.id, row.value);
               }
            });
        }
    } catch (e) {
        console.error("Failed to init storage", e);
    }
}

export const apiStorage = {
    getItem: (key: string) => {
        return inMemoryCache[key] || localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        inMemoryCache[key] = value;
        localStorage.setItem(key, value); 
        
        fetch(`/api/data/global_storage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: key, value })
        }).catch(err => console.error("Failed to sync storage to DB:", err));
    },
    removeItem: (key: string) => {
        delete inMemoryCache[key];
        localStorage.removeItem(key);
        
        fetch(`/api/data/global_storage/${key}`, {
            method: 'DELETE'
        }).catch(err => console.error("Failed to delete from DB:", err));
    },
    get length() {
        return Object.keys(inMemoryCache).length;
    },
    key: (index: number) => {
        return Object.keys(inMemoryCache)[index] || null;
    }
};
