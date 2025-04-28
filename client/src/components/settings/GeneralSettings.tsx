import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSchoolSettings } from "@/providers/SchoolSettingsProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const settingsSchema = z.object({
  schoolName: z.string().min(3, {
    message: "O nome da escola deve ter pelo menos 3 caracteres.",
  }),
  schoolEmail: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  schoolPhone: z.string().min(10, {
    message: "Por favor, insira um número de telefone válido.",
  }),
  schoolCnpj: z.string().min(14, {
    message: "Por favor, insira um CNPJ válido.",
  }),
  schoolAddress: z.string().min(10, {
    message: "O endereço deve ter pelo menos 10 caracteres.",
  }),
  weekdayHours: z.string().min(5, {
    message: "Por favor, insira os horários de funcionamento de dias úteis.",
  }),
  weekendHours: z.string().min(5, {
    message: "Por favor, insira os horários de funcionamento de fim de semana.",
  }),
});

export function GeneralSettings() {
  const { settings, updateSettings, isSaving, saveSettings } = useSchoolSettings();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      schoolName: settings.schoolName,
      schoolEmail: settings.schoolEmail,
      schoolPhone: settings.schoolPhone,
      schoolCnpj: settings.schoolCnpj,
      schoolAddress: settings.schoolAddress,
      weekdayHours: settings.weekdayHours,
      weekendHours: settings.weekendHours,
    },
  });

  async function onSubmit(values: z.infer<typeof settingsSchema>) {
    try {
      updateSettings(values);
      await saveSettings();
      toast({
        title: "Configurações salvas",
        description: "As configurações da escola foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
        <CardDescription>
          Gerencie as informações básicas da sua escola de música
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações da Escola</h3>
              <Separator />
              
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Escola</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da escola" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este é o nome oficial da sua escola de música.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="schoolEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="contato@escolademusica.com.br" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="schoolPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 1234-5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="schoolCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0001-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="schoolAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua da Música, 123 - Bairro, Cidade - UF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <h3 className="text-lg font-medium mt-6">Horários de Funcionamento</h3>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weekdayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dias Úteis</FormLabel>
                      <FormControl>
                        <Input placeholder="09:00 - 18:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weekendHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fim de Semana</FormLabel>
                      <FormControl>
                        <Input placeholder="10:00 - 14:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="mr-2">Salvando...</span>
                  <span className="h-4 w-4 rounded-full border-2 border-r-transparent animate-spin" />
                </>
              ) : (
                "Salvar Configurações"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}