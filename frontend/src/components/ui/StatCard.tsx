// src/components/ui/StatCard.tsx
import React from 'react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  href,
  className = '',
}) => {
  const CardContent = () => (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
          </div>
          {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};