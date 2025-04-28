import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SchoolSettings {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolCnpj: string;
  schoolAddress: string;
  weekdayHours: string;
  weekendHours: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
}

interface SchoolSettingsContextType {
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  isSaving: boolean;
  saveSettings: () => Promise<void>;
}

const defaultSettings: SchoolSettings = {
  schoolName: 'MusicSchool Pro',
  schoolEmail: 'contato@musicschoolpro.com',
  schoolPhone: '(11) 99999-9999',
  schoolCnpj: '00.000.000/0001-00',
  schoolAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100',
  weekdayHours: '08:00 - 20:00',
  weekendHours: '09:00 - 16:00',
  primaryColor: '#4f46e5', // Indigo
  secondaryColor: '#06b6d4', // Cyan
  logoUrl: null,
};

const SchoolSettingsContext = createContext<SchoolSettingsContextType | undefined>(undefined);

export function SchoolSettingsProvider({ children }: { children: ReactNode }) {
  // Try to load settings from localStorage or use defaults
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const savedSettings = localStorage.getItem('schoolSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const [isSaving, setIsSaving] = useState(false);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('schoolSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const saveSettings = async (): Promise<void> => {
    setIsSaving(true);
    
    // Simulate an API call to save settings
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('schoolSettings', JSON.stringify(settings));
        setIsSaving(false);
        resolve();
      }, 1000);
    });
  };

  return (
    <SchoolSettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      isSaving,
      saveSettings
    }}>
      {children}
    </SchoolSettingsContext.Provider>
  );
}

export function useSchoolSettings() {
  const context = useContext(SchoolSettingsContext);
  
  if (context === undefined) {
    throw new Error('useSchoolSettings must be used within a SchoolSettingsProvider');
  }
  
  return context;
}