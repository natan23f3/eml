import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import { Button } from '@/components/ui/button';

interface ChartData {
  name: string;
  receita: number;
  despesas: number;
}

interface RevenueChartProps {
  data: ChartData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  const getPeriodData = () => {
    return data;
  };
  
  return (
    <Card className="lg:col-span-2 card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-neutral-500">Receitas x Despesas</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={period === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('week')}
            className={period === 'week' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}
          >
            Semana
          </Button>
          <Button 
            variant={period === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('month')}
            className={period === 'month' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}
          >
            Mês
          </Button>
          <Button 
            variant={period === 'year' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('year')}
            className={period === 'year' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}
          >
            Ano
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getPeriodData()}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, undefined]}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Bar dataKey="receita" name="Receita" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" name="Despesas" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
