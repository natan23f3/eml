import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipo para material educacional
type EducationalMaterial = {
  id: string;
  title: string;
  description: string;
  type: 'partitura' | 'exercicio' | 'video' | 'audio' | 'artigo' | 'outro';
  fileUrl: string;
  thumbnailUrl?: string;
  courseIds: string[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  author: string;
  uploadDate: string;
  downloads: number;
  tags: string[];
  isPublic: boolean;
};

// Tipo para curso
type Course = {
  id: string;
  name: string;
};

// Schema para validação do formulário
const materialSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  type: z.string().min(1, { message: 'Selecione um tipo de material' }),
  courseIds: z.array(z.string()).min(1, { message: 'Associe a pelo menos um curso' }),
  level: z.string().min(1, { message: 'Selecione um nível' }),
  author: z.string().min(3, { message: 'O autor deve ter pelo menos 3 caracteres' }),
  tags: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

export default function MateriaisEducacionais() {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<EducationalMaterial | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Dados de exemplo para materiais
  const [materials, setMaterials] = useState<EducationalMaterial[]>([
    {
      id: '1',
      title: 'Partitura: Clair de Lune (Debussy)',
      description: 'Partitura completa da obra Clair de Lune de Claude Debussy, com anotações para estudo.',
      type: 'partitura',
      fileUrl: '/materiais/partituras/debussy_clair_de_lune.pdf',
      thumbnailUrl: '/thumbnails/clair_de_lune.jpg',
      courseIds: ['1', '5'],
      level: 'intermediario',
      author: 'Claude Debussy (Ed. Maria Silva)',
      uploadDate: '2023-05-15T14:30:00.000Z',
      downloads: 87,
      tags: ['piano', 'clássico', 'impressionismo'],
      isPublic: true
    },
    {
      id: '2',
      title: 'Exercícios de Técnica para Violão',
      description: 'Conjunto de exercícios para desenvolvimento técnico no violão, focando em coordenação e velocidade.',
      type: 'exercicio',
      fileUrl: '/materiais/exercicios/violao_tecnica.pdf',
      courseIds: ['2'],
      level: 'iniciante',
      author: 'João Oliveira',
      uploadDate: '2023-06-10T10:15:00.000Z',
      downloads: 124,
      tags: ['violão', 'técnica', 'iniciante'],
      isPublic: true
    },
    {
      id: '3',
      title: 'Videoaula: Improvisação no Jazz',
      description: 'Vídeo explicativo sobre conceitos básicos de improvisação no jazz, com exemplos práticos no piano.',
      type: 'video',
      fileUrl: 'https://youtube.com/watch?v=abc123',
      thumbnailUrl: '/thumbnails/jazz_improv.jpg',
      courseIds: ['1', '3', '8'],
      level: 'avancado',
      author: 'Roberto Almeida',
      uploadDate: '2023-07-05T16:45:00.000Z',
      downloads: 56,
      tags: ['jazz', 'improvisação', 'piano', 'teoria'],
      isPublic: true
    },
    {
      id: '4',
      title: 'Estudo Op. 10 No. 12 (Chopin)',
      description: 'Partitura do Estudo "Revolucionário" de Chopin com dicas de prática.',
      type: 'partitura',
      fileUrl: '/materiais/partituras/chopin_op10_no12.pdf',
      thumbnailUrl: '/thumbnails/chopin_revolutionary.jpg',
      courseIds: ['1', '5'],
      level: 'avancado',
      author: 'Frédéric Chopin (Ed. Carlos Fernandes)',
      uploadDate: '2023-04-20T11:10:00.000Z',
      downloads: 63,
      tags: ['piano', 'clássico', 'romântico', 'estudos'],
      isPublic: true
    },
    {
      id: '5',
      title: 'Apostila de Teoria Musical - Fundamentos',
      description: 'Material didático abordando os conceitos fundamentais da teoria musical: notação, escalas, intervalos e acordes.',
      type: 'artigo',
      fileUrl: '/materiais/apostilas/teoria_musical_fundamentos.pdf',
      courseIds: ['7', '8'],
      level: 'iniciante',
      author: 'Equipe Pedagógica',
      uploadDate: '2023-03-12T09:30:00.000Z',
      downloads: 215,
      tags: ['teoria', 'fundamentos', 'escalas', 'acordes'],
      isPublic: true
    },
    {
      id: '6',
      title: 'Áudio: Exemplos de Timbres - Instrumentos de Sopro',
      description: 'Arquivo de áudio com exemplos dos diferentes timbres e sonoridades dos principais instrumentos de sopro.',
      type: 'audio',
      fileUrl: '/materiais/audio/timbres_sopro.mp3',
      courseIds: ['4', '8'],
      level: 'iniciante',
      author: 'Ana Beatriz Santos',
      uploadDate: '2023-06-28T15:20:00.000Z',
      downloads: 42,
      tags: ['sopro', 'timbres', 'instrumentação'],
      isPublic: true
    }
  ]);
  
  // Dados de exemplo para cursos
  const courses: Course[] = [
    { id: '1', name: 'Piano' },
    { id: '2', name: 'Violão' },
    { id: '3', name: 'Canto' },
    { id: '4', name: 'Flauta' },
    { id: '5', name: 'Piano Avançado' },
    { id: '6', name: 'Bateria' },
    { id: '7', name: 'Teoria Musical' },
    { id: '8', name: 'Composição' },
  ];
  
  // Configuração do formulário
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: '',
      description: '',
      type: '',
      courseIds: [],
      level: '',
      author: '',
      tags: '',
      isPublic: true,
    },
  });
  
  // Filtrar materiais com base na aba ativa e no termo de pesquisa
  const filteredMaterials = materials
    .filter(material => {
      if (activeTab === 'todos') return true;
      return material.type === activeTab;
    })
    .filter(material => {
      if (!searchTerm) return true;
      
      return (
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  };
  
  // Função para obter nome dos cursos
  const getCourseNames = (courseIds: string[]) => {
    return courseIds.map(id => {
      const course = courses.find(c => c.id === id);
      return course ? course.name : '';
    }).filter(Boolean).join(', ');
  };
  
  // Função para obter um ícone baseado no tipo
  const getIconForType = (type: EducationalMaterial['type']) => {
    switch (type) {
      case 'partitura':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
          </svg>
        );
      case 'exercicio':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
          </svg>
        );
      case 'audio':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        );
      case 'artigo':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
    }
  };
  
  // Função para obter a cor do nível
  const getLevelColor = (level: EducationalMaterial['level']) => {
    switch (level) {
      case 'iniciante':
        return 'bg-green-100 text-green-800';
      case 'intermediario':
        return 'bg-blue-100 text-blue-800';
      case 'avancado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para obter o texto do nível
  const getLevelText = (level: EducationalMaterial['level']) => {
    switch (level) {
      case 'iniciante':
        return 'Iniciante';
      case 'intermediario':
        return 'Intermediário';
      case 'avancado':
        return 'Avançado';
      default:
        return level;
    }
  };
  
  // Função para enviar o formulário
  const onSubmit = (values: MaterialFormValues) => {
    // Processar tags
    const tags = values.tags 
      ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];
    
    // Criar o novo material
    const newMaterial: EducationalMaterial = {
      id: (materials.length + 1).toString(),
      title: values.title,
      description: values.description,
      type: values.type as EducationalMaterial['type'],
      fileUrl: '/materiais/temp/arquivo.pdf', // Exemplo - em produção seria um upload real
      courseIds: values.courseIds,
      level: values.level as EducationalMaterial['level'],
      author: values.author,
      uploadDate: new Date().toISOString(),
      downloads: 0,
      tags,
      isPublic: values.isPublic
    };
    
    // Adicionar o novo material à lista
    setMaterials([...materials, newMaterial]);
    
    // Fechar o diálogo e resetar o formulário
    setIsDialogOpen(false);
    form.reset();
    
    // Mostrar mensagem de sucesso
    toast({
      title: 'Material adicionado',
      description: `O material "${values.title}" foi adicionado com sucesso.`,
    });
  };
  
  // Função para download
  const handleDownload = (material: EducationalMaterial) => {
    // Em uma implementação real, isso iniciaria o download
    // Para fins de demonstração, apenas incrementamos o contador
    
    const updatedMaterials = materials.map(m => {
      if (m.id === material.id) {
        return { ...m, downloads: m.downloads + 1 };
      }
      return m;
    });
    
    setMaterials(updatedMaterials);
    
    toast({
      title: 'Download iniciado',
      description: `O download de "${material.title}" foi iniciado.`,
    });
  };
  
  // Função para abrir detalhes
  const openDetails = (material: EducationalMaterial) => {
    setSelectedMaterial(material);
    setDetailsDialogOpen(true);
  };
  
  return (
    <MainLayout
      title="Materiais Educacionais"
      description="Biblioteca de recursos didáticos para alunos e professores."
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 relative max-w-sm">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar materiais..."
            className="pl-10"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" 
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Adicionar Material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Material</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do material" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o material..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="partitura">Partitura</SelectItem>
                            <SelectItem value="exercicio">Exercício</SelectItem>
                            <SelectItem value="video">Vídeo</SelectItem>
                            <SelectItem value="audio">Áudio</SelectItem>
                            <SelectItem value="artigo">Artigo/Apostila</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="iniciante">Iniciante</SelectItem>
                            <SelectItem value="intermediario">Intermediário</SelectItem>
                            <SelectItem value="avancado">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do autor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="courseIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Cursos Relacionados</FormLabel>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto border rounded-md p-4">
                        {courses.map((course) => (
                          <FormField
                            key={course.id}
                            control={form.control}
                            name="courseIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={course.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(course.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, course.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== course.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {course.name}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Adicione tags separadas por vírgula" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Material público
                        </FormLabel>
                        <p className="text-sm text-gray-500">
                          Se marcado, estará disponível para todos os alunos.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="border rounded-md p-4 bg-blue-50">
                  <p className="text-sm text-blue-800 mb-2 font-medium">Upload de Arquivo</p>
                  <p className="text-xs text-blue-600 mb-3">
                    Para funcionalidade completa, será necessário implementar upload de arquivos. Esta interface é apenas demonstrativa.
                  </p>
                  <Input type="file" className="bg-white" />
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Adicionar Material
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="todos" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 sm:w-[600px]">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="partitura">Partituras</TabsTrigger>
          <TabsTrigger value="exercicio">Exercícios</TabsTrigger>
          <TabsTrigger value="video">Vídeos</TabsTrigger>
          <TabsTrigger value="audio">Áudios</TabsTrigger>
          <TabsTrigger value="artigo">Artigos</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="overflow-hidden flex flex-col">
            <div className="bg-gray-100 flex items-center justify-center p-6">
              {getIconForType(material.type)}
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {material.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(material.level)}`}>
                  {getLevelText(material.level)}
                </span>
                {material.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {tag}
                  </span>
                ))}
                {material.tags.length > 3 && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    +{material.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>{material.author}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatDate(material.uploadDate)}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span>Downloads: {material.downloads}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                  <span>{getCourseNames(material.courseIds)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => openDetails(material)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Detalhes
              </Button>
              <Button onClick={() => handleDownload(material)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {filteredMaterials.length === 0 && (
          <div className="col-span-3 py-10 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto mb-3 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" 
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p>Nenhum material encontrado</p>
          </div>
        )}
      </div>
      
      {/* Diálogo de Detalhes */}
      {selectedMaterial && (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedMaterial.title}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-gray-100 p-4 rounded-md">
                  {getIconForType(selectedMaterial.type)}
                </div>
                <div className="flex-1">
                  <p className="mb-3">{selectedMaterial.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedMaterial.level)}`}>
                      {getLevelText(selectedMaterial.level)}
                    </span>
                    {selectedMaterial.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="text-gray-600 mr-2">Autor:</span>
                  <span className="font-medium">{selectedMaterial.author}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600 mr-2">Data de upload:</span>
                  <span className="font-medium">{formatDate(selectedMaterial.uploadDate)}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="text-gray-600 mr-2">Downloads:</span>
                  <span className="font-medium">{selectedMaterial.downloads}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600 mr-2">Visibilidade:</span>
                  <span className="font-medium">{selectedMaterial.isPublic ? 'Público' : 'Privado'}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Cursos Relacionados</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.courseIds.map((courseId) => {
                    const course = courses.find(c => c.id === courseId);
                    return course ? (
                      <span key={courseId} className="px-3 py-1 rounded-md text-sm bg-blue-50 text-blue-700 border border-blue-200">
                        {course.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border">
                <h4 className="text-sm font-medium mb-2">Link do Material</h4>
                <code className="text-xs bg-white p-2 rounded border block overflow-x-auto">
                  {selectedMaterial.fileUrl}
                </code>
              </div>
              
              <DialogFooter className="mt-2">
                <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  handleDownload(selectedMaterial);
                  setDetailsDialogOpen(false);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
}