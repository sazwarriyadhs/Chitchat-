
"use client"

import { useState } from "react";
import { Paperclip, Send, Smile, Image as ImageIcon, FileText, MapPin, Presentation as PresentationIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Chat, Message, Presentation } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "../ui/scroll-area";
import { dataStore } from "@/lib/data";

type ChatInputProps = {
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'senderId' | 'read' | 'delivered'>) => void;
  chat: Chat;
};

export function ChatInput({ onSendMessage, chat }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isPresentationSelectorOpen, setIsPresentationSelectorOpen] = useState(false);
  const { currentUser, getPresentationsByUserId } = dataStore;
  const userPresentations = getPresentationsByUserId(currentUser.id);


  const handleSend = () => {
    if (message.trim()) {
      onSendMessage({ body: message, type: 'text' });
      setMessage("");
    }
  };
  
  const handleSendFile = (type: Message['type'], body: string, meta?: Message['meta']) => {
    onSendMessage({ body, type, meta });
    setIsAttachmentOpen(false);
  };

  const handleSendPresentation = (presentation: Presentation) => {
    handleSendFile('presentation', `Membagikan presentasi: ${presentation.file_name}`, {
      fileName: presentation.file_name,
      fileUrl: presentation.file_url,
    });
    setIsPresentationSelectorOpen(false);
  }
  
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleSendFile('location', 'Bagikan lokasi saya', { latitude, longitude });
        },
        (error) => {
          toast({
            variant: 'destructive',
            title: 'Tidak dapat memperoleh lokasi',
            description: error.message,
          });
        }
      );
    } else {
       toast({
            variant: 'destructive',
            title: 'Geolocation tidak didukung',
            description: 'Browser Anda tidak mendukung geolokasi.',
       });
    }
    setIsAttachmentOpen(false);
  };


  return (
    <footer className="p-2 border-t sticky bottom-0 bg-card z-10">
      <div className="flex items-center gap-2">
        <Popover open={isAttachmentOpen} onOpenChange={setIsAttachmentOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-2 gap-2">
                <AttachmentButton icon={ImageIcon} label="Gambar" onClick={() => handleSendFile('image', 'Mengirim gambar', { fileName: 'image.jpg', fileUrl: 'https://placehold.co/600x400.png' })} />
                <AttachmentButton icon={FileText} label="Dokumen" onClick={() => handleSendFile('file', 'Mengirim dokumen', { fileName: 'document.pdf', fileUrl: '#' })} />
                <AttachmentButton icon={MapPin} label="Lokasi" onClick={handleShareLocation} />
                {currentUser.role === 'business' && <AttachmentButton icon={PresentationIcon} label="Presentasi" onClick={() => { setIsAttachmentOpen(false); setIsPresentationSelectorOpen(true); }} />}
            </div>
          </PopoverContent>
        </Popover>

        <Dialog open={isPresentationSelectorOpen} onOpenChange={setIsPresentationSelectorOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bagikan Presentasi</DialogTitle>
              <DialogDescription>
                Pilih salah satu presentasi yang telah Anda unggah untuk dibagikan dalam obrolan ini.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-60 mt-4">
              <div className="space-y-2 pr-4">
              {userPresentations.length > 0 ? userPresentations.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 flex-1 truncate">
                      <PresentationIcon className="w-5 h-5 text-muted-foreground" />
                      <span className="flex-1 truncate">{p.file_name}</span>
                  </div>
                  <Button size="sm" onClick={() => handleSendPresentation(p)}>
                      Bagikan
                  </Button>
              </div>
              )) : <p className="text-sm text-center text-muted-foreground py-4">Anda tidak punya presentasi untuk dibagikan. Unggah satu dari profil Anda.</p>}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Input
          type="text"
          placeholder="Ketik pesan..."
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
