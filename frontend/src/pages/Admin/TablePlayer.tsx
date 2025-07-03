// src/pages/admin/Dashboard.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import {
  MoreHorizontal,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getTeams,
  getAllTeamNoPaging,
  activePlayer,
  getActiveTeam,
} from "@services/api.js";
import AppPagination from "@pages/Pagination";

// THAY ĐỔI 1: Import component PlayerFilters
import PlayerFilters from "@pages/PlayerFilters";

interface Player {
  _id: string;
  playerName: string;
  image: string;
  cost: number;
  isCaptain: boolean;
  information: string;
  team: {
    _id: string;
    teamName: string;
  };
  disable: boolean;
  createdAt: string;
}

interface Team {
  _id: string;
  teamName: string;
}

// --- COMPONENT FORM THÊM/SỬA (GIỮ NGUYÊN) ---
const PlayerForm = ({ player, teams, open, onOpenChange, onSuccess }) => {
  const isEditMode = !!player;
  const [formData, setFormData] = useState({
    playerName: "",
    image: "",
    cost: 0,
    information: "",
    team: "",
    isCaptain: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        playerName: player.playerName,
        image: player.image,
        cost: player.cost,
        information: player.information,
        team: player.team._id,
        isCaptain: player.isCaptain,
      });
    } else {
      setFormData({
        playerName: "",
        image: "",
        cost: 0,
        information: "",
        team: "",
        isCaptain: false,
      });
    }
  }, [player, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, team: value }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isCaptain: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updatePlayer(player._id, formData);
        toast.success("Cầu thủ đã được cập nhật thành công!");
      } else {
        await createPlayer(formData);
        toast.success("Cầu thủ đã được tạo thành công!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save player:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa Cầu thủ" : "Thêm Cầu thủ mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin chi tiết cho cầu thủ này."
              : "Điền thông tin để tạo một cầu thủ mới."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Các trường input trong form giữ nguyên */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="playerName" className="text-right">
              Tên
            </Label>
            <Input
              id="playerName"
              name="playerName"
              value={formData.playerName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Link ảnh
            </Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">
              Giá
            </Label>
            <Input
              id="cost"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="information" className="text-right">
              Thông tin
            </Label>
            <Input
              id="information"
              name="information"
              value={formData.information}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">
              Đội
            </Label>
            <Select onValueChange={handleSelectChange} value={formData.team}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn một đội" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {teams.map((team: Team) => (
                  <SelectItem key={team._id} value={team._id}>
                    {team.teamName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isCaptain" className="text-right">
              Đội trưởng?
            </Label>
            <Switch
              id="isCaptain"
              checked={formData.isCaptain}
              onCheckedChange={handleSwitchChange}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- COMPONENT CHÍNH CỦA TRANG DASHBOARD ---
const TablePlayer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamFilter, setTeamFilter] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);
  // State activingPlayerId được giữ lại nếu bạn có kế hoạch mở rộng
  const [activingPlayerId, setActivingPlayerId] = useState<string | null>(null);

  // THAY ĐỔI 2: Đọc tất cả tham số từ URL
  const searchParams = new URLSearchParams(location.search);
  const itemsPerPage = 10;
  const currentFilters = {
    playerName: searchParams.get("playerName") || "",
    teamId: searchParams.get("teamId") || "",
    isCaptain: searchParams.get("isCaptain") || "",
  };

  // THAY ĐỔI 3: Cập nhật hàm fetch để đọc trực tiếp từ URL và không cần tham số
  const fetchPlayersData = useCallback(async () => {
    setLoading(true);
    const currentParams = new URLSearchParams(location.search);
    const params = {
      page: currentParams.get("page") || "1",
      limit: itemsPerPage.toString(),
      playerName: currentParams.get("playerName") || "",
      teamId: currentParams.get("teamId") || "",
      isCaptain: currentParams.get("isCaptain") || "",
      status: "all",
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
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [itemsPerPage, location.search]); // Phụ thuộc vào location.search

  useEffect(() => {
    fetchPlayersData();
  }, [fetchPlayersData]);

  // useEffect(() => {
  //   getTeams()
  //     .then((res) => setTeams(res.data.data || []))
  //     .catch((err) => console.error(err));
  // }, []);

  // THAY ĐỔI 4: Thêm các hàm xử lý cho bộ lọc
  const handleFilterChange = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    newSearchParams.set("page", "1"); // Luôn reset về trang đầu khi filter
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  const handleClearFilters = () => {
    navigate(location.pathname); // Xóa hết query params
  };

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("page", page.toString());
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  // --- CÁC HÀM XỬ LÝ CŨ GIỮ NGUYÊN ---
  const handleAdd = () => {
    setEditingPlayer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (playerId: string) => {
    setDeletingPlayerId(playerId);
    setIsAlertOpen(true);
  };

  const handleActiveRequest = async (playerId: string) => {
    setActivingPlayerId(playerId); // Giữ lại logic set state này
    try {
      await activePlayer(playerId);
      toast.success("Cầu thủ đã được kích hoạt lại.");
      fetchPlayersData(); // THAY ĐỔI 5: Gọi fetch không cần tham số
    } catch (error) {
      toast.error("Kích hoạt thất bại.");
      console.error("Active error:", error);
    } finally {
      setActivingPlayerId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingPlayerId) return;
    try {
      await deletePlayer(deletingPlayerId);
      toast.success("Cầu thủ đã được vô hiệu hóa.");
      fetchPlayersData(); // THAY ĐỔI 5: Gọi fetch không cần tham số
    } catch (error) {
      toast.error("Xóa cầu thủ thất bại.");
      console.error("Delete error:", error);
    } finally {
      setIsAlertOpen(false);
      setDeletingPlayerId(null);
    }
  };
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getActiveTeam();
        const teams = await getAllTeamNoPaging();
        console.log(response.data.data);
        setTeams(response.data.data || []);
        setTeamFilter(teams.data.data || []);
        console.log(teamFilter);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        toast.error("Không thể tải danh sách đội.");
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Cầu thủ</h1>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm Cầu thủ
        </Button>
      </div>

      {/* THAY ĐỔI 6: Render component PlayerFilters */}
      <PlayerFilters
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        handleClearFilters={handleClearFilters}
        teams={teamFilter}
      />

      <div className="w-full relative mt-4">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-md">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        <div className="w-full border rounded-lg overflow-hidden text-sm text-left text-gray-700 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cầu thủ</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Đội</TableHead>
                <TableHead>Đội trưởng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>
                  <span className="sr-only">Hành động</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && players.length > 0 ? (
                players.map((player) => (
                  <TableRow key={player._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={player.image}
                            alt={player.playerName}
                          />
                          <AvatarFallback>
                            {player.playerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {player.playerName}
                      </div>
                    </TableCell>
                    <TableCell>{player.cost.toLocaleString()} $</TableCell>
                    <TableCell>{player.team?.teamName || "N/A"}</TableCell>
                    <TableCell>
                      {player.isCaptain ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-slate-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={player.disable ? "danger" : "default"}>
                        {player.disable ? "Vô hiệu hóa" : "Hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(player)}>
                            <Edit className="mr-2 h-4 w-4" /> Sửa
                          </DropdownMenuItem>
                          {player.disable ? (
                            <DropdownMenuItem
                              className="text-green-600 focus:text-green-700"
                              onClick={() => handleActiveRequest(player._id)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Kích
                              hoạt
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-700"
                              onClick={() => handleDeleteRequest(player._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Vô hiệu hóa
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {loading
                      ? "Đang tải dữ liệu..."
                      : "Không tìm thấy cầu thủ nào."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <AppPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <PlayerForm
        player={editingPlayer}
        teams={teams}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => fetchPlayersData()} // THAY ĐỔI 5: Gọi fetch không cần tham số
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn vô hiệu hóa?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ tạm thời vô hiệu hóa cầu thủ. Bạn có thể kích
              hoạt lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TablePlayer;
