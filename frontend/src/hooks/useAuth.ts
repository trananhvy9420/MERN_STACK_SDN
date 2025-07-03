// src/hooks/useAuth.js

import { useState, useEffect } from "react";
import axios from "axios"; // Giả sử bạn đã cài đặt axios
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        try {
          setCurrentUser(JSON.parse(userJson));
          return; // Nếu có rồi thì dừng, không cần làm gì thêm
        } catch (e) {
          console.error("Lỗi parse user JSON từ localStorage:", e);
          localStorage.removeItem("user"); // Xóa dữ liệu bị lỗi
        }
      }

      // **Ưu tiên 2: Nếu không có trong localStorage, kiểm tra accessToken**
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          const userId = decodedToken.id;

          if (!userId) {
            return;
          }

          // Dùng ID để fetch dữ liệu người dùng từ server
          const response = await axios.post(
            `http://localhost:3000/api/member/${userId}`
          );
          const userData = response.data.data;

          // Cập nhật state với dữ liệu vừa fetch được
          setCurrentUser(userData);

          // **Quan trọng**: Lưu lại vào localStorage cho những lần sau
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.error("Lỗi khi fetch hoặc decode token:", error);
          // Có thể xóa token nếu nó không hợp lệ
          // localStorage.removeItem('access_token');
        }
      }
    };

    fetchAndSetUser();
  }, []); // Mảng rỗng `[]` đảm bảo useEffect này chỉ chạy 1 lần khi component mount

  return currentUser;
};

export default useAuth;
