import { cn } from "@/lib/utils";
import { Message, User } from "@/lib/types";
import { dataStore } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Presentation, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { LocationMessage } from "./LocationMessage";

type ChatMessageProps = {
  message: Message;
  isCurrentUser: boolean;
};

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const sender = dataStore.users.find((u) => u.id === message.senderId);

  if (!sender) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={sender.avatar} />
          <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none shadow-sm"
        )}
      >
        {!isCurrentUser && message.type !== 'text' && (
          <p className="text-xs font-semibold mb-1">{sender.name}</p>
        )}
        <MessageContent message={message} isCurrentUser={isCurrentUser} />
      </div>
    </div>
  );
}

const MessageContent = ({ message, isCurrentUser }: { message: Message, isCurrentUser: boolean }) => {
  const textColor = isCurrentUser ? 'text-primary-foreground' : 'text-card-foreground';
  switch (message.type) {
    case 'text':
      return <p className="text-sm">{message.body}</p>;
    case 'image':
      return <Card className="bg-transparent border-0 shadow-none">
          <CardContent className="p-0">
            <Image src={message.meta?.fileUrl || "https://placehold.co/600x400.png"} width={250} height={150} alt="Shared image" className="rounded-lg" data-ai-hint="chat image" />
            {message.body && <p className={cn("text-sm pt-2", textColor)}>{message.body}</p>}
          </CardContent>
        </Card>
    case 'file':
      return <FileCard icon={FileText} title={message.meta?.fileName || 'File'} description={message.body} isCurrentUser={isCurrentUser} />
    case 'location':
      const { latitude, longitude } = message.meta as { latitude: number; longitude: number };
      return <LocationMessage latitude={latitude} longitude={longitude} description={message.body} isCurrentUser={isCurrentUser}/>;
    case 'presentation':
      return <FileCard icon={Presentation} title={message.meta?.fileName || 'Presentation'} description={message.body} isCurrentUser={isCurrentUser} />
    default:
      return null;
  }
}

const FileCard = ({ icon: Icon, title, description, isCurrentUser }: { icon: React.ElementType, title: string, description: string, isCurrentUser: boolean }) => {
    const textColor = isCurrentUser ? 'text-primary-foreground' : 'text-card-foreground';
    const mutedColor = isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground';
    const iconBg = isCurrentUser ? 'bg-primary-foreground/20' : 'bg-muted';
    return (
        <a href={ "https://placehold.co/1x1.png" } target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 not-prose">
            <div className={cn("p-2 rounded-lg", iconBg)}>
                <Icon className={cn("w-6 h-6", textColor)} />
            </div>
            <div>
                <p className={cn("font-semibold text-sm", textColor)}>{title}</p>
                <p className={cn("text-xs", mutedColor)}>{description}</p>
            </div>
        </a>
    )
}
