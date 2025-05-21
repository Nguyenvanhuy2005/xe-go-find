
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Check, X, ShoppingBag, DollarSign, Settings } from 'lucide-react';
import shopsData from '@/data/shops.json';
import reviewsData from '@/data/reviews.json';
import subscriptionsData from '@/data/subscriptions.json';
import usersData from '@/data/users.json';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Summary stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    premiumShops: 0,
    pendingShops: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Calculate stats from data
    const users = usersData.filter(user => user.role === 'customer').length;
    const shops = shopsData.length;
    const premium = subscriptionsData.filter(sub => sub.plan === 'premium').length;
    const pending = shopsData.filter(shop => shop.status === 'pending').length;
    
    // Calculate revenue ($20/month per premium shop)
    const revenue = premium * 20;
    
    setStats({
      totalUsers: users,
      totalShops: shops,
      premiumShops: premium,
      pendingShops: pending,
      totalRevenue: revenue
    });
    
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Quản trị hệ thống</h1>
            <p className="text-repair-muted">Quản lý tiệm, đánh giá và báo cáo</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline"
              className="mr-2"
              onClick={() => navigate('/')}
            >
              Xem trang chính
            </Button>
            <Button className="bg-repair-primary hover:bg-repair-primary/90">
              <Settings size={16} className="mr-2" />
              Cài đặt hệ thống
            </Button>
          </div>
        </div>
        
        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-repair-muted text-sm">Người dùng</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
                </div>
                <div className="bg-repair-light/50 p-3 rounded-full">
                  <User size={24} className="text-repair-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-repair-muted text-sm">Tiệm sửa xe</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalShops}</h3>
                </div>
                <div className="bg-repair-light/50 p-3 rounded-full">
                  <ShoppingBag size={24} className="text-repair-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-repair-muted text-sm">Tiệm Premium</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.premiumShops}</h3>
                </div>
                <div className="bg-repair-premium/20 p-3 rounded-full">
                  <ShoppingBag size={24} className="text-repair-premium" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-repair-muted text-sm">Chờ duyệt</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.pendingShops}</h3>
                </div>
                <div className="bg-repair-warning/20 p-3 rounded-full">
                  <ShoppingBag size={24} className="text-repair-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-repair-muted text-sm">Doanh thu (tháng)</p>
                  <h3 className="text-2xl font-bold mt-1">${stats.totalRevenue}</h3>
                </div>
                <div className="bg-repair-success/20 p-3 rounded-full">
                  <DollarSign size={24} className="text-repair-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="shops">
          <TabsList className="mb-6">
            <TabsTrigger value="shops">Quản lý tiệm</TabsTrigger>
            <TabsTrigger value="reviews">Quản lý đánh giá</TabsTrigger>
            <TabsTrigger value="revenue">Báo cáo doanh thu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shops">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách tiệm sửa xe</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {shopsData.map(shop => (
                    <div key={shop.id} className="border p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center mb-2">
                            <h4 className="font-medium">{shop.name}</h4>
                            <Badge className={`ml-2 ${
                              shop.isPremium 
                                ? 'bg-repair-premium' 
                                : 'bg-repair-muted'
                            }`}>
                              {shop.isPremium ? 'Premium' : 'Free'}
                            </Badge>
                            <Badge className={`ml-2 ${
                              shop.status === 'active' 
                                ? 'bg-repair-success' 
                                : shop.status === 'pending' 
                                ? 'bg-repair-warning' 
                                : 'bg-repair-danger'
                            }`}>
                              {shop.status === 'active' ? 'Đang hoạt động' : shop.status === 'pending' ? 'Chờ duyệt' : 'Đã khóa'}
                            </Badge>
                          </div>
                          <p className="text-sm text-repair-muted mb-1">
                            Địa chỉ: {shop.address || 'Dịch vụ tận nơi'}
                          </p>
                          <p className="text-sm text-repair-muted">
                            Khu vực phục vụ: {shop.service_area.join(', ')}
                          </p>
                          <div className="flex items-center mt-1">
                            <p className="text-sm text-repair-muted">
                              Điểm đánh giá: <span className="text-repair-warning font-medium">{shop.rating}</span>
                            </p>
                            <p className="text-sm text-repair-muted ml-4">
                              {reviewsData.filter(review => review.shopId === shop.id).length} đánh giá
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex">
                          {shop.status === 'pending' ? (
                            <>
                              <Button size="sm" className="bg-repair-success hover:bg-repair-success/90 mr-2">
                                <Check size={16} className="mr-1" />
                                Duyệt
                              </Button>
                              <Button size="sm" className="bg-repair-danger hover:bg-repair-danger/90">
                                <X size={16} className="mr-1" />
                                Từ chối
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" className="mr-2">
                                Xem chi tiết
                              </Button>
                              <Button 
                                size="sm" 
                                className={shop.status === 'active' ? 'bg-repair-danger hover:bg-repair-danger/90' : 'bg-repair-success hover:bg-repair-success/90'}
                              >
                                {shop.status === 'active' ? 'Khóa tiệm' : 'Mở lại'}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý đánh giá</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {reviewsData.map(review => {
                    const shop = shopsData.find(s => s.id === review.shopId);
                    const user = usersData.find(u => u.id === review.userId);
                    
                    return (
                      <div key={review.id} className="border p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              <h4 className="font-medium">{user?.name || 'Khách hàng ẩn danh'}</h4>
                              <span className="mx-2">→</span>
                              <h4 className="font-medium">{shop?.name || 'Tiệm không xác định'}</h4>
                            </div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={`${i < review.rating ? 'text-repair-warning fill-repair-warning' : 'text-repair-muted'}`}
                                />
                              ))}
                              <span className="ml-2 text-sm">{review.rating}/5</span>
                              <span className="text-sm text-repair-muted ml-4">
                                {new Date(review.date).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                          </div>
                          <div className="mt-4 md:mt-0 flex">
                            <Button size="sm" variant="outline" className="mr-2">
                              Chỉnh sửa
                            </Button>
                            <Button size="sm" className="bg-repair-danger hover:bg-repair-danger/90">
                              <X size={16} className="mr-1" />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo doanh thu</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Doanh thu theo tháng</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span>Tháng 5/2023</span>
                        <span className="font-medium">${stats.totalRevenue}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span>Tháng 4/2023</span>
                        <span className="font-medium">${Math.round(stats.totalRevenue * 0.8)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span>Tháng 3/2023</span>
                        <span className="font-medium">${Math.round(stats.totalRevenue * 0.6)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span>Tháng 2/2023</span>
                        <span className="font-medium">${Math.round(stats.totalRevenue * 0.4)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span>Tháng 1/2023</span>
                        <span className="font-medium">${Math.round(stats.totalRevenue * 0.3)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Tổng doanh thu năm 2023</h4>
                      <div className="text-2xl font-bold">${Math.round(stats.totalRevenue * 3.1)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Thống kê gói Premium</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-repair-muted text-sm">Tổng số tiệm Premium</p>
                        <p className="text-xl font-bold">{stats.premiumShops}</p>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Tỷ lệ chuyển đổi</p>
                        <p className="text-xl font-bold">{Math.round((stats.premiumShops / stats.totalShops) * 100)}%</p>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Thời hạn đăng ký phổ biến</p>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div className="bg-repair-light/30 p-3 rounded-lg text-center">
                            <p className="text-repair-muted text-sm">3 tháng</p>
                            <p className="font-bold">{Math.round(stats.premiumShops * 0.6)}</p>
                          </div>
                          <div className="bg-repair-light/30 p-3 rounded-lg text-center">
                            <p className="text-repair-muted text-sm">6 tháng</p>
                            <p className="font-bold">{Math.round(stats.premiumShops * 0.4)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-repair-muted text-sm">Dự báo doanh thu</p>
                        <div className="mt-2">
                          <div className="flex justify-between items-center border-b pb-2">
                            <span>Tháng 6/2023</span>
                            <span className="font-medium">${Math.round(stats.totalRevenue * 1.2)}</span>
                          </div>
                          <div className="flex justify-between items-center border-b pb-2">
                            <span>Tháng 7/2023</span>
                            <span className="font-medium">${Math.round(stats.totalRevenue * 1.4)}</span>
                          </div>
                          <div className="flex justify-between items-center border-b pb-2">
                            <span>Tháng 8/2023</span>
                            <span className="font-medium">${Math.round(stats.totalRevenue * 1.6)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button className="bg-repair-primary hover:bg-repair-primary/90">
                    Xuất báo cáo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
