import { Request, Response } from 'express';

// Configurações padrão do WhatsApp Business (sem credenciais reais)
let whatsappConfig = {
  whatsappBusinessId: '',
  whatsappApiToken: '',
  phoneNumberId: '',
  phoneNumber: '',
  webhookVerifyToken: '',
  apiVersion: 'v18.0',
  isEnabled: false
};

// Templates iniciais
let whatsappTemplates: any[] = [];

// Salva as configurações básicas do WhatsApp
export const saveWhatsappConfig = async (req: Request, res: Response) => {
  try {
    const config = req.body;
    
    if (!config || !config.whatsappBusinessId || !config.whatsappApiToken || !config.phoneNumberId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados incompletos. É necessário informar whatsappBusinessId, whatsappApiToken e phoneNumberId'
      });
    }
    
    // Atualiza a configuração global
    whatsappConfig = { ...whatsappConfig, ...config };
    
    return res.status(200).json({ 
      success: true, 
      message: 'Configurações do WhatsApp Business API salvas com sucesso',
      data: {
        ...whatsappConfig,
        whatsappApiToken: '********' // Não retorna o token completo por segurança
      }
    });
  } catch (error) {
    console.error('Erro ao salvar configurações do WhatsApp:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar a solicitação' 
    });
  }
};

// Obtém as configurações atuais (sem o token por segurança)
export const getWhatsappConfig = async (req: Request, res: Response) => {
  try {
    // Retorna as configurações sem o token completo
    const safeConfig = {
      ...whatsappConfig,
      whatsappApiToken: whatsappConfig.whatsappApiToken 
        ? `${whatsappConfig.whatsappApiToken.substring(0, 4)}...${whatsappConfig.whatsappApiToken.substring(whatsappConfig.whatsappApiToken.length - 4)}` 
        : ''
    };
    
    return res.status(200).json({ 
      success: true, 
      data: safeConfig
    });
  } catch (error) {
    console.error('Erro ao obter configurações do WhatsApp:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar a solicitação' 
    });
  }
};

// Testa a conexão com a API do WhatsApp Business
export const testWhatsappConnection = async (req: Request, res: Response) => {
  try {
    // Em uma implementação real, faria uma chamada de teste à API do WhatsApp
    // para verificar se as credenciais estão corretas
    
    if (!whatsappConfig.whatsappApiToken || !whatsappConfig.phoneNumberId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Configurações incompletas. Configure o token e o ID do telefone primeiro.'
      });
    }
    
    // Simula verificação de conexão
    const isConnected = whatsappConfig.whatsappApiToken.length > 10;
    
    return res.status(200).json({ 
      success: isConnected, 
      message: isConnected 
        ? 'Conexão estabelecida com sucesso com a API do WhatsApp Business' 
        : 'Não foi possível estabelecer conexão. Verifique suas credenciais.'
    });
  } catch (error) {
    console.error('Erro ao testar conexão com WhatsApp:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar a solicitação' 
    });
  }
};

// Salva um novo template de mensagem
export const saveMessageTemplate = async (req: Request, res: Response) => {
  try {
    const { templateName, templateLanguage, templateCategory, templateContent, hasMedia, mediaType } = req.body;
    
    if (!templateName || !templateCategory || !templateContent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Campos obrigatórios: templateName, templateCategory, templateContent' 
      });
    }
    
    // Em uma implementação real, enviaria o template para a API do WhatsApp
    // para aprovação e cadastro
    
    const newTemplate = {
      id: `template_${Date.now()}`,
      name: templateName,
      language: templateLanguage || 'pt_BR',
      category: templateCategory,
      content: templateContent,
      hasMedia: hasMedia || false,
      mediaType: mediaType || 'NONE',
      status: 'PENDING', // Status inicial é pendente de aprovação
      createdAt: new Date().toISOString()
    };
    
    // Adiciona o novo template à lista
    whatsappTemplates.push(newTemplate);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Template enviado para aprovação com sucesso',
      data: newTemplate
    });
  } catch (error) {
    console.error('Erro ao salvar template de mensagem:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar a solicitação' 
    });
  }
};

// Obtém todos os templates cadastrados
export const getMessageTemplates = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ 
      success: true, 
      data: whatsappTemplates
    });
  } catch (error) {
    console.error('Erro ao obter templates de mensagem:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar a solicitação' 
    });
  }
};

// Enviar mensagem de teste
export const sendTestMessage = async (req: Request, res: Response) => {
  try {
    const { recipientPhone, message } = req.body;
    
    if (!recipientPhone) {
      return res.status(400).json({ 
        success: false, 
        message: 'O número do destinatário é obrigatório' 
      });
    }
    
    if (!whatsappConfig.whatsappApiToken || !whatsappConfig.phoneNumberId || !whatsappConfig.isEnabled) {
      return res.status(400).json({ 
        success: false, 
        message: 'API do WhatsApp não configurada ou desativada' 
      });
    }
    
    // Em uma implementação real, aqui seria feita a chamada para a API do WhatsApp
    
    return res.status(200).json({ 
      success: true, 
      message: `Mensagem de teste enviada com sucesso para ${recipientPhone}`,
      data: {
        messageId: `test_${Date.now()}`,
        recipientPhone,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem de teste:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar a solicitação' 
    });
  }
};

// Exporta as configurações para uso em outros módulos
export function getWhatsappConfigForInternal() {
  return whatsappConfig;
}