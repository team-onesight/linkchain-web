import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Simple hash function to get a number from a string
function stringToNumberHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export interface UserCardProps {
  id: string;
  avatarUrl: string;
  name: string;
  tags: string[];
}

export function UserCard({ id, name, tags }: UserCardProps) {
  const avatarIndex = stringToNumberHash(id) % 5; // Use user.id to select avatar 0-4

  return (
    <Link to={`/users/${id}/links`} className='group'>
      <Card className='w-[220px] shrink-0 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
        <CardContent className='p-4 flex flex-col items-center text-center'>
          <Avatar className='w-20 h-20 mb-4 transition-transform duration-300 group-hover:scale-110'>
            <AvatarImage src={`/avatars/${avatarIndex}.png`} alt={`${name}'s avatar`} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className='font-semibold text-lg mb-2'>{name}</p>
          <div className='flex flex-wrap gap-2 justify-center'>
            {tags.map((tag) => (
              <Badge key={tag} variant='secondary'>
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
