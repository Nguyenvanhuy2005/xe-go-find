
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import usersData from '@/data/users.json';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  // Get the redirect path from location state, or default to home
  const from = location.state?.from || '/';

  const validateLogin = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) newErrors.email = 'Email là bắt buộc';
    if (!password.trim()) newErrors.password = 'Mật khẩu là bắt buộc';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    
    if (!registerEmail.trim()) newErrors.email = 'Email là bắt buộc';
    else if (!/^\S+@\S+\.\S+$/.test(registerEmail)) newErrors.email = 'Email không hợp lệ';
    
    if (!registerPassword.trim()) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (registerPassword.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    
    if (!registerName.trim()) newErrors.name = 'Tên là bắt buộc';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLogin()) return;
    
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      const user = usersData.find(
        u => u.email === email && u.password === password
      );
      
      if (user) {
        // Store user info in localStorage (in a real app, this would be a token)
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }));
        
        toast({
          title: 'Đăng nhập thành công',
          description: `Xin chào, ${user.name}!`,
        });
        
        // Redirect to the original page or dashboard based on role
        if (user.role === 'shop') {
          navigate('/shop/dashboard');
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(from);
        }
      } else {
        toast({
          title: 'Đăng nhập thất bại',
          description: 'Email hoặc mật khẩu không chính xác',
          variant: 'destructive'
        });
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegister()) return;
    
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Check if email already exists
      const existingUser = usersData.find(u => u.email === registerEmail);
      
      if (existingUser) {
        toast({
          title: 'Đăng ký thất bại',
          description: 'Email đã được sử dụng',
          variant: 'destructive'
        });
      } else {
        // In a real app, this would create a new user in the database
        toast({
          title: 'Đăng ký thành công',
          description: 'Vui lòng đăng nhập với tài khoản mới',
        });
        
        // Switch to login tab
        document.querySelector('[data-state="inactive"][data-value="login"]')?.click();
        setEmail(registerEmail);
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-repair-dark">
            Dịch vụ sửa xe
          </h1>
          <p className="mt-2 text-repair-muted">
            Đăng nhập hoặc đăng ký để tiếp tục
          </p>
        </div>
        
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Đăng nhập</CardTitle>
                  <CardDescription>
                    Nhập thông tin đăng nhập của bạn để tiếp tục
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <a href="#" className="text-sm text-repair-primary hover:underline">
                        Quên mật khẩu?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-repair-primary hover:bg-repair-primary/90"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <div className="mt-6">
              <p className="text-center text-sm text-repair-muted">
                <span className="font-medium text-repair-dark">Tài khoản demo</span>
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-repair-muted">
                <div className="p-2 border rounded">
                  <p><strong>Khách hàng:</strong> khach@email.com</p>
                  <p><strong>Mật khẩu:</strong> password123</p>
                </div>
                <div className="p-2 border rounded">
                  <p><strong>Cửa hàng:</strong> thop@email.com</p>
                  <p><strong>Mật khẩu:</strong> shoppassword</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>Đăng ký</CardTitle>
                  <CardDescription>
                    Tạo tài khoản mới để sử dụng dịch vụ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Họ tên</Label>
                    <Input 
                      id="register-name" 
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="email@example.com" 
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mật khẩu</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-repair-primary hover:bg-repair-primary/90"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
