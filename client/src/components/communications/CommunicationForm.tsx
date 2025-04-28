import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, PhoneCall, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schemas
const communicationSchema = z.object({
  type: z.enum(["email", "sms", "call"]),
  subject: z.string().optional(),
  content: z.string().min(3, "O conteúdo é obrigatório e deve ter pelo menos 3 caracteres."),
  studentId: z.number().optional(),
  status: z.string().default("sent"),
});

type CommunicationFormValues = z.infer<typeof communicationSchema>;

interface CommunicationFormProps {
  type: 'email' | 'sms' | 'call';
  onComplete: () => void;
}

export function CommunicationForm({ type, onComplete }: CommunicationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>(undefined);
  
  // Fetch students data for dropdown
  const { data: students } = useQuery({
    queryKey: ['/api/students'],
  });

  // Create form with validation
  const form = useForm<CommunicationFormValues>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      type,
      subject: "",
      content: "",
      studentId: undefined,
      status: "sent"
    }
  });

  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 mr-2" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'call':
        return <PhoneCall className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  // Create mutation for submitting the form
  const mutation = useMutation({
    mutationFn: async (values: CommunicationFormValues) => {
      return apiRequest({
        method: 'POST',
        url: '/api/communications',
        data: {
          type: values.type,
          subject: values.subject,
          content: values.content,
          studentId: values.studentId,
          status: values.status,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      toast({
        title: "Comunicação registrada com sucesso!",
        description: type === 'email' ? "O email foi enviado." : type === 'sms' ? "O SMS foi enviado." : "A ligação foi registrada.",
      });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Erro ao registrar comunicação",
        description: "Ocorreu um erro ao enviar a comunicação. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (values: CommunicationFormValues) => {
    // Update the studentId if one was selected
    values.studentId = selectedStudentId;
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipient selector */}
        <div className="space-y-4">
          <FormLabel>Destinatário</FormLabel>
          <Select
            value={selectedStudentId?.toString() || ""}
            onValueChange={(value) => setSelectedStudentId(value ? Number(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um aluno (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Comunicação geral</SelectItem>
              {students?.map((student: any) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.firstName} {student.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Only show subject for emails */}
        {type === 'email' && (
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assunto</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o assunto do email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {type === 'email' 
                  ? 'Conteúdo do email' 
                  : type === 'sms' 
                    ? 'Mensagem SMS' 
                    : 'Resumo da ligação'
                }
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    type === 'email'
                      ? 'Digite o conteúdo do email...'
                      : type === 'sms'
                        ? 'Digite a mensagem de texto...'
                        : 'Resumo da conversa telefônica...'
                  }
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending} className="flex items-center">
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                {getIcon()}
                {type === 'email' 
                  ? 'Enviar Email' 
                  : type === 'sms' 
                    ? 'Enviar SMS' 
                    : 'Registrar Ligação'
                }
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}