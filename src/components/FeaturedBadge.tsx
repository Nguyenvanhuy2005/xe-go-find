
import React from 'react';

interface FeaturedBadgeProps {
  className?: string;
}

const FeaturedBadge: React.FC<FeaturedBadgeProps> = ({ className = '' }) => {
  return (
    <div className={`bg-repair-premium text-white text-xs px-2 py-1 rounded-full font-semibold animate-fade-in ${className}`}>
      Đối tác nổi bật
    </div>
  );
};

export default FeaturedBadge;
