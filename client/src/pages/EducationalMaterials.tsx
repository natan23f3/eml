import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Search, Filter, Download, Music, BookOpen, Video, File } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MaterialUploadForm } from '@/components/educational/MaterialUploadForm';
import { MaterialsList } from '@/components/educational/MaterialsList';

export default function EducationalMaterials() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch educational materials data
  const { data: materials, isLoading } = useQuery({
    queryKey: ['/api/educational-materials'],
  });

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // Filter materials based on search term and active tab
  const filteredMaterials = (materials || []).filter((material: any) => {
    // Filter by search term
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.instrument.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type (tab)
    const matchesType = activeTab === 'all' || material.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-heading font-bold">Materiais Didáticos</h1>
        
        {/* Only show upload button for admin/teacher users */}
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Enviar Material
        </Button>
      </div>

      {/* Search and filter section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar materiais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Materials listing with tabs for filtering */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="sheet_music">Partituras</TabsTrigger>
          <TabsTrigger value="tutorial">Tutoriais</TabsTrigger>
          <TabsTrigger value="video">Vídeos</TabsTrigger>
          <TabsTrigger value="other">Outros</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <MaterialsList 
            materials={filteredMaterials} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="sheet_music">
          <MaterialsList 
            materials={filteredMaterials} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="tutorial">
          <MaterialsList 
            materials={filteredMaterials} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="video">
          <MaterialsList 
            materials={filteredMaterials} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="other">
          <MaterialsList 
            materials={filteredMaterials} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>

      {/* Upload dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Enviar Material Didático</DialogTitle>
          </DialogHeader>
          <MaterialUploadForm onComplete={handleDialogClose} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}