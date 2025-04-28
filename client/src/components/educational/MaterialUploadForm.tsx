import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed file types
const ACCEPTED_FILE_TYPES = [
  'application/pdf', 
  'image/jpeg', 
  'image/png', 
  'audio/mpeg', 
  'video/mp4',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/msword', // doc
];

// Schema for form validation
const materialUploadSchema = z.object({
  title: z.string().min(3, { message: 'Título precisa ter no mínimo 3 caracteres' }),
  description: z.string().min(10, { message: 'Descrição precisa ter no mínimo 10 caracteres' }),
  type: z.enum(['sheet_music', 'tutorial', 'video', 'other'], {
    required_error: 'Selecione o tipo de material',
  }),
  instrument: z.string().min(1, { message: 'Selecione um instrumento' }),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Selecione o nível',
  }),
  file: z.any()
    .refine((file) => file?.size !== 0, "Arquivo é obrigatório")
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Tamanho máximo do arquivo é 5MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      "Formato de arquivo inválido. Use PDF, imagens, áudio ou vídeo."
    ),
  thumbnail: z.any()
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE, 
      "Tamanho máximo da miniatura é 5MB"
    )
    .refine(
      (file) => !file || ['image/jpeg', 'image/png'].includes(file?.type),
      "Miniatura deve ser uma imagem (JPG ou PNG)"
    ),
});

type MaterialUploadFormValues = z.infer<typeof materialUploadSchema>;

interface MaterialUploadFormProps {
  onComplete: () => void;
}

export function MaterialUploadForm({ onComplete }: MaterialUploadFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Instrument options
  const instruments = [
    'Violão',
    'Piano',
    'Teclado',
    'Bateria',
    'Violino',
    'Viola',
    'Violoncelo',
    'Flauta',
    'Saxofone',
    'Trompete',
    'Baixo',
    'Guitarra',
    'Ukulele',
    'Cavaquinho',
    'Canto',
    'Outro',
  ];

  // Initialize form
  const form = useForm<MaterialUploadFormValues>({
    resolver: zodResolver(materialUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'sheet_music',
      instrument: '',
      level: 'beginner',
    },
  });

  // Upload file to Firebase Storage
  const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create storage reference
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register observers
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Update progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          // Handle successful uploads
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Create material mutation
  const createMaterial = useMutation({
    mutationFn: async (formData: any) => {
      return apiRequest('/api/educational-materials', {
        method: 'POST',
        data: formData,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Material enviado com sucesso!',
        description: 'O material didático foi enviado e já está disponível para os alunos.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/educational-materials'] });
      setUploadStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        form.reset();
        setUploadProgress(0);
        setIsUploading(false);
        setUploadStatus('idle');
        onComplete();
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao enviar material',
        description: 'Ocorreu um erro ao salvar. Tente novamente.',
        variant: 'destructive',
      });
      console.error(error);
      setUploadStatus('error');
      setIsUploading(false);
    },
  });

  const onSubmit = async (values: MaterialUploadFormValues) => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      
      // Get files from form
      const file = values.file as File;
      const thumbnail = values.thumbnail as File | undefined;
      
      // Upload main file to Firebase Storage
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileUrl = await uploadFileToStorage(
        file, 
        `materials/${values.type}/${timestamp}-${file.name}`
      );
      
      // Upload thumbnail if provided
      let thumbnailUrl = undefined;
      if (thumbnail) {
        thumbnailUrl = await uploadFileToStorage(
          thumbnail,
          `materials/thumbnails/${timestamp}-${thumbnail.name}`
        );
      }
      
      // Submit data to API
      await createMaterial.mutateAsync({
        title: values.title,
        description: values.description,
        type: values.type,
        instrument: values.instrument,
        level: values.level,
        fileUrl,
        thumbnailUrl,
        // In a real app, these would be set by the server:
        uploadDate: new Date(),
        downloads: 0,
        teacherId: 1, // This would be the current user's ID
      });
      
    } catch (error) {
      console.error('Error during upload:', error);
      toast({
        title: 'Falha no upload',
        description: 'Não foi possível fazer o upload do arquivo. Tente novamente.',
        variant: 'destructive',
      });
      setUploadStatus('error');
      setIsUploading(false);
    }
  };

  // Helper to show the current selected file name
  const getSelectedFileName = (fieldName: 'file' | 'thumbnail') => {
    const file = form.getValues(fieldName) as File;
    if (!file?.name) return '';
    return `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
  };

  // Helper function to clear file input
  const clearFileInput = (fieldName: 'file' | 'thumbnail') => {
    form.setValue(fieldName, undefined);
    form.trigger(fieldName);
    
    // Reset the file input value
    if (fieldName === 'file' && fileInputRef.current) {
      fileInputRef.current.value = '';
    } else if (fieldName === 'thumbnail' && thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Título do material" 
                  {...field} 
                  disabled={isUploading}
                />
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
                  placeholder="Descreva o material didático..." 
                  {...field} 
                  rows={3}
                  disabled={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Material</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isUploading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sheet_music">Partitura</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrumento</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isUploading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o instrumento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {instruments.map((instrument) => (
                      <SelectItem key={instrument} value={instrument}>
                        {instrument}
                      </SelectItem>
                    ))}
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
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isUploading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Arquivo</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      {...field}
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      disabled={isUploading}
                      className={value ? 'file:hidden' : ''}
                    />
                    {value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => clearFileInput('file')}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {value && (
                    <div className="text-sm text-gray-500">
                      {getSelectedFileName('file')}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Arquivos suportados: PDF, imagens, áudio ou vídeo (máx. 5MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Miniatura (opcional)</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      {...field}
                      ref={thumbnailInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      disabled={isUploading}
                      className={value ? 'file:hidden' : ''}
                    />
                    {value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => clearFileInput('thumbnail')}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {value && (
                    <div className="text-sm text-gray-500">
                      {getSelectedFileName('thumbnail')}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Imagem de capa para o material (apenas JPG ou PNG, máx. 5MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Enviando arquivo...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="bg-green-50 p-3 rounded-md flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            <span>Material enviado com sucesso!</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="bg-red-50 p-3 rounded-md flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>Erro ao enviar o material. Tente novamente.</span>
          </div>
        )}

        <div className="pt-4 flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onComplete}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>Enviando...</>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Enviar Material
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}