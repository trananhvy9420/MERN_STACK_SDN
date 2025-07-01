// src/pages/PlayerListPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getPlayers, getTeams } from "../services/api";

import PlayerCard, { PlayerCardSkeleton } from "@pages/PlayerCard";
import PlayerFilters from "@pages/PlayerFilters";
import { toast } from "sonner";

// 1. Import component AppPagination mới của bạn
import AppPagination from "@pages/Pagination"; // <-- THAY ĐỔI Ở ĐÂY

const PlayerListPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchPlayerData = useCallback(async () => {
    setIsLoading(true);
    const params = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "8",
      playerName: searchParams.get("playerName") || "",
      teamId: searchParams.get("teamId") || "",
      isCaptain: searchParams.get("isCaptain") || "",
    };

    const validParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== "")
    );

    try {
      const response = await getPlayers(validParams);
      setPlayers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch players:", error);
      toast.error("Không thể tải danh sách cầu thủ.");
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPlayerData();
  }, [fetchPlayerData]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeams();
        setTeams(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        toast.error("Không thể tải danh sách đội.");
      }
    };
    fetchTeams();
  }, []);

  const handleFilterChange = (key, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (!value) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
  };

  const currentFilters = {
    playerName: searchParams.get("playerName"),
    teamId: searchParams.get("teamId"),
    isCaptain: searchParams.get("isCaptain"),
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">
        Danh sách Cầu thủ
      </h1>

      <PlayerFilters
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        teams={teams}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <PlayerCardSkeleton key={index} />
          ))}
        </div>
      ) : players.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">
            Không tìm thấy cầu thủ nào phù hợp.
          </p>
        </div>
      )}

      {/* 2. Sử dụng component AppPagination và truyền props vào */}
      <div className="mt-8 flex justify-center">
        {!isLoading && (
          <AppPagination // <-- THAY ĐỔI Ở ĐÂY
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default PlayerListPage;
