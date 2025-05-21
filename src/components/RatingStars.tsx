
import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 16, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < Math.floor(rating)
              ? 'text-repair-warning fill-repair-warning'
              : i < rating
              ? 'text-repair-warning fill-repair-warning/50'
              : 'text-repair-muted'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export default RatingStars;
