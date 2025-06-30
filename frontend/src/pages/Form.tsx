import AuthForm from "./AuthPage/AuthForm";

const Form = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng bạn!
          </h1>
          <p className="text-gray-600">Đăng nhập hoặc tạo tài khoản mới</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Form;
