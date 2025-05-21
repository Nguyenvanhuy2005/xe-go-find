
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import shopsData from '@/data/shops.json';
import bookingsData from '@/data/bookings.json';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shop, setShop] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [issue, setIssue] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    phone?: string;
    vehicleType?: string;
    time?: string;
    address?: string;
  }>({});

  useEffect(() => {
    const foundShop = shopsData.find(s => s.id === id);
    if (foundShop) {
      setShop(foundShop);
    }

    generateTimeSlots();
  }, [id, selectedDate]);

  const generateTimeSlots = () => {
    // Get shop's open hours
    if (!shop) return;

    const [openHour, closeHour] = shop.openHours.split(' - ')
      .map(time => parseInt(time.split(':')[0]));

    // Generate time slots from open to close hour
    const slots: TimeSlot[] = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      const time = `${hour}:00`;
      
      // Check availability (max 2 bookings per time slot)
      const bookingsAtTime = bookingsData.filter(booking => 
        booking.shopId === id && 
        new Date(booking.time).getHours() === hour &&
        new Date(booking.time).toISOString().split('T')[0] === selectedDate
      );

      slots.push({
        id: `time-${hour}`,
        time,
        available: bookingsAtTime.length < 2
      });
    }
    
    setTimeSlots(slots);
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      phone?: string;
      vehicleType?: string;
      time?: string;
      address?: string;
    } = {};
    
    if (!name.trim()) errors.name = 'Vui lòng nhập tên';
    if (!phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại';
    if (!/^[0-9]{10}$/.test(phone.trim())) errors.phone = 'Số điện thoại không hợp lệ';
    if (!vehicleType) errors.vehicleType = 'Vui lòng chọn loại xe';
    if (!selectedTime) errors.time = 'Vui lòng chọn thời gian';
    
    if (shop?.type === 'mobile' && !address.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Simulate booking creation
    const selectedHour = parseInt(selectedTime.split(':')[0]);
    const bookingTime = new Date(selectedDate);
    bookingTime.setHours(selectedHour, 0, 0, 0);
    
    const newBooking = {
      id: `booking-${Date.now()}`,
      shopId: id,
      userId: "user-001", // Using a dummy user ID for demo
      time: bookingTime.toISOString(),
      vehicleType,
      issue,
      deliveryAddress: shop?.type === 'mobile' ? address : null,
      status: "pending"
    };
    
    // In a real app, this would update the backend
    console.log('New booking created:', newBooking);
    
    toast({
      title: "Đặt lịch thành công!",
      description: `Lịch hẹn của bạn đã được gửi đến ${shop?.name}`,
    });
    
    // Navigate back to shop detail page
    setTimeout(() => {
      navigate(`/shop/${id}`);
    }, 1500);
  };

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center">Đang tải...</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </Button>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Đặt lịch</h1>
        <p className="text-repair-muted mb-6">{shop.name}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin đặt lịch</CardTitle>
                  <CardDescription>Vui lòng điền đầy đủ thông tin để đặt lịch sửa xe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal info */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Thông tin cá nhân</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ tên</Label>
                        <Input 
                          id="name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={validationErrors.name ? 'border-red-500' : ''}
                        />
                        {validationErrors.name && (
                          <p className="text-red-500 text-sm">{validationErrors.name}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input 
                          id="phone" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={validationErrors.phone ? 'border-red-500' : ''}
                        />
                        {validationErrors.phone && (
                          <p className="text-red-500 text-sm">{validationErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Vehicle info */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Thông tin xe</h3>
                    
                    <div className="space-y-2">
                      <Label>Loại xe</Label>
                      <RadioGroup 
                        value={vehicleType} 
                        onValueChange={setVehicleType}
                        className={validationErrors.vehicleType ? 'border-red-500 border p-2 rounded-md' : ''}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Ô tô" id="car" />
                          <Label htmlFor="car">Ô tô</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Xe máy" id="motorcycle" />
                          <Label htmlFor="motorcycle">Xe máy</Label>
                        </div>
                      </RadioGroup>
                      {validationErrors.vehicleType && (
                        <p className="text-red-500 text-sm">{validationErrors.vehicleType}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="issue">Mô tả vấn đề</Label>
                      <Textarea 
                        id="issue" 
                        placeholder="Vui lòng mô tả vấn đề của xe" 
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  {/* Date and time */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Thời gian</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Ngày</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          value={selectedDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Giờ</Label>
                      <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 ${validationErrors.time ? 'border-red-500 border p-2 rounded-md' : ''}`}>
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            type="button"
                            variant={selectedTime === slot.time ? 'default' : 'outline'}
                            className={`${!slot.available && 'opacity-50 cursor-not-allowed'} ${selectedTime === slot.time ? 'bg-repair-primary hover:bg-repair-primary/90' : ''}`}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                      {validationErrors.time && (
                        <p className="text-red-500 text-sm">{validationErrors.time}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Address for mobile service */}
                  {shop.type === 'mobile' && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Địa chỉ sửa xe</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ chi tiết</Label>
                        <Textarea 
                          id="address" 
                          placeholder="Nhập địa chỉ đầy đủ để thợ đến sửa xe tận nơi" 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className={validationErrors.address ? 'border-red-500' : ''}
                        />
                        {validationErrors.address && (
                          <p className="text-red-500 text-sm">{validationErrors.address}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit"
                    className="w-full bg-repair-primary hover:bg-repair-primary/90"
                  >
                    Đặt lịch
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
          
          {/* Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin tiệm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">{shop.name}</h3>
                  <p className="text-sm text-repair-muted mt-1">
                    {shop.type === 'fixed' 
                      ? shop.address 
                      : `Phục vụ tận nơi tại ${shop.service_area.join(', ')}`
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Giờ mở cửa:</span> {shop.openHours}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Số điện thoại:</span> {shop.phone}
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Dịch vụ:</h4>
                  <div className="flex flex-wrap gap-2">
                    {shop.services.map((service: string, index: number) => (
                      <div key={index} className="bg-repair-light px-2 py-1 rounded text-xs">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
                
                {shop.offers && shop.offers.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Ưu đãi hiện có:</h4>
                    <ul className="space-y-2 text-sm">
                      {shop.offers.map((offer: string, index: number) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-repair-success">•</span>
                          <span>{offer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
