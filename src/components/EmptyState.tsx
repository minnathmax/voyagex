import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) => (
  <div className={`text-center py-12 px-4 ${className}`}>
    <div className="mx-auto h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
      <Icon className="h-7 w-7" />
    </div>
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{description}</p>
    )}
    {action && <div className="mt-4 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;
