import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

// Simplified app for debugging
function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <div className="flex items-center justify-center h-screen">
        <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <h1 className="text-xl font-bold text-center">MusicSchool Pro</h1>
          <p className="mt-4 text-center">Sistema de Gestão para Escolas de Música</p>
          <div className="mt-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">Carregando aplicação...</p>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
