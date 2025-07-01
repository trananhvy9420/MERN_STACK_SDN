// src/pages/PlayerDetailPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { getPlayerById, getPlayerComments, addComment } from "../services/api";

// --- UI Components ---
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";
import { toast } from "sonner";

// --- Icons ---
import {
  ArrowLeft,
  Shield,
  CreditCard,
  Star,
  UserCircle,
  CalendarDays,
  BarChart3,
  Globe,
} from "lucide-react";

// --- HELPER COMPONENT: Star Rating Display ---
const StarRating = ({ rating, className = "" }) => (
  <div className={`flex items-center gap-0.5 ${className}`}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

// --- COMPONENT: Player Info Card ---
const PlayerInfoCard = ({ player }) => (
  <Card className="overflow-hidden shadow-xl border-none rounded-2xl">
    <div className="grid md:grid-cols-12">
      {/* Player Image */}
      <div className="md:col-span-4 lg:col-span-3">
        <img
          src={player.image}
          alt={player.playerName}
          className="object-cover w-full h-full min-h-[300px] md:min-h-full"
        />
      </div>

      {/* Player Details */}
      <div className="md:col-span-8 lg:col-span-9 p-6 md:p-10 flex flex-col">
        <div className="flex-grow">
          {player.isCaptain && (
            <Badge className="mb-3 bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 text-sm px-3 py-1">
              <Star className="mr-2 h-4 w-4" /> Đội trưởng
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {player.playerName}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {player.position || "Tiền đạo"}
          </p>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thông số
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Giá trị</p>
                  <p className="font-semibold text-gray-800">
                    {player.cost.toLocaleString()} $
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Đội bóng</p>
                  <p className="font-semibold text-gray-800">
                    {player.team?.teamName || "Chưa có"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Quốc tịch</p>
                  <p className="font-semibold text-gray-800">
                    {player.nationality || "Chưa rõ"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Đánh giá trung bình</p>
                  <StarRating rating={Math.round(player.averageRating) || 0} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tiểu sử</h3>
          <p className="text-gray-600 leading-relaxed text-justify">
            {player.information || "Chưa có thông tin tiểu sử cho cầu thủ này."}
          </p>
        </div>
      </div>
    </div>
  </Card>
);

// --- COMPONENT: Comment Form ---
const CommentForm = ({ onSubmit, isSubmitting, newComment, setNewComment }) => (
  <Card className="shadow-lg rounded-xl">
    <CardHeader>
      <CardTitle>Gửi bình luận của bạn</CardTitle>
      <CardDescription>
        Chia sẻ cảm nhận của bạn về cầu thủ này.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="rating" className="font-semibold">
            Đánh giá
          </Label>
          <Select
            value={newComment.rating}
            onValueChange={(value) =>
              setNewComment({ ...newComment, rating: value })
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="!bg-background">
              <SelectValue placeholder="Chọn mức độ đánh giá" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="3">⭐️⭐️⭐️ Tạm được</SelectItem>
              <SelectItem value="2">⭐️⭐️ Cần cải thiện</SelectItem>
              <SelectItem value="1">⭐️ Yếu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-5">
          <Label htmlFor="content" className="font-semibold">
            Nội dung
          </Label>
          <Textarea
            id="content"
            placeholder="Cầu thủ này đá rất hay..."
            value={newComment.content}
            onChange={(e) =>
              setNewComment({ ...newComment, content: e.target.value })
            }
            disabled={isSubmitting}
            rows={5}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-semibold"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
        </Button>
      </form>
    </CardContent>
  </Card>
);

// --- COMPONENT: Comment Item ---
const CommentItem = ({ comment }) => (
  <div className="flex items-start gap-4 py-4 border-b last:border-b-0">
    <Avatar className="h-11 w-11">
      <AvatarImage src={comment.author?.avatar} />
      <AvatarFallback>
        <UserCircle className="text-gray-400 h-6 w-6" />
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-gray-800">
          {comment.author?.name || "Người dùng ẩn danh"}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
        </p>
      </div>
      <StarRating rating={comment.rating} className="mt-1" />
      <p className="text-gray-700 mt-2 leading-normal">{comment.content}</p>
    </div>
  </div>
);

// --- COMPONENT: Comment Section ---
const CommentSection = ({
  comments,
  onCommentSubmit,
  isSubmitting,
  newComment,
  setNewComment,
}) => (
  <section className="mt-12 md:mt-16">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">
      Bình luận ({comments.length})
    </h2>
    <div className="grid md:grid-cols-12 gap-8 md:gap-12">
      <div className="md:col-span-5 lg:col-span-4 md:sticky top-24 self-start">
        <CommentForm
          onSubmit={onCommentSubmit}
          isSubmitting={isSubmitting}
          newComment={newComment}
          setNewComment={setNewComment}
        />
      </div>
      <div className="md:col-span-7 lg:col-span-8">
        {comments.length > 0 ? (
          <div className="space-y-2">
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Chưa có bình luận nào. Hãy là người đầu tiên!
            </p>
          </div>
        )}
      </div>
    </div>
  </section>
);

// --- MAIN PAGE COMPONENT ---
const PlayerDetailPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState({ rating: "5", content: "" });
  const isLoggedIn = !!localStorage.getItem("access_token");

  const fetchData = useCallback(async () => {
    try {
      if (!loading) setLoading(true); // Ensure loading is true on re-fetch
      const playerRes = await getPlayerById(id);
      setPlayer(playerRes.data.data);

      // Chỉ tải bình luận nếu người dùng đã đăng nhập
      if (isLoggedIn) {
        const commentsRes = await getPlayerComments(id);
        setComments(
          commentsRes.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu chi tiết:", error);
      toast.error("Không thể tải dữ liệu cầu thủ.");
    } finally {
      setLoading(false);
    }
  }, [id, isLoggedIn, loading]);

  useEffect(() => {
    fetchData();
  }, [id, isLoggedIn]); // Re-run effect if id or login status changes

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.content.trim()) {
      toast.warning("Vui lòng nhập nội dung bình luận.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addComment(id, {
        ...newComment,
        rating: parseInt(newComment.rating, 10),
      });
      toast.success("Bình luận của bạn đã được đăng!");
      setNewComment({ rating: "5", content: "" });
      fetchData(); // Tải lại dữ liệu (chỉ tải lại comment)
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      toast.error("Không thể gửi bình luận, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <PlayerDetailSkeleton />;

  if (!player) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-700">404</h1>
          <p className="text-lg text-gray-500 mt-2">
            Không tìm thấy cầu thủ bạn yêu cầu.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Button
          asChild
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Link>
        </Button>

        <PlayerInfoCard player={player} />

        {/* LOGIC CHÍNH: Chỉ hiển thị phần bình luận nếu đã đăng nhập */}
        {isLoggedIn && (
          <CommentSection
            comments={comments}
            onCommentSubmit={handleCommentSubmit}
            isSubmitting={isSubmitting}
            newComment={newComment}
            setNewComment={setNewComment}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

// --- SKELETON COMPONENT (Updated) ---
const PlayerDetailSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Skeleton className="h-9 w-48 mb-6" />
        <Card className="overflow-hidden shadow-xl border-none rounded-2xl">
          <div className="grid md:grid-cols-12">
            <div className="md:col-span-4 lg:col-span-3">
              <Skeleton className="w-full h-full min-h-[300px] md:min-h-full" />
            </div>
            <div className="md:col-span-8 lg:col-span-9 p-6 md:p-10 space-y-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <div className="border-t pt-6 space-y-4">
                <Skeleton className="h-5 w-1/4 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Skeleton className="h-5 w-1/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PlayerDetailPage;
