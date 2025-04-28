import { Request, Response } from 'express';
import { storage } from '../storage';

// Funções para interações com alunos
export const sendClassReminder = async (req: Request, res: Response) => {
  try {
    const { studentId, message, scheduledDate } = req.body;
    
    if (!studentId || !message) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }
    
    // Aqui seria implementada a lógica de envio de lembrete
    // utilizando um serviço como SendGrid, Twilio, etc.
    
    // Registrar o lembrete no banco de dados
    const reminder = {
      id: Date.now().toString(),
      studentId,
      message,
      scheduledDate: scheduledDate || new Date().toISOString(),
      status: 'scheduled', 
      type: 'class_reminder'
    };
    
    // Simular a resposta de sucesso
    return res.status(200).json({ 
      success: true, 
      message: 'Lembrete de aula agendado com sucesso',
      data: reminder
    });
  } catch (error) {
    console.error('Erro ao agendar lembrete de aula:', error);
    return res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
};

export const sendPaymentReminder = async (req: Request, res: Response) => {
  try {
    const { studentId, amount, dueDate, message } = req.body;
    
    if (!studentId || !amount || !dueDate) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }
    
    // Aqui seria implementada a lógica de envio de cobrança
    // utilizando um serviço como SendGrid para email ou integrações
    // com gateways de pagamento como Stripe
    
    // Registrar a cobrança no banco de dados
    const payment = {
      id: Date.now().toString(),
      studentId,
      amount,
      dueDate,
      message: message || 'Lembrete de pagamento da mensalidade',
      status: 'pending',
      type: 'payment_reminder',
      createdAt: new Date().toISOString()
    };
    
    // Simular a resposta de sucesso
    return res.status(200).json({ 
      success: true, 
      message: 'Cobrança enviada com sucesso',
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