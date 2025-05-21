
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import ShopCard from '@/components/ShopCard';
import shopsData from '@/data/shops.json';

interface Shop {
  id: string;
  name: string;
  address: string | null;
  service_area: string[];
  services: string[];
  description: string;
  isPremium: boolean;
  rating: number;
  openHours: string;
  phone: string;
  type: string;
  images: string[];
  offers?: string[];
  priceReference: Record<string, string>;
  status: string;
}

const Home: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [visibleShops, setVisibleShops] = useState<Shop[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    // Load shops and sort by Premium first, then by rating
    const activeShops = shopsData.filter(shop => shop.status === 'active');
    const sortedShops = [...activeShops].sort((a, b) => {
      if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
      return b.rating - a.rating;
    });
    
    setShops(sortedShops);
    setFilteredShops(sortedShops);
    loadMoreShops(sortedShops);
  }, []);

  const loadMoreShops = (shopsList: Shop[], reset = false) => {
    const currentLength = reset ? 0 : visibleShops.length;
    const nextBatch = shopsList.slice(currentLength, currentLength + 10);
    
    setLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      if (reset) {
        setVisibleShops(nextBatch);
      } else {
        setVisibleShops(prev => [...prev, ...nextBatch]);
      }
      setHasMore(currentLength + nextBatch.length < shopsList.length);
      setLoadingMore(false);
    }, 300);
  };

  const handleSearch = (query: string, filters: any) => {
    setSearchPerformed(true);
    
    let results = [...shops];
    
    // Filter by search query (location)
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(shop => 
        (shop.address && shop.address.toLowerCase().includes(lowerQuery)) ||
        shop.service_area.some(area => area.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Filter by vehicle type
    if (filters.vehicleType.length > 0) {
      results = results.filter(shop => 
        filters.vehicleType.some((type: string) => shop.services.includes(type))
      );
    }
    
    // Filter by service type
    if (filters.serviceType.length > 0) {
      results = results.filter(shop => 
        filters.serviceType.some((service: string) => shop.services.includes(service))
      );
    }
    
    // Filter by rating
    if (filters.rating > 0) {
      results = results.filter(shop => shop.rating >= filters.rating);
    }
    
    // Filter by shop type
    if (filters.shopType.length > 0) {
      results = results.filter(shop => filters.shopType.includes(shop.type));
    }
    
    // Sort by Premium first, then by rating
    results.sort((a, b) => {
      if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
      return b.rating - a.rating;
    });
    
    setFilteredShops(results);
    loadMoreShops(results, true);
  };

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (scrolledToBottom) {
        loadMoreShops(filteredShops);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, filteredShops, visibleShops]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-repair-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Tìm dịch vụ sửa xe tốt nhất</h1>
          <p className="text-xl md:text-2xl mb-10 text-center max-w-3xl mx-auto">
            Kết nối với các tiệm sửa xe chất lượng cao, đáng tin cậy trong khu vực của bạn
          </p>
          
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Shop listings */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {searchPerformed 
              ? filteredShops.length > 0 
                ? `Tìm thấy ${filteredShops.length} tiệm sửa xe`
                : 'Không tìm thấy tiệm sửa xe phù hợp'
              : 'Tiệm sửa xe nổi bật'
            }
          </h2>
        </div>

        {visibleShops.length > 0 ? (
          <div className="space-y-4">
            {visibleShops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-repair-muted">Không tìm thấy tiệm sửa xe phù hợp</p>
            <p className="mt-2">Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center mt-6">
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-3 bg-repair-primary rounded-full"></div>
              <div className="h-3 w-3 bg-repair-primary rounded-full"></div>
              <div className="h-3 w-3 bg-repair-primary rounded-full"></div>
            </div>
          </div>
        )}

        {!hasMore && visibleShops.length > 0 && (
          <div className="text-center mt-8 text-repair-muted">
            Đã hiển thị tất cả tiệm sửa xe
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
