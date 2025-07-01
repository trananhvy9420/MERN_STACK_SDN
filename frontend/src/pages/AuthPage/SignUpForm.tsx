import { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Separator } from "@components/ui/separator";
import axios from "axios";
import GoogleLoginButton from "./GoogleButton";
import { signUp, signIn } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Assuming 'sonner' provides toast.error, toast.success, etc.

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    membername: "",
    name: "",
    email: "",
    YOB: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // FIX: Use toast.error for destructive variant
      toast.error("Lỗi", {
        description: "Mật khẩu xác nhận không khớp",
      });
      return;
    }
    if (formData.membername.length < 10) {
      setErrors((prev) => ({
        ...prev,
        membername: "Tên đăng nhập phải có ít nhất 10 ký tự.",
      }));
      return;
    }

    if (formData.name.length < 10) {
      setErrors((prev) => ({
        ...prev,
        name: "Họ và tên phải có ít nhất 10 ký tự.",
      }));
      return;
    }
    if (!formData.YOB) {
      setErrors((prev) => ({ ...prev, YOB: "Vui lòng chọn ngày sinh." }));
      return;
    }

    const today = new Date();
    const selectedDate = new Date(formData.YOB);

    // Check if YOB is a future date
    if (selectedDate > today) {
      setErrors((prev) => ({
        ...prev,
        YOB: "Ngày sinh không được ở tương lai.",
      }));
      return;
    }

    // Optional: Check for minimum age (e.g., must be at least 18 years old)
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    if (selectedDate > eighteenYearsAgo) {
      setErrors((prev) => ({
        ...prev,
        YOB: "Bạn phải đủ 18 tuổi để đăng ký.",
      }));
      return;
    }
    setIsLoading(true);
    try {
      const registrationData = {
        membername: formData.membername,
        name: formData.name,
        email: formData.email,
        YOB: formData.YOB,
        password: formData.password,
      };
      console.log(registrationData);
      // 1. Call the signUp function
      const registrationResponse = await signUp(registrationData); // Await the signUp call
      const { member } = registrationResponse.data; // Destructure the member object from the response

      // 2. Automatically sign in with the newly registered credentials
      const loginResponse = await axios.post("http://localhost:3000/api/auth", {
        membername: formData.membername,
        password: formData.password,
      });
      console.log(loginResponse);

      localStorage.setItem("access_token", loginResponse.data.access_token);
      localStorage.setItem("refresh_token", loginResponse.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(loginResponse.data.member));

      // Navigate to the home page after successful registration and login
      navigate("/");

      // FIX: Use toast.success for success messages
      toast.success("Đăng ký và Đăng nhập thành công!", {
        description: `Chào mừng ${member.membername} đến với chúng tôi!`,
      });
    } catch (error: any) {
      // Add ': any' for better type inference with error objects
      const message =
        error.response?.data?.message || error.message || "Đã có lỗi xảy ra.";
      toast.error("Đăng ký hoặc Đăng nhập thất bại", {
        description: message,
      });
    } finally {
      // Ensure isLoading is set to false regardless of success or failure
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Nguyễn Văn A"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={`transition-all duration-300 focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="membername">Username</Label>
          <Input
            id="membername"
            name="membername"
            type="text"
            value={formData.membername}
            onChange={handleInputChange}
            required
            className={`transition-all duration-300 focus:ring-2 ${
              errors.membername
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {errors.membername && (
            <p className="text-sm text-red-500 mt-1">{errors.membername}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="YOB">YOB</Label>
          <Input
            id="YOB"
            name="YOB"
            type="Date"
            placeholder="01/01/2003"
            value={formData.YOB}
            onChange={handleInputChange}
            required
            className={`transition-all duration-300 focus:ring-2 ${
              errors.YOB
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {errors.YOB && (
            <p className="text-sm text-red-500 mt-1">{errors.YOB}</p>
          )}
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
            className={`transition-all duration-300 focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
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
