import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription, // Thêm CardDescription để hiển thị tên đội
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";
import { Star, Shield, DollarSign } from "lucide-react"; // Thêm icons
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar"; // Sử dụng Avatar

const PlayerCard: React.FC = ({ player }: { player: any }) => {
  return (
    <Card className="w-[300px] m-4 flex flex-col rounded-2xl shadow-lg bg-white transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl overflow-hidden">
      <CardHeader className="flex flex-col items-center p-4 text-center">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-slate-100">
            <AvatarImage
              src={player.image}
              alt={player.playerName}
              className="object-cover"
            />
            <AvatarFallback>
              <Skeleton className="w-full h-full rounded-full" />
            </AvatarFallback>
          </Avatar>
          {player.isCaptain && (
            <Badge
              variant="default" // Có thể tùy chỉnh variant nếu muốn
              className="absolute -top-1 -right-2 bg-amber-400 text-white border-2 border-white shadow-md hover:bg-amber-500"
            >
              <Star className="mr-1.5 h-4 w-4" />
              Đội trưởng
            </Badge>
          )}
        </div>
        <div className="pt-4">
          <CardTitle className="text-xl font-bold text-slate-800">
            {player.playerName}
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 mt-1">
            {player.position || "Chưa có vị trí"} {/* Giả sử có thêm vị trí */}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-grow px-4 pb-4 space-y-3">
        <div className="flex items-center text-base">
          <DollarSign className="mr-3 h-5 w-5 text-green-500" />
          <span className="font-semibold text-slate-700 mr-2">Giá:</span>
          <span className="text-slate-600">
            {player.cost.toLocaleString()} $
          </span>
        </div>
        <div className="flex items-center text-base">
          <Shield className="mr-3 h-5 w-5 text-blue-500" />
          <span className="font-semibold text-slate-700 mr-2">Đội:</span>
          <span className="text-slate-600 truncate">
            {player.team?.teamName || "Chưa có đội"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full font-semibold" variant="default">
          <Link to={`/player/${player._id}`}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const PlayerCardSkeleton = () => {
  return (
    <Card className="w-[300px] m-4 rounded-2xl shadow-lg">
      <CardHeader className="p-4 items-center text-center">
        <Skeleton className="w-32 h-32 rounded-full border-4" />
        <div className="pt-4 w-full">
          <Skeleton className="h-6 w-3/4 mx-auto rounded-md" />
          <Skeleton className="h-4 w-1/2 mx-auto mt-2 rounded-md" />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-full mr-3" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-full mr-3" />
          <Skeleton className="h-5 w-2/3 rounded-md" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
};

export default PlayerCard;
