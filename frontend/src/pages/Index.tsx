// src/pages/PlayersPage.js - Đây là nội dung thay thế cho phần body của Index.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import PlayerCard, { PlayerCardSkeleton } from "../pages/PlayerCard";
import AppPagination from "../pages/Pagination";
import { getPlayers } from "../services/api"; // Giữ nguyên service từ câu trả lời trước
import PlayerListPage from "./PlayerListPage";

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlayers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await getPlayers(page);
      console.log(response.data.data);
      setPlayers(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Không thể tải danh sách cầu thủ:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handlePageChange = (newPage) => {
    fetchPlayers(newPage);
  };
  useEffect(() => {
    // 1. Dùng URLSearchParams để đọc các tham số từ URL
    const params = new URLSearchParams(window.location.search);

    // 2. Lấy giá trị của accessToken và refreshToken
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    // 3. Kiểm tra nếu token tồn tại thì lưu vào localStorage
    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // 4. (Rất quan trọng) Xóa token khỏi thanh địa chỉ URL
      // để người dùng không nhìn thấy hoặc copy/bookmark nhầm.
      window.history.replaceState(null, "", window.location.pathname);

      // 5. (Tùy chọn) Điều hướng người dùng đến trang chủ hoặc dashboard
      // navigate('/');
    }
  }, [navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-8">
          Danh Sách Cầu Thủ
        </h1>
        <div className="flex flex-wrap justify-center gap-4 bg-background">
          <PlayerListPage />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlayersPage;
