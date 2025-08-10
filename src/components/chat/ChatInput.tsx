"use client"

import { useState } from "react";
import { Paperclip, Send, Smile, Image, FileText, MapPin, Presentation as PresentationIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Message } from "@/lib/types";

type ChatInputProps = {
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'senderId'>) => void;
};

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage({ text: message, type: 'text' });
      setMessage("");
    }
  };
  
  const handleSendFile = (type: Message['type'], text: string, fileName?: string) => {
    onSendMessage({ text, type, fileName });
  };

  return (
    <footer className="p-2 border-t sticky bottom-0 bg-card z-10">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-2 gap-2">
                <AttachmentButton icon={Image} label="Image" onClick={() => handleSendFile('image', 'Sent an image', 'image.jpg')} />
                <AttachmentButton icon={FileText} label="Document" onClick={() => handleSendFile('file', 'Sent a document', 'document.pdf')} />
                <AttachmentButton icon={MapPin} label="Location" onClick={() => handleSendFile('location', 'Shared a location')} />
                <AttachmentButton icon={PresentationIcon} label="Presentation" onClick={() => handleSendFile('presentation', 'Shared a presentation', 'deck.pptx')} />
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-full bg-muted focus-visible:ring-1 focus-visible:ring-ring"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="ghost" size="icon">
          <Smile className="w-5 h-5" />
        </Button>
        <Button size="icon" className="rounded-full" onClick={handleSend} disabled={!message.trim()}>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </footer>
  );
}

function AttachmentButton({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted aspect-square transition-colors">
            <Icon className="w-6 h-6 mb-1 text-primary" />
            <span className="text-xs">{label}</span>
        </button>
    );
}
