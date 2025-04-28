import { ReactNode } from 'react';
import Navbar from './Navbar';

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function MainLayout({ 
  children, 
  title = 'MusicSchool Pro', 
  description 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {(title || description) && (
            <div className="mb-8">
              {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
              {description && <p className="text-gray-600">{description}</p>}
            </div>
          )}
          
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            MusicSchool Pro • Sistema de Gestão para Escolas de Música • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}