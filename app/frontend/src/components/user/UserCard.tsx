import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface UserCardProps {
  user_id: number;
  avatarUrl: string;
  username: string;
}

export function UserCard({ user_id, username }: UserCardProps) {
  console.log(user_id);
  const avatarIndex = user_id % 5;

  return (
    <Link to={`/users/${user_id}/links`} className="group">
      <Card
        className="w-[220px] shrink-0 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-4 transition-transform duration-300 group-hover:scale-110">
            <AvatarImage src={`/avatars/${avatarIndex}.png`} alt={`${username}'s avatar`} />
            <AvatarFallback>{username.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="font-semibold text-lg mb-2">{username}</p>
          <div className="flex flex-wrap gap-2 justify-center">
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
