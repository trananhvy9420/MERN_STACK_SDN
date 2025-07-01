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

const PlayerFilters = ({ filters, onFilterChange, teams = [] }) => {
  // Hàm xử lý chung để cập nhật search params
  const handleInputChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div className="p-4 bg-slate-50 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Search by Name */}
        <div>
          <Label
            htmlFor="playerName"
            className="text-sm font-medium text-slate-600"
          >
            Tìm theo tên
          </Label>
          <Input
            id="playerName"
            placeholder="Nhập tên cầu thủ..."
            value={filters.playerName || ""}
            onChange={(e) => handleInputChange("playerName", e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Filter by Team */}
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
              <SelectValue placeholder="Chọn đội" />
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

        {/* Filter by Captain */}
        <div className="flex items-center h-10">
          <Checkbox
            id="isCaptain"
            checked={filters.isCaptain === "true"}
            onCheckedChange={(checked) =>
              handleInputChange("isCaptain", checked ? "true" : "")
            }
          />
          <Label
            htmlFor="isCaptain"
            className="ml-2 font-medium cursor-pointer text-slate-700"
          >
            Chỉ hiển thị đội trưởng
          </Label>
        </div>
      </div>
    </div>
  );
};

export default PlayerFilters;
