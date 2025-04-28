import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Plus, Download } from 'lucide-react';
import ExpenseTable from '@/components/financial/ExpenseTable';
import ExpenseFilters from '@/components/financial/ExpenseFilters';
import FinancialSummary from '@/components/financial/FinancialSummary';

const ExpensesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });
  
  // Construct query params
  const queryParams = new URLSearchParams();
  queryParams.append('page', currentPage.toString());
  queryParams.append('limit', '10');
  
  if (filters.category) {
    queryParams.append('category', filters.category);
  }
  
  if (filters.startDate) {
    queryParams.append('startDate', filters.startDate);
  }
  
  if (filters.endDate) {
    queryParams.append('endDate', filters.endDate);
  }
  
  // Fetch expenses with filters
  const { data, isLoading } = useQuery({
    queryKey: [`/api/expenses?${queryParams.toString()}`],
  });
  
  // Fetch summary data for current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const { data: summaryData } = useQuery({
    queryKey: [`/api/reports/financial?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`],
  });
  
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Despesas</h1>
            <p className="text-neutral-400">Gerenciamento de despesas e custos</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg">
              <Link href="/expenses/new" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Nova Despesa
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Financial Summary */}
      <div className="mb-6">
        <FinancialSummary 
          data={{
            totalRevenue: summaryData?.totalRevenue || 0,
            totalExpenses: summaryData?.totalExpenses || 0,
            netProfit: summaryData?.netProfit || 0
          }}
        />
      </div>
      
      {/* Filters */}
      <ExpenseFilters onFilterChange={handleFilterChange} />
      
      {/* Expenses Table */}
      <ExpenseTable 
        expenses={data?.expenses || []} 
        totalCount={data?.total || 0} 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ExpensesPage;
