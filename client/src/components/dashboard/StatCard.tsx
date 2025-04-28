import { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: {
    value: string;
    isPositive: boolean;
  };
  icon: ReactNode;
  iconBgColor: string;
  iconTextColor: string;
}

export function StatCard({ title, value, change, icon, iconBgColor, iconTextColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
          <p className={`text-xs mt-1 flex items-center ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change.isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            <span>{change.value}</span>
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconTextColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
