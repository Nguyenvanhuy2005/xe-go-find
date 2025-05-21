
import React from 'react';
import { MapPin, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import RatingStars from './RatingStars';
import FeaturedBadge from './FeaturedBadge';

interface ShopCardProps {
  shop: {
    id: string;
    name: string;
    address: string | null;
    service_area: string[];
    services: string[];
    isPremium: boolean;
    rating: number;
    openHours: string;
    phone: string;
    type: string;
    offers?: string[];
  };
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/shop/${shop.id}`);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/booking/${shop.id}`);
  };

  const locationText = shop.address 
    ? shop.address 
    : `Phục vụ tận nơi tại ${shop.service_area.slice(0, 2).join(', ')}${shop.service_area.length > 2 ? '...' : ''}`;

  return (
    <Card 
      className={`w-full p-4 cursor-pointer hover:shadow-md transition-shadow border ${shop.isPremium ? 'border-repair-premium/30 bg-repair-light/30' : ''}`}
      onClick={handleViewDetails}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-1/4">
          {shop.isPremium && (
            <div className="mb-2">
              <FeaturedBadge />
            </div>
          )}
          <h3 className="text-xl font-semibold">{shop.name}</h3>
          <div className="mt-1">
            <RatingStars rating={shop.rating} />
          </div>
        </div>
        
        <div className="sm:w-2/4 flex flex-col">
          <div className="flex items-start gap-2">
            <MapPin size={18} className="text-repair-muted mt-1 flex-shrink-0" />
            <span className="text-sm">{locationText}</span>
          </div>

          <div className="flex items-start gap-2 mt-2">
            <Calendar size={18} className="text-repair-muted mt-1 flex-shrink-0" />
            <span className="text-sm">{shop.openHours}</span>
          </div>

          <div className="flex items-start gap-2 mt-2">
            <Phone size={18} className="text-repair-muted mt-1 flex-shrink-0" />
            <span className="text-sm">{shop.phone}</span>
          </div>

          <div className="mt-3">
            <span className="text-sm font-medium">Dịch vụ: </span>
            <span className="text-sm">
              {shop.services.slice(0, 3).join(', ')}
              {shop.services.length > 3 && '...'}
            </span>
          </div>

          {shop.offers && shop.offers.length > 0 && (
            <div className="mt-3">
              <span className="text-sm font-semibold text-repair-success">
                {shop.offers[0]}
              </span>
            </div>
          )}
        </div>

        <div className="sm:w-1/4 flex flex-col justify-end sm:items-end mt-4 sm:mt-0">
          <Button 
            className="bg-repair-primary hover:bg-repair-primary/90 w-full sm:w-auto" 
            onClick={handleBookNow}
          >
            Đặt lịch
          </Button>
          
          <Button 
            variant="outline" 
            className="mt-2 w-full sm:w-auto" 
            onClick={handleViewDetails}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ShopCard;
