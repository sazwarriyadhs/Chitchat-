
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContainer } from '@/components/AppContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Camera, Loader2, Store } from 'lucide-react';
import Link from 'next/link';
import { dataStore } from '@/lib/data';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';


export default function NewGroupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupAvatar, setGroupAvatar] = useState("https://placehold.co/200x200.png");
  const { currentUser, users, createGroupChat } = dataStore;
  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Redirect if not a business member
    if (currentUser.role !== 'business') {
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'Only business members can create new stores.',
      });
      router.push('/home');
    }
  }, [currentUser, router, toast]);

  if (currentUser.role !== 'business') {
    return (
        <AppContainer>
          <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
      </AppContainer>
    );
  }

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGroupAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
        toast({ variant: 'destructive', title: 'Store name is required.' });
        return;
    }
    if (selectedUsers.length === 0) {
        toast({ variant: 'destructive', title: 'Select at least one member for your store.'});
        return;
    }

    const participantIds = [currentUser.id, ...selectedUsers];
    
    createGroupChat(groupName, participantIds, groupAvatar);

    toast({
        title: 'Store Created!',
        description: `The store "${groupName}" has been created. You can now add products.`,
    });
    router.push('/home');
  };

  return (
    <AppContainer>
      <header className="flex items-center p-2 border-b gap-2 sticky top-0 bg-card z-10">
        <Link href="/home" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-headline">Create New Store</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={groupAvatar} alt="Store Avatar" />
                    <AvatarFallback><Store className="w-10 h-10" /></AvatarFallback>
                </Avatar>
                <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />
                <Button size="icon" className="absolute bottom-0 right-0 rounded-full" onClick={() => avatarInputRef.current?.click()}>
                    <Camera className="w-4 h-4" />
                </Button>
            </div>
          <Input
            placeholder="Store Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="text-center text-lg font-semibold"
          />
        </div>

        <div className="space-y-2">
            <h2 className="font-semibold">Add Members</h2>
            <div className="space-y-2 rounded-lg border p-2 max-h-60 overflow-y-auto">
            {otherUsers.map(user => (
                <div key={user.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
                    <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
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
        <Button className="w-full" onClick={handleCreateGroup}>
          Create Store ({selectedUsers.length} member(s))
        </Button>
      </footer>
    </AppContainer>
  );
}

    