
"use client";

import Link from "next/link";
import { ArrowLeft, MoreVertical, Phone, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";


type ChatHeaderProps = {
  name: string;
  avatarUrl: string;
  status: string;
};

export function ChatHeader({ name, avatarUrl, status }: ChatHeaderProps) {
  const router = useRouter();
  
  return (
    <header className="flex items-center p-2 border-b gap-2 sticky top-0 bg-card z-10">
      <Link href="/home" passHref>
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Link>
      <Avatar>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="text-base font-bold font-headline">{name}</h2>
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>
      <Button variant="ghost" size="icon">
        <Phone className="w-5 h-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
