import { ReactNode } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type ChartType = 'bar' | 'pie';

interface ChartCardProps {
  title: string;
  chartType: ChartType;
  data: any[];
  height?: number;
  colors?: string[];
  timeframe?: 'Mensal' | 'Anual';
  showLegend?: boolean;
  legendItems?: { color: string; label: string }[];
  setTimeframe?: (timeframe: 'Mensal' | 'Anual') => void;
  actions?: ReactNode;
}

export function ChartCard({
  title,
  chartType,
  data,
  height = 250,
  colors = ['#3b82f6', '#ef4444', '#22c55e'],
  timeframe = 'Mensal',
  showLegend = true,
  legendItems,
  setTimeframe,
  actions,
}: ChartCardProps) {
  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="receita" stroke={colors[0]} fill={colors[0]} />
            <Area type="monotone" dataKey="despesa" stroke={colors[1]} fill={colors[1]} />
            <Area type="monotone" dataKey="lucro" stroke={colors[2]} fill={colors[2]} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{title}</h3>
        {setTimeframe ? (
          <div className="flex gap-2">
            <button
              className={`text-sm px-3 py-1 rounded ${
                timeframe === 'Mensal'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setTimeframe('Mensal')}
            >
              Mensal
            </button>
            <button
              className={`text-sm px-3 py-1 rounded ${
                timeframe === 'Anual'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setTimeframe('Anual')}
            >
              Anual
            </button>
          </div>
        ) : (
          actions
        )}
      </div>

      {renderChart()}

      {showLegend && legendItems && (
        <div className={`${chartType === 'pie' ? 'grid grid-cols-3 gap-2' : 'flex justify-between'} mt-4`}>
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></span>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
