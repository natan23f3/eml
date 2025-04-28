import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

interface ReportCardProps {
  title: string;
  icon: ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  description: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  path: string;
}

export function ReportCard({
  title,
  icon,
  iconBgColor,
  iconTextColor,
  description,
  value,
  trend = 'neutral',
  path
}: ReportCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgColor} ${iconTextColor}`}>
            {icon}
          </div>
          
          {trend !== 'neutral' && (
            <div className={`flex items-center text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {trend === 'up' ? 'Aumento' : 'Redução'}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold">{value}</div>
          
          <Link href={path}>
            <a className="text-primary hover:underline flex items-center text-sm">
              Ver mais <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}