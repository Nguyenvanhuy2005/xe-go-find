
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Calendar, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import RatingStars from '@/components/RatingStars';
import FeaturedBadge from '@/components/FeaturedBadge';
import shopsData from '@/data/shops.json';
import reviewsData from '@/data/reviews.json';
import usersData from '@/data/users.json';

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
}

interface Review {
  id: string;
  shopId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

interface User {
  id: string;
  name: string;
}

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [reviews, setReviews] = useState<(Review & { userName: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Find the shop by ID
    const foundShop = shopsData.find(s => s.id === id);
    if (foundShop) {
      setShop(foundShop);

      // Get reviews for this shop
      const shopReviews = reviewsData
        .filter(review => review.shopId === id)
        .map(review => {
          const user = usersData.find(u => u.id === review.userId);
          return {
            ...review,
            userName: user?.name || 'Khách hàng'
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setReviews(shopReviews);
    }
    
    setLoading(false);
  }, [id]);

  const handleBookAppointment = () => {
    navigate(`/booking/${id}`);
  };

  const handleCall = () => {
    if (shop) {
      window.location.href = `tel:${shop.phone}`;
    }
  };

  const locationText = shop?.address 
    ? shop.address 
    : `Phục vụ tận nơi tại ${shop?.service_area.join(', ')}`;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 w-4 bg-repair-primary rounded-full"></div>
          <div className="h-4 w-4 bg-repair-primary rounded-full"></div>
          <div className="h-4 w-4 bg-repair-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center">Không tìm thấy tiệm sửa xe</h2>
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate('/')}>Quay lại trang chủ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Images and basic info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Main image */}
              <div className="relative h-64 sm:h-80 md:h-96 bg-repair-light">
                {shop.images && shop.images.length > 0 ? (
                  <img 
                    src={shop.images[activeImage]} 
                    alt={shop.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-repair-muted/20">
                    <span className="text-repair-muted">Không có hình ảnh</span>
                  </div>
                )}
              </div>

              {/* Thumbnail images */}
              {shop.images && shop.images.length > 1 && (
                <div className="flex p-2 gap-2 overflow-x-auto">
                  {shop.images.map((image, index) => (
                    <button 
                      key={index} 
                      className={`h-16 w-24 flex-shrink-0 border-2 ${activeImage === index ? 'border-repair-primary' : 'border-transparent'}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={image} alt={`${shop.name} ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              <div className="p-6">
                {/* Header with name and rating */}
                <div className="flex flex-wrap items-start justify-between mb-4">
                  <div>
                    {shop.isPremium && <FeaturedBadge className="mb-2" />}
                    <h1 className="text-2xl md:text-3xl font-bold">{shop.name}</h1>
                    <div className="mt-2">
                      <RatingStars rating={shop.rating} size={20} />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button 
                      className="bg-repair-primary hover:bg-repair-primary/90"
                      size="lg"
                      onClick={handleBookAppointment}
                    >
                      Đặt lịch
                    </Button>
                  </div>
                </div>

                {/* Basic info */}
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <MapPin className="text-repair-primary flex-shrink-0" size={18} />
                    <span>{locationText}</span>
                  </div>
                  <div className="flex gap-3">
                    <Calendar className="text-repair-primary flex-shrink-0" size={18} />
                    <span>Giờ mở cửa: {shop.openHours}</span>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="text-repair-primary flex-shrink-0" size={18} />
                    <span>{shop.phone}</span>
                  </div>
                </div>
                
                {/* Call button */}
                <div className="mt-6">
                  <Button variant="outline" onClick={handleCall} className="w-full">
                    <Phone size={16} className="mr-2" />
                    Gọi ngay
                  </Button>
                </div>

                {/* Offers */}
                {shop.offers && shop.offers.length > 0 && (
                  <div className="mt-6 p-4 bg-repair-light/50 rounded-lg border border-repair-light">
                    <h3 className="font-semibold text-repair-dark mb-2">Ưu đãi hiện có</h3>
                    <ul className="space-y-2">
                      {shop.offers.map((offer, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span className="text-repair-success">{offer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Tabs with services, reviews */}
          <div>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="services">Dịch vụ</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>

              {/* Overview tab */}
              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">Giới thiệu</h3>
                    <p className="text-repair-dark">{shop.description}</p>
                    
                    <h3 className="font-semibold text-lg mt-6 mb-3">Dịch vụ cung cấp</h3>
                    <div className="flex flex-wrap gap-2">
                      {shop.services.map((service, index) => (
                        <div key={index} className="bg-repair-light px-3 py-1 rounded-full text-sm">
                          {service}
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="font-semibold text-lg mt-6 mb-3">Khu vực phục vụ</h3>
                    {shop.type === 'mobile' ? (
                      <div className="flex flex-wrap gap-2">
                        {shop.service_area.map((area, index) => (
                          <div key={index} className="bg-repair-light px-3 py-1 rounded-full text-sm">
                            {area}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>{shop.address}</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services tab */}
              <TabsContent value="services">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Bảng giá tham khảo</h3>
                    <div className="space-y-4">
                      {Object.entries(shop.priceReference).map(([service, price], index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                          <span className="font-medium">{service}</span>
                          <span className="text-repair-primary font-semibold">{price}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-sm text-repair-muted">
                      <p>* Giá có thể thay đổi tùy thuộc vào tình trạng xe và các yêu cầu đặc biệt</p>
                    </div>
                    
                    <div className="mt-8">
                      <Button 
                        className="w-full bg-repair-primary hover:bg-repair-primary/90"
                        onClick={handleBookAppointment}
                      >
                        Đặt lịch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl font-bold mr-4">{shop.rating.toFixed(1)}</div>
                      <div>
                        <RatingStars rating={shop.rating} size={24} />
                        <p className="text-sm text-repair-muted mt-1">{reviews.length} đánh giá</p>
                      </div>
                    </div>
                    
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{review.userName}</p>
                                <RatingStars rating={review.rating} className="mt-1" />
                              </div>
                              <div className="text-sm text-repair-muted">
                                {new Date(review.date).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                            <p className="mt-2 text-repair-dark">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-6 text-repair-muted">Chưa có đánh giá nào</p>
                    )}
                    
                    <div className="mt-6">
                      <Button variant="outline" className="w-full">
                        Viết đánh giá
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
