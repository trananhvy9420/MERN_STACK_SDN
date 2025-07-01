import { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Separator } from "@components/ui/separator";
import axios from "axios";
import GoogleLoginButton from "./GoogleButton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const LoginForm: React.FC = () => {
  const [membername, setMemberName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (accessToken && refreshToken) {
      // Store tokens and user info from Google login
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      toast.success("Đăng nhập thành công!", {
        description: "Chào mừng bạn đã trở lại.",
      });
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/");
    }
  }, [toast]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use axios to send a POST request to the backend on port 3000.
      const response = await axios.post("http://localhost:3000/api/auth", {
        membername,
        password,
      });
      // With axios, the response data is in the `data` property.
      const data = response.data;
      // --- Handle Successful Login ---
      // Store tokens and user data in localStorage
      if (data.member.isAdmin === true) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.member));
        toast.success("Đăng nhập thành công!", {
          description: `Chào mừng bạn trở lại, ${
            data.member.name || membername
          }`,
        });
        navigate("/dashboardadmin");
      } else {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.member));
        toast.success("Đăng nhập thành công!", {
          description: `Chào mừng bạn trở lại, ${
            data.member.name || membername
          }`,
        });
        navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Đã có lỗi xảy ra.";
      // SỬA LẠI THÀNH toast.error()
      toast.error("Đăng nhập thất bại", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Membername</Label>
          <Input
            id="membername"
            type="text"
            placeholder="your@email.com"
            value={membername}
            onChange={(e) => setMemberName(e.target.value)}
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      <div className="relative">
        <Separator className="my-4" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">Hoặc</span>
        </div>
      </div>

      <GoogleLoginButton />

      <div className="text-center text-sm text-gray-600">
        <a
          href="#"
          className="hover:text-blue-600 transition-colors duration-300"
        >
          Quên mật khẩu?
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
