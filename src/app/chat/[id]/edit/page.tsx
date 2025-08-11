
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { AppContainer } from '@/components/AppContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Camera, Loader2, Store } from 'lucide-react';
import Link from 'next/link';
import { dataStore } from '@/lib/data';
import { User, Chat } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';


export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const chatId = params.id as string;
  const { toast } = useToast();
  const { currentUser, users, getChatById, updateGroupChat } = dataStore;

  const [chat, setChat] = useState<Chat | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const otherUsers = users.filter(u => u.id !== currentUser.id);

  const isStore = chat?.products?.length !== undefined && chat.products.length > 0;

  useEffect(() => {
    if (chatId) {
        const existingChat = getChatById(chatId);
        if (existingChat && existingChat.type === 'group') {
            setChat(existingChat);
            setGroupName(existingChat.name || '');
            setGroupAvatar(existingChat.avatar || '');
            // Initialize selected users with current participants, excluding the current user
            setSelectedUserIds(existingChat.participants.map(p => p.id).filter(id => id !== currentUser.id));
        } else {
            // If chat is not a group or not found, redirect
            notFound();
        }
        setLoading(false);
    }
  }, [chatId, getChatById, currentUser.id]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGroupAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId) // Remove user
        : [...prev, userId] // Add user
    );
  };

  const handleSaveChanges = () => {
    if (!chatId) return;
    if (!groupName.trim()) {
        toast({ variant: 'destructive', title: 'Nama ' + (isStore ? 'Toko' : 'Grup') + ' harus diisi.' });
        return;
    }
    if (selectedUserIds.length === 0) {
        toast({ variant: 'destructive', title: 'Grup harus memiliki minimal satu anggota lain.'});
        return;
    }

    const participantIds = [currentUser.id, ...selectedUserIds];
    
    updateGroupChat(chatId, {
        name: groupName,
        avatar: groupAvatar,
        participantIds,
    });

    toast({
        title: (isStore ? 'Toko' : 'Grup') + ' Diperbarui!',
        description: `Grup "${groupName}" telah diperbarui.`,
    });
    router.push(`/chat/${chatId}`);
  };

  if (loading) {
      return (
          <AppContainer>
              <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
          </AppContainer>
      );
  }

  if (!chat) {
      return notFound();
  }

  const pageTitle = isStore ? 'Ubah Toko' : 'Ubah Grup';
  const avatarFallbackIcon = isStore ? <Store className="w-10 h-10" /> : <Users className="w-10 h-10" />;

  return (
    <AppContainer>
      <header className="flex items-center p-2 border-b gap-2 sticky top-0 bg-card z-10">
        <Link href={`/chat/${chatId}`} passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-headline">{pageTitle}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={groupAvatar} alt="Group Avatar" />
                    <AvatarFallback>{avatarFallbackIcon}</AvatarFallback>
                </Avatar>
                 <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />
                <Button size="icon" className="absolute bottom-0 right-0 rounded-full" onClick={() => avatarInputRef.current?.click()}>
                    <Camera className="w-4 h-4" />
                </Button>
            </div>
          <Input
            placeholder={isStore ? "Nama Toko" : "Nama Grup"}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="text-center text-lg font-semibold"
          />
        </div>

        <div className="space-y-2">
            <h2 className="font-semibold">Kelola Anggota</h2>
            <div className="space-y-2 rounded-lg border p-2 max-h-60 overflow-y-auto">
            {otherUsers.map(user => (
                <div key={user.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
                    <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => handleToggleUser(user.id)}
                    />
                    <Label htmlFor={`user-${user.id}`} className="flex items-center gap-3 cursor-pointer flex-1">
                        <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                    </Label>
                </div>
            ))}
            </div>
        </div>
      </main>

      <footer className="p-4 border-t">
        <Button className="w-full" onClick={handleSaveChanges}>
          Simpan Perubahan
        </Button>
      </footer>
    </AppContainer>
  );
}

    
