// src/pages/admin/TeamManagement.tsx
// Removed "use client" as it's specific to Next.js App Router

import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
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
import { Badge } from "@components/ui/badge";
import { MoreHorizontal, PlusCircle, Trash2, Edit, Loader } from "lucide-react";
import { toast } from "sonner";

// Import các hàm API cho Team
import { getTeams, createTeam, updateTeam, deleteTeam } from "@services/api.js";
import AppPagination from "@pages/Pagination";

// Định nghĩa kiểu dữ liệu cho Đội (dựa trên Mongoose model)
interface Team {
  _id: string;
  teamName: string;
  disable: boolean;
  createdAt: string;
}

// --- COMPONENT FORM THÊM/SỬA ĐỘI ---
const TeamForm = ({ team, open, onOpenChange, onSuccess }) => {
  const isEditMode = !!team;
  const [formData, setFormData] = useState({ teamName: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setFormData({ teamName: team.teamName });
    } else {
      // Reset form cho chế độ "Thêm"
      setFormData({ teamName: "" });
    }
  }, [team, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // Chỉ gửi đi teamName, không gửi disable
        await updateTeam(team._id, { teamName: formData.teamName });
        toast.success("Đội đã được cập nhật thành công!");
      } else {
        await createTeam(formData);
        toast.success("Đội đã được tạo thành công!");
      }
      onSuccess(); // Tải lại dữ liệu
      onOpenChange(false); // Đóng dialog
    } catch (error) {
      console.error("Failed to save team:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa Đội" : "Thêm Đội mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin cho đội này."
              : "Điền thông tin để tạo một đội mới."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teamName" className="text-right">
              Tên đội
            </Label>
            <Input
              id="teamName"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              className="col-span-3"
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

// --- COMPONENT CHÍNH CỦA TRANG QUẢN LÝ ĐỘI ---
const TableTeam: React.FC = () => {
  const location = useLocation(); // Hook to get current URL location
  const navigate = useNavigate(); // Hook to programmatically navigate

  const [teams, setTeams] = useState<Team[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // State for dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  // Get current page from URL query parameter or default to 1
  const searchParams = new URLSearchParams(location.search);
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10; // Define your items per page

  const fetchTeamsData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        // Giả sử getTeams hỗ trợ pagination
        const response = await getTeams({ page, limit: itemsPerPage });
        setTeams(response.data.data); // Điều chỉnh dựa trên cấu trúc response của bạn
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        toast.error("Không thể tải danh sách đội.");
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchTeamsData(currentPage);
  }, [currentPage, fetchTeamsData]); // Re-fetch when currentPage changes

  const handlePageChange = (page: number) => {
    // Construct new URLSearchParams based on current location and update 'page'
    const currentSearchParams = new URLSearchParams(location.search);
    currentSearchParams.set("page", page.toString());
    // Navigate to the new URL with updated query params
    navigate(`${location.pathname}?${currentSearchParams.toString()}`);
  };

  // Handlers for CRUD operations
  const handleAdd = () => {
    setEditingTeam(null);
    setIsFormOpen(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (teamId: string) => {
    setDeletingTeamId(teamId);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTeamId) return;
    try {
      await deleteTeam(deletingTeamId);
      toast.success("Đội đã được vô hiệu hóa.");
      fetchTeamsData(currentPage); // Tải lại dữ liệu cho trang hiện tại
    } catch (error) {
      console.error("Failed to delete team:", error);
      toast.error("Vô hiệu hóa đội thất bại.");
    } finally {
      setIsAlertOpen(false);
      setDeletingTeamId(null);
    }
  };

  // Removed the problematic useEffect with console.log
  // useEffect(() => console.log(teams), console.log(pagination), [teams, pagination]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Đội bóng</h1>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm Đội
        </Button>
      </div>

      <div className="w-full relative">
        {" "}
        {/* Added relative positioning */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-md">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        <div className="w-full border overflow-hidden text-sm text-left text-gray-700 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên đội</TableHead>
                <TableHead className="text-center">
                  {" "}
                  {/* Centered "Trạng thái" header */}
                  Trạng thái
                </TableHead>
                <TableHead className="text-right">
                  {" "}
                  {/* Aligned "Hành động" to the right */}
                  <span className="sr-only">Hành động</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? ( // Show loading state inside table body
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : teams.length > 0 ? (
                teams.map((team) => (
                  <TableRow key={team._id}>
                    <TableCell className="font-medium">
                      {team.teamName}
                    </TableCell>
                    <TableCell className="text-center">
                      {" "}
                      {/* Centered "Trạng thái" cell content */}
                      <Badge variant={team.disable ? "danger" : "default"}>
                        {team.disable ? "Vô hiệu hóa" : "Hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(team)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteRequest(team._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Vô hiệu hóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Only show "Không có đội nào" if not loading and no teams
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Không có đội nào.
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
      </div>

      {/* Dialogs */}
      <TeamForm
        team={editingTeam}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => fetchTeamsData(currentPage)} // Pass currentPage for refetch
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn vô hiệu hóa đội này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ đặt trạng thái của đội thành 'Vô hiệu hóa'. Bạn
              có thể kích hoạt lại sau.
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

export default TableTeam;
