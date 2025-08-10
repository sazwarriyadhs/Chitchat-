import { cn } from "@/lib/utils";
import { Message, User } from "@/lib/types";
import { users } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MapPin, Presentation, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

type ChatMessageProps = {
  message: Message;
  isCurrentUser: boolean;
};

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const sender = users.find((u) => u.id === message.senderId) as User;

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
        <MessageContent message={message} />
      </div>
    </div>
  );
}

const MessageContent = ({ message }: { message: Message }) => {
  switch (message.type) {
    case 'text':
      return <p className="text-sm">{message.text}</p>;
    case 'image':
      return <Card className="bg-transparent border-0 shadow-none">
          <CardHeader className="p-0">
            <Image src="https://placehold.co/600x400.png" width={250} height={150} alt="Shared image" className="rounded-lg" data-ai-hint="chat image" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-sm">{message.text}</p>
          </CardContent>
        </Card>
    case 'file':
      return <FileCard icon={FileText} title={message.fileName || 'File'} description={message.text} />
    case 'location':
      return <FileCard icon={MapPin} title="Location" description={message.text} />
    case 'presentation':
      return <FileCard icon={Presentation} title={message.fileName || 'Presentation'} description={message.text} />
    default:
      return null;
  }
}

const FileCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-background/20 rounded-lg">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs opacity-80">{description}</p>
            </div>
        </div>
    )
}
