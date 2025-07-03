import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom"; // Hoặc from "react-router-dom"
import { Button } from "@/@/components/ui/button";
import AuthForm from "./AuthPage/AuthForm";
export default function AuthenticationPage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-4">
        <Button
          asChild
          variant="ghost"
          className="text-gray-600 hover:text-gray-900"
        >
          <Link to={`/`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang chủ
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-md   p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng bạn!
          </h1>
          <p className="text-gray-600">
            Đăng nhập hoặc tạo tài khoản để tiếp tục
          </p>
        </div>

        {/* Component form */}
        <AuthForm />
      </div>

      {/* Footer nhỏ (tùy chọn) */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} 9h53 CR7. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
