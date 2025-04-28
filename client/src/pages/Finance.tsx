import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { FinancialSummary } from '@/components/finance/FinancialSummary';
import { TransactionList } from '@/components/finance/TransactionList';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Finance() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  // Fetch payments data (income)
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/payments'],
  });

  // Fetch expenses data
  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['/api/expenses'],
  });

  // Calculate summary data
  const totalIncome = payments?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
  const totalExpenses = expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
  const balance = totalIncome - totalExpenses;

  // Handle new income button click
  const handleNewIncome = () => {
    setTransactionType('income');
    setIsDialogOpen(true);
  };

  // Handle new expense button click
  const handleNewExpense = () => {
    setTransactionType('expense');
    setIsDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-heading font-bold">Controle Financeiro</h1>
        
        <div className="flex gap-2 self-end">
          <Button onClick={handleNewIncome} variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Receita
          </Button>
          <Button onClick={handleNewExpense} className="flex items-center gap-2 bg-destructive hover:bg-destructive/90">
            <Plus className="w-4 h-4" />
            Nova Despesa
          </Button>
        </div>
      </div>

      <FinancialSummary 
        income={totalIncome} 
        expenses={totalExpenses} 
        balance={balance} 
        isLoading={paymentsLoading || expensesLoading}
      />

      <div className="mt-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">Todas Transações</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <TransactionList 
              transactions={[
                ...((payments || []).map(p => ({ ...p, type: 'income' }))),
                ...((expenses || []).map(e => ({ ...e, type: 'expense' })))
              ]} 
              isLoading={paymentsLoading || expensesLoading}
            />
          </TabsContent>
          <TabsContent value="income">
            <TransactionList 
              transactions={(payments || []).map(p => ({ ...p, type: 'income' }))} 
              isLoading={paymentsLoading}
            />
          </TabsContent>
          <TabsContent value="expenses">
            <TransactionList 
              transactions={(expenses || []).map(e => ({ ...e, type: 'expense' }))} 
              isLoading={expensesLoading}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {transactionType === 'income' ? 'Nova Receita' : 'Nova Despesa'}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm 
            type={transactionType} 
            onComplete={handleDialogClose} 
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
