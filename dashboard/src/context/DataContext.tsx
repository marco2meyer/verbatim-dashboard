import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type RootData } from '../types';

interface DataContextType {
  data: RootData | null;
  loading: boolean;
  error: string | null;
  saveData: (newData: RootData) => Promise<void>;
  updateData: (newData: RootData) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RootData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/data/values_dashboard.json');
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const updateData = (newData: RootData) => {
    setData(newData);
  };

  const saveData = async (newData: RootData) => {
    try {
      const response = await fetch('http://localhost:3001/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      setData(newData);
    } catch (err) {
      console.error('Error saving data:', err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{ data, loading, error, saveData, updateData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
