// src/services/api.js
import axios from "axios";
import { toast } from "sonner";

// Cấu hình một instance của axios với base URL của API
// Điều này giúp bạn không cần lặp lại URL trong mỗi lần gọi
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // <<< THAY ĐỔI ĐỊA CHỈ NÀY cho đúng với backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Sử dụng Interceptor để tự động thêm Authorization header vào mỗi request
// Đây là cách làm rất hiệu quả để xử lý xác thực
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("access_token");
    if (token) {
      // Nếu có token, gắn nó vào header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Trả về lỗi nếu có vấn đề gì xảy ra trước khi request được gửi đi
    return Promise.reject(error);
  }
);

/**
 * Lấy danh sách cầu thủ có phân trang.
 * @param {number} page - Số trang hiện tại.
 * @param {number} limit - Số lượng cầu thủ mỗi trang.
 * @returns {Promise} - Promise chứa dữ liệu từ API.
 */
export const getPlayers = (page = 1, limit = 8) => {
  return apiClient.get(`/player/getAll?page=${page}&limit=${limit}`);
};

/**
 * Lấy thông tin chi tiết của một cầu thủ bằng ID.
 * @param {string} id - ID của cầu thủ.
 * @returns {Promise}
 */
export const getPlayerById = (id) => {
  return apiClient.get(`/player/searchByID?id=${id}`);
};

/**
 * Lấy tất cả bình luận của một cầu thủ.
 * @param {string} playerId - ID của cầu thủ.
 * @returns {Promise}
 */
export const getPlayerComments = (playerId) => {
  return apiClient.get(`/player/${playerId}/comment`);
};

/**
 * Thêm một bình luận mới cho cầu thủ.
 * @param {string} playerId - ID của cầu thủ.
 * @param {object} commentData - Dữ liệu bình luận, gồm { rating, content }.
 * @returns {Promise}
 */
export const addComment = (playerId, commentData) => {
  return apiClient.post(`/player/${playerId}/add-comment`, commentData);
};

// Bạn có thể thêm các hàm gọi API khác ở đây nếu cần
// ví dụ: updateUser, deletePlayer,...
