// src/components/PlayerFilters.jsx
import React from "react";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import { Button } from "@/@/components/ui/button";
type Team = {
  _id: string;
  teamName: string;
};

interface PlayerFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: string) => void;
  teams?: Team[];
  handleClearFilters: () => void;
}

const PlayerFilters: React.FC<PlayerFiltersProps> = ({
  filters,
  onFilterChange,
  teams = [],
  handleClearFilters,
}) => {
  // Hàm xử lý chung để cập nhật search params
  const handleInputChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm mb-6">
      {/* ===== Tiêu đề của Panel ===== */}
      <div className="flex items-center gap-3 mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <h3 className="text-lg font-bold text-slate-800">Bộ lọc tìm kiếm</h3>
      </div>

      {/* ===== Các ô nhập liệu ===== */}
      <div className="space-y-4">
        {/* --- Hàng 1: Tìm kiếm chính --- */}
        <div>
          <Label
            htmlFor="playerName"
            className="text-sm font-medium text-slate-600"
          >
            Tên cầu thủ
          </Label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Input
              id="playerName"
              type="text"
              placeholder="Nhập tên để tìm kiếm..."
              value={filters.playerName || ""}
              onChange={(e) => handleInputChange("playerName", e.target.value)}
              className="pl-10" // Thêm padding để icon không đè lên chữ
            />
          </div>
        </div>

        {/* --- Hàng 2: Các bộ lọc phụ --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="teamId"
              className="text-sm font-medium text-slate-600"
            >
              Lọc theo đội
            </Label>
            <Select
              value={filters.teamId || "all"}
              onValueChange={(value) =>
                handleInputChange("teamId", value === "all" ? "" : value)
              }
            >
              <SelectTrigger id="teamId" className="mt-1 bg-white">
                <SelectValue placeholder="Chọn một đội" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tất cả các đội</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team._id} value={team._id}>
                    {team.teamName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end h-full">
            <div className="flex items-center space-x-2 mt-1">
              <Checkbox
                id="isCaptain"
                checked={filters.isCaptain === "true"}
                onCheckedChange={(checked) =>
                  handleInputChange("isCaptain", checked ? "true" : "")
                }
              />
              <Label
                htmlFor="isCaptain"
                className="font-medium cursor-pointer text-slate-700"
              >
                Chỉ hiển thị đội trưởng
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Khu vực các nút hành động ===== */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
        <Button variant="ghost" onClick={handleClearFilters}>
          Xoá bộ lọc
        </Button>
        <Button>Áp dụng</Button>
      </div>
    </div>
  );
};

export default PlayerFilters;
