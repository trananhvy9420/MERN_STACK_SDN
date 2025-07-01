// src/pages/admin/Dashboard.tsx
"use client"; // Sử dụng cho Next.js App Router

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

// Import các hàm API
import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getTeams,
} from "@services/api.js";
import AppPagination from "@pages/Pagination"; // Component phân trang từ lần trước

// Định nghĩa kiểu dữ liệu cho cầu thủ (dựa trên Mongoose model)
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

// --- COMPONENT FORM THÊM/SỬA ---
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
      // Reset form for "Add" mode
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
      onSuccess(); // Trigger refetch
      onOpenChange(false); // Close dialog
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
              <SelectContent>
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
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // State for dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);

  const fetchPlayersData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await getPlayers({ page, limit: 10, status: "all" });
      setPlayers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch players:", error);
      toast.error("Không thể tải danh sách cầu thủ.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayersData(pagination.currentPage);
    // Fetch teams for the form
    getTeams()
      .then((res) => setTeams(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const handlePageChange = (page: number) => {
    fetchPlayersData(page);
  };

  // Handlers for CRUD operations
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

  const confirmDelete = async () => {
    if (!deletingPlayerId) return;
    try {
      await deletePlayer(deletingPlayerId);
      toast.success("Cầu thủ đã được vô hiệu hóa.");
      fetchPlayersData(pagination.currentPage); // Refetch
    } catch (error) {
      toast.error("Xóa cầu thủ thất bại.");
    } finally {
      setIsAlertOpen(false);
      setDeletingPlayerId(null);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Cầu thủ</h1>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm Cầu thủ
        </Button>
      </div>

      <div className="rounded-md border">
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : players.length > 0 ? (
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
                    <Badge variant={player.disable ? "destructive" : "default"}>
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
                          <Edit className="mr-2 h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteRequest(player._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <AppPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Dialogs */}
      <PlayerForm
        player={editingPlayer}
        teams={teams}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => fetchPlayersData(pagination.currentPage)}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ vô hiệu hóa cầu thủ. Bạn không thể hoàn tác hành
              động này.
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
