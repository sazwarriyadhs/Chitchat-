
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContainer } from '@/components/AppContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, Loader2, Store } from 'lucide-react';
import Link from 'next/link';
import { dataStore } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';


export default function NewGroupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [groupName, setGroupName] = useState('');
  const [groupAvatar, setGroupAvatar] = useState("https://placehold.co/200x200.png");
  const { currentUser, createGroupChat, users } = dataStore;
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
    
    // Automatically add all users to the store
    const participantIds = users.map(u => u.id);
    
    createGroupChat(groupName, participantIds, groupAvatar);

    toast({
        title: 'Store Created!',
        description: `The store "${groupName}" has been created and is available to all users.`,
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
        
        <div className='text-center text-muted-foreground text-sm p-4 bg-muted/50 rounded-lg'>
            Your new store will be a public channel accessible by all users in the app.
        </div>

      </main>

      <footer className="p-4 border-t">
        <Button className="w-full" onClick={handleCreateGroup}>
          Create Store
        </Button>
      </footer>
    </AppContainer>
  );
}

    
