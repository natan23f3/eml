import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Download, 
  Music, 
  BookOpen, 
  Video, 
  File, 
  Eye, 
  Share2,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

interface Material {
  id: string | number;
  title: string;
  description: string;
  type: 'sheet_music' | 'tutorial' | 'video' | 'other';
  fileUrl: string;
  thumbnailUrl?: string;
  instrument: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  uploadDate: string | Date;
  downloads: number;
  teacherId: number;
  teacherName?: string;
}

interface MaterialsListProps {
  materials: Material[];
  isLoading?: boolean;
}

export function MaterialsList({ materials = [], isLoading = false }: MaterialsListProps) {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sheet_music':
        return <Music className="h-5 w-5" />;
      case 'tutorial':
        return <BookOpen className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'sheet_music':
        return 'Partitura';
      case 'tutorial':
        return 'Tutorial';
      case 'video':
        return 'Vídeo';
      default:
        return 'Outro';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return level;
    }
  };

  const handleDownload = async (material: Material) => {
    try {
      setDownloadingId(material.id);
      
      // Get the download URL from Firebase Storage
      const storageRef = ref(storage, material.fileUrl);
      const url = await getDownloadURL(storageRef);
      
      // Create a hidden anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = material.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: 'Download iniciado',
        description: `${material.title} será baixado em instantes.`,
      });
      
      // Update the download count in the database (this would be implemented in a real app)
      // api.post('/api/educational-materials/download', { id: material.id });
      
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Erro ao baixar arquivo',
        description: 'Ocorreu um erro ao tentar baixar este material. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="overflow-hidden">
            <div className="h-40 bg-gray-100">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center p-10 border rounded-lg">
        <File className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium mb-2">Nenhum material encontrado</h3>
        <p className="text-gray-500">
          Não há materiais didáticos disponíveis para os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <Card key={material.id} className="overflow-hidden flex flex-col">
          <div className="h-40 bg-gray-100 relative">
            {material.thumbnailUrl ? (
              <img 
                src={material.thumbnailUrl} 
                alt={material.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                {getTypeIcon(material.type)}
              </div>
            )}
            <Badge 
              className={`absolute top-2 right-2 ${getLevelColor(material.level)}`}
            >
              {getLevelName(material.level)}
            </Badge>
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{material.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formatDate(material.uploadDate)}
              {material.teacherName && (
                <span className="ml-2">por {material.teacherName}</span>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {material.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="flex items-center gap-1">
                {getTypeIcon(material.type)}
                <span>{getTypeName(material.type)}</span>
              </Badge>
              <Badge variant="outline">
                {material.instrument}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{material.downloads}</span>
              </Badge>
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <Button 
              className="w-full flex items-center justify-center gap-2" 
              onClick={() => handleDownload(material)}
              disabled={downloadingId === material.id}
            >
              <Download className="h-4 w-4" />
              {downloadingId === material.id ? 'Baixando...' : 'Baixar Material'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}