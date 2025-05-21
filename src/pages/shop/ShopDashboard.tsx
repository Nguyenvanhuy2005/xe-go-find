import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, User, ThumbsUp, Calendar as CalendarIcon, Check, Star } from 'lucide-react';
import shopsData from '@/data/shops.json';
import bookingsData from '@/data/bookings.json';
import reviewsData from '@/data/reviews.json';
import subscriptionsData from '@/data/subscriptions.json';
import usersData from '@/data/users.json';
import RatingStars from '@/components/RatingStars';

const ShopDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would come from authentication
    const shopId = "shop-001"; // Example shop ID
    
    // Load shop data
    const shopData = shopsData.find(s => s.id === shopId);
    if (shopData) {
      setShop(shopData);
      
      // Load bookings
      const shopBookings = bookingsData.filter(b => b.shopId === shopId);
      setBookings(shopBookings);
      
      // Load reviews
      const shopReviews = reviewsData.filter(r => r.shopId === shopId);
      setReviews(shopReviews);
      
      // Load subscription
      const shopSubscription = subscriptionsData.find(s => s.shopId === shopId);
      setSubscription(shopSubscription);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin cửa hàng</h2>
          <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Quản lý cửa hàng</h1>
            <p className="text-repair-muted">
              {shop.name} - {subscription?.plan === 'premium' ? 'Gói Premium' : 'Gói miễn phí'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline"
              className="mr-2"
              onClick={() => navigate('/')}
            >
              Xem trang cửa hàng
            </Button>
            <Button className="bg-repair-primary hover:bg-repair-primary/90">
              <Edit size={16} className="mr-2" />
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </div>
        
        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-repair-muted text-sm">Lượt xem hồ sơ</p>
                  <h3 className="text-2xl font-bold mt-1">128</h3>
                </div>
                <div className="bg-repair-light/50 p-3 rounded-full">
                  <User size={24} className="text-repair-primary" />
                </div>
              </div>
              <p className="text-repair-success text-sm mt-2">+12% so với tuần trước</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-repair-muted text-sm">Lịch hẹn</p>
                  <h3 className="text-2xl font-bold mt-1">{bookings.length}</h3>
                </div>
                <div className="bg-repair-light/50 p-3 rounded-full">
                  <Calendar size={24} className="text-repair-primary" />
                </div>
              </div>
              <p className="text-repair-success text-sm mt-2">
                {bookings.filter(b => b.status === 'confirmed').length} đã xác nhận
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-repair-muted text-sm">Đánh giá</p>
                  <h3 className="text-2xl font-bold mt-1">{reviews.length}</h3>
                </div>
                <div className="bg-repair-light/50 p-3 rounded-full">
                  <ThumbsUp size={24} className="text-repair-primary" />
                </div>
              </div>
              <p className="text-repair-success text-sm mt-2">
                {shop.rating.toFixed(1)} sao trung bình
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-repair-muted text-sm">Gói Premium</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {subscription?.plan === 'premium' ? (
                      'Đang hoạt động'
                    ) : (
                      'Chưa kích hoạt'
                    )}
                  </h3>
                </div>
                <div className="bg-repair-light/50 p-3 rounded-full">
                  <CalendarIcon size={24} className="text-repair-primary" />
                </div>
              </div>
              <p className={`text-sm mt-2 ${subscription?.plan === 'premium' ? 'text-repair-success' : 'text-repair-warning'}`}>
                {subscription?.plan === 'premium' ? (
                  `Hết hạn: ${new Date(subscription.endDate).toLocaleDateString('vi-VN')}`
                ) : (
                  'Nâng cấp ngay'
                )}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Lịch hẹn</TabsTrigger>
            <TabsTrigger value="profile">Hồ sơ cửa hàng</TabsTrigger>
            <TabsTrigger value="subscription">Gói đăng ký</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý lịch hẹn</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map(booking => (
                      <div key={booking.id} className="border p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              <h4 className="font-medium">{booking.vehicleType}</h4>
                              <Badge className={`ml-2 ${
                                booking.status === 'confirmed' 
                                  ? 'bg-repair-success' 
                                  : booking.status === 'pending' 
                                  ? 'bg-repair-warning' 
                                  : 'bg-repair-muted'
                              }`}>
                                {booking.status === 'confirmed' ? 'Đã xác nhận' : booking.status === 'pending' ? 'Đang chờ' : 'Đã hủy'}
                              </Badge>
                            </div>
                            <p className="text-sm text-repair-muted mb-1">
                              Vấn đề: {booking.issue}
                            </p>
                            <p className="text-sm text-repair-muted">
                              Thời gian: {new Date(booking.time).toLocaleString('vi-VN')}
                            </p>
                            {booking.deliveryAddress && (
                              <p className="text-sm text-repair-muted mt-1">
                                Địa chỉ: {booking.deliveryAddress}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 md:mt-0 flex">
                            {booking.status === 'pending' && (
                              <>
                                <Button size="sm" className="bg-repair-success hover:bg-repair-success/90 mr-2">
                                  Xác nhận
                                </Button>
                                <Button size="sm" variant="outline" className="text-repair-danger border-repair-danger hover:bg-repair-danger/10">
                                  Hủy
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button size="sm" variant="outline">
                                Chi tiết
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-repair-muted">Chưa có lịch hẹn nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin hồ sơ</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Thông tin cơ bản</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-repair-muted text-sm">Tên cửa hàng</p>
                        <p className="font-medium">{shop.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Địa chỉ</p>
                        <p className="font-medium">{shop.address || 'Dịch vụ tận nơi (không có địa chỉ cố định)'}</p>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Khu vực phục vụ</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {shop.service_area.map((area: string, index: number) => (
                            <Badge key={index} variant="outline">{area}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Số điện thoại</p>
                        <p className="font-medium">{shop.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Giờ mở cửa</p>
                        <p className="font-medium">{shop.openHours}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Dịch vụ & Ưu đãi</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-repair-muted text-sm">Dịch vụ cung cấp</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {shop.services.map((service: string, index: number) => (
                            <Badge key={index} variant="outline">{service}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Ưu đãi</p>
                        {shop.offers && shop.offers.length > 0 ? (
                          <ul className="mt-1 list-disc list-inside">
                            {shop.offers.map((offer: string, index: number) => (
                              <li key={index}>{offer}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>Chưa có ưu đãi</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="bg-repair-primary hover:bg-repair-primary/90">
                        <Edit size={16} className="mr-2" />
                        Chỉnh sửa thông tin
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={subscription?.plan === 'premium' ? 'border-repair-premium/30' : ''}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Gói {subscription?.plan === 'premium' ? 'Premium' : 'Miễn phí'}</span>
                    {subscription?.plan === 'premium' && (
                      <Badge className="bg-repair-premium">Đang sử dụng</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {subscription?.plan === 'premium' ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-repair-muted text-sm">Thời hạn</p>
                        <p className="font-medium">
                          {new Date(subscription.startDate).toLocaleDateString('vi-VN')} - {' '}
                          {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Trạng thái</p>
                        <p className="font-medium text-repair-success">Đang hoạt động</p>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Quyền lợi</p>
                        <ul className="mt-2 space-y-2">
                          <li className="flex items-start gap-2">
                            <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                            <span>Hiển thị ưu tiên trong kết quả tìm kiếm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                            <span>Nhãn "Đối tác nổi bật" trên hồ sơ</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                            <span>Hiển thị tối đa 3 ưu đãi</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                            <span>Hiển thị giá tham khảo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                            <span>Thống kê chi tiết</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="pt-4">
                        <Button className="w-full bg-repair-primary hover:bg-repair-primary/90">
                          Gia hạn gói Premium
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-repair-muted text-sm">Trạng thái</p>
                        <p className="font-medium">Gói cơ bản</p>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Giới hạn</p>
                        <ul className="mt-2 space-y-2 text-repair-muted">
                          <li className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span>Không hiển thị ưu tiên trong kết quả tìm kiếm</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span>Không có nhãn "Đối tác nổi bật"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span>Không hiển thị ưu đãi</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span>Không hiển thị giá tham khảo</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="pt-4">
                        <Button className="w-full bg-repair-premium hover:bg-repair-premium/90">
                          Nâng cấp lên Premium
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin gói Premium</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold">200.000đ/tháng</h3>
                      <p className="text-repair-muted mt-1">Thanh toán theo tháng, hủy bất cứ lúc nào</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Quyền lợi:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span>Hiển thị ưu tiên trong kết quả tìm kiếm</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span>Nhãn "Đối tác nổi bật" trên hồ sơ</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span>Hiển thị tối đa 3 ưu đãi</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span>Hiển thị giá tham khảo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span>Thống kê chi tiết</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span>Hỗ trợ ưu tiên</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Khuyến mãi:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span>Miễn phí tháng đầu tiên</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span>Giảm 20% cho 3 tháng đầu</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-repair-success mt-1 flex-shrink-0" />
                          <span>Giới thiệu tiệm khác: tặng 1 tháng miễn phí</span>
                        </li>
                      </ul>
                    </div>
                    
                    {subscription?.plan !== 'premium' && (
                      <div className="pt-4">
                        <Button className="w-full bg-repair-premium hover:bg-repair-premium/90">
                          Dùng thử miễn phí 1 tháng
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Đánh giá từ khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map(review => {
                      const user = usersData.find(u => u.id === review.userId);
                      return (
                        <div key={review.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{user?.name || 'Khách hàng'}</p>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={`${i < review.rating ? 'text-repair-warning fill-repair-warning' : 'text-repair-muted'}`}
                                  />
                                ))}
                                <span className="ml-2 text-sm">{review.rating}/5</span>
                              </div>
                            </div>
                            <span className="text-sm text-repair-muted">
                              {new Date(review.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="mt-3">{review.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-repair-muted">Chưa có đánh giá nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopDashboard;
