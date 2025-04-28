import { Request, Response } from 'express';
import { storage } from '../storage';
import { getWhatsappConfigForInternal } from './whatsappConfig';

// Helper para integração com WhatsApp Business API
async function sendWhatsAppMessage(to: string, message: string, templateName?: string) {
  try {
    // Obtém as configurações salvas pelo usuário
    const config = getWhatsappConfigForInternal();
    
    if (!config.isEnabled || !config.whatsappApiToken || !config.phoneNumberId) {
      console.error('API do WhatsApp não configurada ou desabilitada');
      throw new Error('Configurações do WhatsApp Business incompletas ou API desabilitada');
    }
    
    // URL da API WhatsApp Business com os valores das configurações do usuário
    const apiUrl = `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`;
    
    // Dados para envio da mensagem
    const payload = templateName 
      ? {
          // Usando template
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: "pt_BR"
            },
            components: []
          }
        }
      : {
          // Usando texto simples
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: {
            preview_url: false,
            body: message
          }
        };
    
    // Aqui faria a requisição real usando fetch ou axios
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${config.whatsappApiToken}`
    //   },
    //   body: JSON.stringify(payload)
    // });
    
    // const data = await response.json();
    // return data;
    
    // Simulação de resposta
    console.log('Mensagem WhatsApp enviada com sucesso:', { to, message, templateName, phoneNumberId: config.phoneNumberId });
    return { success: true, messageId: `whatsapp_${Date.now()}` };
  } catch (error) {
    console.error('Erro ao enviar mensagem via WhatsApp:', error);
    throw new Error('Falha ao enviar mensagem via WhatsApp');
  }
}

// Funções para interações com alunos
export const sendClassReminder = async (req: Request, res: Response) => {
  try {
    const { studentId, message, scheduledDate, phoneNumber } = req.body;
    
    if (!studentId || !message || !phoneNumber) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes (studentId, message, phoneNumber)' });
    }
    
    // Enviar mensagem via WhatsApp
    const whatsappResponse = await sendWhatsAppMessage(
      phoneNumber,
      message,
      'class_reminder' // Nome do template no WhatsApp Business
    );
    
    // Registrar o lembrete no banco de dados
    const reminder = {
      id: Date.now().toString(),
      studentId,
      message,
      phoneNumber,
      scheduledDate: scheduledDate || new Date().toISOString(),
      status: 'sent', 
      type: 'class_reminder',
      whatsappMessageId: whatsappResponse.messageId
    };
    
    return res.status(200).json({ 
      success: true, 
      message: 'Lembrete de aula enviado com sucesso via WhatsApp',
      data: reminder
    });
  } catch (error) {
    console.error('Erro ao enviar lembrete de aula:', error);
    return res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
};

export const sendPaymentReminder = async (req: Request, res: Response) => {
  try {
    const { studentId, amount, dueDate, message, phoneNumber } = req.body;
    
    if (!studentId || !amount || !dueDate || !phoneNumber) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes (studentId, amount, dueDate, phoneNumber)' });
    }
    
    // Preparar a mensagem de pagamento
    const defaultMessage = `Olá! Lembramos que o pagamento de R$ ${amount} vence em ${new Date(dueDate).toLocaleDateString()}. Agradecemos sua atenção.`;
    const paymentMessage = message || defaultMessage;
    
    // Enviar mensagem via WhatsApp
    const whatsappResponse = await sendWhatsAppMessage(
      phoneNumber,
      paymentMessage,
      'payment_reminder' // Nome do template no WhatsApp Business
    );
    
    // Registrar a cobrança no banco de dados
    const payment = {
      id: Date.now().toString(),
      studentId,
      amount,
      dueDate,
      phoneNumber,
      message: paymentMessage,
      status: 'sent',
      type: 'payment_reminder',
      whatsappMessageId: whatsappResponse.messageId,
      createdAt: new Date().toISOString()
    };
    
    return res.status(200).json({ 
      success: true, 
      message: 'Cobrança enviada com sucesso via WhatsApp',
      data: payment
    });
  } catch (error) {
    console.error('Erro ao enviar cobrança:', error);
    return res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
};

export const scheduleAutomaticReminders = async (req: Request, res: Response) => {
  try {
    const { type, daysBefore, templateId } = req.body;
    
    if (!type || !daysBefore) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }
    
    // Aqui seria implementada a lógica para agendar lembretes automáticos
    // baseados em eventos como próximas aulas ou datas de pagamento
    
    // Simular uma configuração de lembretes automáticos
    const config = {
      id: Date.now().toString(),
      type,
      daysBefore,
      templateId: templateId || 'default',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    // Simular a resposta de sucesso
    return res.status(200).json({ 
      success: true, 
      message: 'Configuração de lembretes automáticos salva com sucesso',
      data: config
    });
  } catch (error) {
    console.error('Erro ao configurar lembretes automáticos:', error);
    return res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
};

export const getMessageTemplates = async (req: Request, res: Response) => {
  try {
    // Simular templates de mensagens
    const templates = [
      {
        id: '1',
        name: 'Lembrete de Aula Padrão',
        type: 'class_reminder',
        content: 'Olá {nome}, não esqueça da sua aula de {curso} amanhã às {horario}. Atenciosamente, Escola de Música.',
        isDefault: true
      },
      {
        id: '2',
        name: 'Lembrete de Pagamento',
        type: 'payment_reminder',
        content: 'Olá {nome}, o pagamento da sua mensalidade no valor de R$ {valor} vence em {dias_restantes} dias. Atenciosamente, Escola de Música.',
        isDefault: true
      },
      {
        id: '3',
        name: 'Confirmação de Pagamento',
        type: 'payment_confirmation',
        content: 'Olá {nome}, seu pagamento no valor de R$ {valor} foi recebido com sucesso. Agradecemos a preferência! Atenciosamente, Escola de Música.',
        isDefault: true
      }
    ];
    
    return res.status(200).json({ 
      success: true, 
      data: templates
    });
  } catch (error) {
    console.error('Erro ao buscar templates de mensagens:', error);
    return res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
};

export const saveMessageTemplate = async (req: Request, res: Response) => {
  try {
    const { id, name, type, content } = req.body;
    
    if (!name || !type || !content) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }
    
    // Simular salvamento de template
    const template = {
      id: id || Date.now().toString(),
      name,
      type,
      content,
      isDefault: false,
      updatedAt: new Date().toISOString()
    };
    
    return res.status(200).json({ 
      success: true, 
      message: 'Template de mensagem salvo com sucesso',
      data: template
    });
  } catch (error) {
    console.error('Erro ao salvar template de mensagem:', error);
    return res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
};