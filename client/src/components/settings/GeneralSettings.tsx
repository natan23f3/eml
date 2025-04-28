import { useEffect } from 'react';
import { useSchoolSettings } from '@/providers/SchoolSettingsProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, PaintBucket, Upload } from 'lucide-react';

const GeneralSettings = () => {
  const { settings, updateSettings, saveSettings, isSaving } = useSchoolSettings();
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    try {
      await saveSettings();
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="schoolName">Nome da Escola</Label>
          <Input 
            id="schoolName" 
            value={settings.schoolName} 
            onChange={(e) => updateSettings({ schoolName: e.target.value })}
            placeholder="Nome da sua escola de música" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="schoolEmail">Email de Contato</Label>
          <Input 
            id="schoolEmail" 
            type="email" 
            value={settings.schoolEmail}
            onChange={(e) => updateSettings({ schoolEmail: e.target.value })}
            placeholder="contato@suaescola.com" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="schoolPhone">Telefone</Label>
          <Input 
            id="schoolPhone" 
            value={settings.schoolPhone}
            onChange={(e) => updateSettings({ schoolPhone: e.target.value })}
            placeholder="(00) 00000-0000" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="schoolCnpj">CNPJ</Label>
          <Input 
            id="schoolCnpj" 
            value={settings.schoolCnpj}
            onChange={(e) => updateSettings({ schoolCnpj: e.target.value })}
            placeholder="00.000.000/0001-00" 
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="schoolAddress">Endereço</Label>
          <Input 
            id="schoolAddress" 
            value={settings.schoolAddress}
            onChange={(e) => updateSettings({ schoolAddress: e.target.value })}
            placeholder="Endereço completo da escola" 
          />
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">Horário de Funcionamento</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weekdayHours">Segunda a Sexta</Label>
            <Input 
              id="weekdayHours" 
              value={settings.weekdayHours}
              onChange={(e) => updateSettings({ weekdayHours: e.target.value })}
              placeholder="08:00 - 18:00" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weekendHours">Sábados</Label>
            <Input 
              id="weekendHours" 
              value={settings.weekendHours}
              onChange={(e) => updateSettings({ weekendHours: e.target.value })}
              placeholder="09:00 - 13:00" 
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">Personalização</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Cor Principal</Label>
            <div className="flex space-x-2">
              <Input 
                id="primaryColor" 
                value={settings.primaryColor}
                onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                placeholder="#4f46e5" 
              />
              <div 
                className="w-10 h-10 rounded border" 
                style={{ backgroundColor: settings.primaryColor }}
              >
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Código hexadecimal (ex: #4f46e5)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Cor Secundária</Label>
            <div className="flex space-x-2">
              <Input 
                id="secondaryColor" 
                value={settings.secondaryColor}
                onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                placeholder="#06b6d4" 
              />
              <div 
                className="w-10 h-10 rounded border" 
                style={{ backgroundColor: settings.secondaryColor }}
              >
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Código hexadecimal (ex: #06b6d4)
            </p>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="logoUpload">Logo da Escola</Label>
            <div className="flex items-center gap-4">
              {settings.logoUrl ? (
                <div className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden">
                  <img 
                    src={settings.logoUrl} 
                    alt="Logo da escola" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded border flex items-center justify-center bg-gray-50 text-gray-400">
                  <PaintBucket className="w-6 h-6" />
                </div>
              )}
              <Button variant="outline" className="flex gap-2 items-center">
                <Upload className="w-4 h-4" />
                {settings.logoUrl ? 'Alterar logo' : 'Carregar logo'}
              </Button>
              {settings.logoUrl && (
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSettings({ logoUrl: null })}
                  className="text-red-500 hover:text-red-700"
                >
                  Remover
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recomendado: imagem quadrada de pelo menos 200x200 pixels
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center gap-2">
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;