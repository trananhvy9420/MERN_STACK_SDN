
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";
import GoogleLoginButton from "./GoogleButton";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Đăng ký thành công!",
        description: `Chào mừng ${formData.fullName} đến với chúng tôi!`,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nguyễn Văn A"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng ký..." : "Tạo tài khoản"}
        </Button>
      </form>
      
      <div className="relative">
        <Separator className="my-4" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">Hoặc</span>
        </div>
      </div>
      
      <GoogleLoginButton />
      
      <div className="text-center text-xs text-gray-500">
        Bằng cách đăng ký, bạn đồng ý với{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Chính sách bảo mật
        </a>
      </div>
    </div>
  );
};

export default SignUpForm;
