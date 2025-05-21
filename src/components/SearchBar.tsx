
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import shops from '@/data/shops.json';

interface SearchBarProps {
  onSearch: (query: string, filters: {
    vehicleType: string[];
    serviceType: string[];
    rating: number;
    shopType: string[];
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    vehicleType: [] as string[],
    serviceType: [] as string[],
    rating: 0,
    shopType: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Get all unique areas from shops data
  useEffect(() => {
    if (searchQuery.length > 1) {
      const allAreas = shops.flatMap(shop => 
        [...(shop.service_area || []), shop.address ? shop.address : ''].filter(Boolean)
      );
      
      const matchingSuggestions = Array.from(new Set(allAreas))
        .filter(area => 
          area.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      
      setSuggestions(matchingSuggestions);
      setShowSuggestions(matchingSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch(searchQuery, filters);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion, filters);
  };

  const toggleFilter = (filterType: 'vehicleType' | 'serviceType' | 'shopType', value: string) => {
    setFilters(prev => {
      const currentValues = [...prev[filterType]];
      const index = currentValues.indexOf(value);
      
      if (index >= 0) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(value);
      }
      
      return {
        ...prev,
        [filterType]: currentValues
      };
    });
  };

  const handleRatingChange = (value: number) => {
    setFilters(prev => ({
      ...prev,
      rating: value
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative" ref={searchRef}>
        <div className="flex w-full">
          <div className="relative flex-grow">
            <Input
              placeholder="Nhập khu vực bạn muốn tìm..."
              className="pl-10 py-6 text-lg border-r-0 rounded-r-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-repair-muted" size={20} />
          </div>
          <Button 
            className="bg-repair-primary hover:bg-repair-primary/90 rounded-l-none px-8 py-6" 
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
        
        {/* Search suggestions */}
        {showSuggestions && (
          <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-lg border mt-1 max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="p-3 hover:bg-repair-light cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter toggle button */}
      <div className="mt-4">
        <Button 
          variant="outline" 
          className="text-repair-dark"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow border animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">Loại xe</h3>
              <div className="space-x-2">
                <Button 
                  variant={filters.vehicleType.includes('Ô tô') ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => toggleFilter('vehicleType', 'Ô tô')}
                  className={filters.vehicleType.includes('Ô tô') ? 'bg-repair-primary' : ''}
                >
                  Ô tô
                </Button>
                <Button 
                  variant={filters.vehicleType.includes('Xe máy') ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => toggleFilter('vehicleType', 'Xe máy')}
                  className={filters.vehicleType.includes('Xe máy') ? 'bg-repair-primary' : ''}
                >
                  Xe máy
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Dịch vụ</h3>
              <div className="flex flex-wrap gap-2">
                {['Bảo dưỡng', 'Thay lốp', 'Cứu hộ', 'Sửa chữa động cơ'].map(service => (
                  <Button 
                    key={service}
                    variant={filters.serviceType.includes(service) ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => toggleFilter('serviceType', service)}
                    className={filters.serviceType.includes(service) ? 'bg-repair-primary' : ''}
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Loại hình</h3>
              <div className="space-x-2">
                <Button 
                  variant={filters.shopType.includes('fixed') ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => toggleFilter('shopType', 'fixed')}
                  className={filters.shopType.includes('fixed') ? 'bg-repair-primary' : ''}
                >
                  Cửa hàng cố định
                </Button>
                <Button 
                  variant={filters.shopType.includes('mobile') ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => toggleFilter('shopType', 'mobile')}
                  className={filters.shopType.includes('mobile') ? 'bg-repair-primary' : ''}
                >
                  Sửa tận nơi
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Đánh giá tối thiểu</h3>
            <div className="flex space-x-4">
              {[0, 3, 3.5, 4, 4.5].map(rating => (
                <Button 
                  key={rating}
                  variant={filters.rating === rating ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleRatingChange(rating)}
                  className={filters.rating === rating ? 'bg-repair-primary' : ''}
                >
                  {rating === 0 ? 'Tất cả' : `${rating}+ sao`}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button 
              className="bg-repair-primary hover:bg-repair-primary/90"
              onClick={handleSearch}
            >
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
