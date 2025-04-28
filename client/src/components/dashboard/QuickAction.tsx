import { ReactNode } from 'react';
import { Link } from 'wouter';

interface QuickActionProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  buttonText: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonHoverBgColor: string;
  href: string;
}

export function QuickAction({
  title,
  description,
  icon,
  iconBgColor,
  iconTextColor,
  buttonText,
  buttonBgColor,
  buttonTextColor,
  buttonHoverBgColor,
  href
}: QuickActionProps) {
  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-100 flex flex-col items-center justify-center text-center">
      <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center ${iconTextColor} mb-3`}>
        {icon}
      </div>
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <Link 
        href={href}
        className={`text-sm ${buttonBgColor} ${buttonTextColor} px-4 py-2 rounded-md hover:${buttonHoverBgColor} transition-colors`}
      >
        {buttonText}
      </Link>
    </div>
  );
}
