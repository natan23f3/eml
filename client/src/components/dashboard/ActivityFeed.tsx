import { ReactNode } from 'react';
import { UserPlus, Banknote, Calendar, Mail } from 'lucide-react';
import { RecentActivity } from '@/types/schema';

interface ActivityFeedProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

export function ActivityFeed({ activities, isLoading = false }: ActivityFeedProps) {
  // Function to get icon based on activity type
  const getIcon = (type: string): ReactNode => {
    switch (type) {
      case 'enrollment':
        return <UserPlus className="w-5 h-5" />;
      case 'payment':
        return <Banknote className="w-5 h-5" />;
      case 'class':
        return <Calendar className="w-5 h-5" />;
      case 'communication':
        return <Mail className="w-5 h-5" />;
      default:
        return <UserPlus className="w-5 h-5" />;
    }
  };

  // Function to get background color based on activity type
  const getBgColor = (type: string): string => {
    switch (type) {
      case 'enrollment':
        return 'bg-primary-100 text-primary-700';
      case 'payment':
        return 'bg-green-100 text-green-700';
      case 'class':
        return 'bg-purple-100 text-purple-700';
      case 'communication':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Function to format relative time (e.g., "30 minutes ago")
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `Há ${diffInMinutes} minuto${diffInMinutes === 1 ? '' : 's'}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Há ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays} dia${diffInDays === 1 ? '' : 's'}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow border border-gray-100 lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Atividades Recentes</h3>
          <span className="text-sm text-primary-600 hover:text-primary-700">Ver todas</span>
        </div>
        
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-100 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Atividades Recentes</h3>
        <a href="#" className="text-sm text-primary-600 hover:text-primary-700">Ver todas</a>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${getBgColor(activity.type)}`}>
              {getIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: activity.message }}></p>
              <p className="text-xs text-gray-500">{formatRelativeTime(activity.time)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
