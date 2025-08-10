"use client";

import Link from "next/link";
import { ArrowLeft, MoreVertical, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ChatHeaderProps = {
  name: string;
  avatarUrl: string;
  status: string;
};

export function ChatHeader({ name, avatarUrl, status }: ChatHeaderProps) {
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
      <Button variant="ghost" size="icon">
        <MoreVertical className="w-5 h-5" />
      </Button>
    </header>
  );
}
