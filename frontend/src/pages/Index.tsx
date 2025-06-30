// src/pages/PlayersPage.js - Đây là nội dung thay thế cho phần body của Index.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import PlayerCard, { PlayerCardSkeleton } from "../pages/PlayerCard";
import AppPagination from "../pages/Pagination";
import { getPlayers } from "../services/api"; // Giữ nguyên service từ câu trả lời trước

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Kiểm tra đăng nhập (quan trọng)
  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     navigate("/form"); // Điều hướng đến trang đăng nhập nếu chưa có token
  //   }
  // }, [navigate]);

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-8">
          Danh Sách Cầu Thủ
        </h1>

        {/* Phần hiển thị danh sách */}
        <div className="flex flex-wrap justify-center gap-4">
          {loading ? (
            // Hiển thị Skeleton loading
            Array.from({ length: 8 }).map((_, index) => (
              <PlayerCardSkeleton key={index} />
            ))
          ) : players.length > 0 ? (
            // Hiển thị Card thật
            players.map((player) => (
              <PlayerCard key={player._id} player={player} />
            ))
          ) : (
            // Trường hợp không có dữ liệu
            <p>Không tìm thấy cầu thủ nào.</p>
          )}
        </div>

        {/* Phần phân trang */}
        <div className="mt-8">
          {pagination && !loading && (
            <AppPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlayersPage;
