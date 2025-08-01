import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
// Import các component đã cài đặt từ shadcn/ui
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
  fetchUserProfile,
  updateProfile,
  updatePassword,
} from "../services/api";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    console.log(user);

    // Nếu không có user hoặc không phải admin thì redirect về "/"
    if (!user) {
      toast.error("Bạn không được truy cập vô đây ( 403 Forbidden ) ");
      navigate("/");
    }
  }, [navigate]);

  const [profile, setProfile] = useState({
    name: "",
    membername: "",
    email: "",
    YOB: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      setMessage({ type: "", text: "" });
      try {
        const response = await fetchUserProfile();
        setProfile(response.data.data);
      } catch (error) {
        // Giả lập dữ liệu khi không kết nối được API để demo
        if (error.code === "ERR_NETWORK") {
          console.warn(
            "API connection failed. Using mock data for demonstration."
          );
          // setProfile({
          //   name: "Sơn Nguyễn (Demo)",
          //   membername: "son_demo",
          //   email: "demo@example.com",
          //   YOB: "1999-01-01T00:00:00.000Z",
          // });
          // setMessage({
          //   type: "error",
          //   text: "Không thể kết nối đến máy chủ. Đang hiển thị dữ liệu mẫu.",
          // });
        } else {
          const errorMessage =
            error.response?.data?.message ||
            "Không thể tải thông tin người dùng.";
          setMessage({ type: "error", text: errorMessage });
          toast.error("Đăng nhập thất bại", {
            description: error.response?.data?.message,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadUserProfile();
  }, []);

  const handleUpdateProfile = async (dataToUpdate) => {
    setIsUpdating(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await updateProfile(dataToUpdate);
      setProfile((prev) => ({ ...prev, ...response.data.data }));
      setMessage({
        type: "success",
        text: response.data.message || "Cập nhật hồ sơ thành công.",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Cập nhật hồ sơ thất bại.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (passwordData) => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu mới không khớp." });
      return;
    }

    setIsUpdating(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({
        type: "success",
        text: response.data.message || "Cập nhật mật khẩu thành công.",
      });
    } catch (error) {
      toast.error("Đăng nhập thất bại", {
        description: error.response?.data?.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div>
      <div className="flex-grow container mx-auto px-4 py-8 md:py-5">
        <Button
          asChild
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Link>
        </Button>
      </div>
      <div className="container mx-auto p-4 md:p-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Tài khoản của tôi</h1>
        {message.text && (
          <div
            className={`p-4 mb-4 rounded-md text-sm ${
              message.type === "error"
                ? "bg-destructive/20 text-destructive-foreground"
                : "bg-emerald-500/20 text-emerald-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
            <TabsTrigger value="password">Mật khẩu</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm
              profile={profile}
              onSave={handleUpdateProfile}
              isLoading={isUpdating}
            />
          </TabsContent>
          <TabsContent value="password">
            <PasswordForm
              onSave={handleUpdatePassword}
              isLoading={isUpdating}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// --- Form Components (Sử dụng component đã import) ---

function ProfileForm({ profile, onSave, isLoading }) {
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name: formData.name, YOB: formData.YOB });
  };

  const formattedYOB = useMemo(() => {
    if (!formData.YOB) return "";
    try {
      return new Date(formData.YOB).toISOString().split("T")[0];
    } catch (error) {
      return "";
    }
  }, [formData.YOB]);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân của bạn tại đây.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="membername">Tên tài khoản</Label>
            <Input id="membername" value={formData.membername || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Họ và Tên</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="YOB">Ngày sinh</Label>
            <Input
              id="YOB"
              type="date"
              value={formattedYOB}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

function PasswordForm({ onSave, isLoading }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ currentPassword, newPassword, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>
            Mật khẩu mới phải có ít nhất 6 ký tự.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

export default Profile;
