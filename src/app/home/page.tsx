
"use client"
import Link from 'next/link';
import { LayoutGrid, Plus, Search, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

import { AppContainer } from '@/components/AppContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { dataStore } from '@/lib/data';
import { Chat, User } from '@/lib/types';
import { StoryReel } from '@/components/stories/StoryReel';
import { StatusUpdater } from '@/components/stories/StatusUpdater';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage() {
  const { currentUser } = dataStore;

  return (
    <AppContainer>
      <header className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <StatusUpdater user={currentUser}>
            <Avatar className="cursor-pointer w-10 h-10">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </StatusUpdater>
          <h1 className="text-xl font-bold font-headline">ChattyLite</h1>
        </div>
        <div className='flex items-center gap-2'>
            <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
            </Button>
            <Link href="/new-group" passHref>
              <Button variant="ghost" size="icon">
                <Plus className="w-5 h-5" />
              </Button>
            </Link>
        </div>
      </header>
      
        <Tabs defaultValue="channel" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="channel"><LayoutGrid className="w-4 h-4 mr-2"/>Channel</TabsTrigger>
                <TabsTrigger value="story"><Users className="w-4 h-4 mr-2"/>Story</TabsTrigger>
            </TabsList>
            <TabsContent value="channel" className="flex-1 flex flex-col overflow-hidden mt-0">
                <ChatList />
            </TabsContent>
            <TabsContent value="story" className="flex-1 overflow-y-auto p-4 mt-0">
                <StoryReel />
            </TabsContent>
        </Tabs>
    </AppContainer>
  );
}

function ChatList() {
  const { chats } = dataStore;
  return (
    <div className="p-2 space-y-2 overflow-y-auto flex-1">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
}

function ChatListItem({ chat }: { chat: Chat }) {
  const { currentUser } = dataStore;
  const otherParticipant = chat.participants.find(p => p.id !== currentUser.id);
  const lastMessage = chat.messages[chat.messages.length - 1];

  const getParticipantInfo = (): { name: string, avatar: string, user?: User } => {
    if (chat.type === 'group') {
      return { name: chat.name!, avatar: chat.avatar! };
    }
    return { name: otherParticipant!.name, avatar: otherParticipant!.avatar, user: otherParticipant };
  };

  const { name, avatar, user } = getParticipantInfo();
  
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    if (lastMessage) {
      setFormattedTime(format(new Date(lastMessage.timestamp), 'p'));
    }
  }, [lastMessage]);

  return (
    <Link href={`/chat/${chat.id}`} passHref>
      <Card className="p-3 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          {user?.online && <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-baseline justify-between">
            <p className="font-semibold truncate font-headline">{name}</p>
            <p className="text-xs text-muted-foreground">{formattedTime}</p>
          </div>
          <p className="text-sm truncate text-muted-foreground">{lastMessage.body}</p>
        </div>
      </Card>
    </Link>
  );
}
