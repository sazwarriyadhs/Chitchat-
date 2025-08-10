"use client"
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

import { AppContainer } from '@/components/AppContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { chats, users } from '@/lib/data';
import { Chat, User } from '@/lib/types';
import { StoryReel } from '@/components/stories/StoryReel';
import { StatusUpdater } from '@/components/stories/StatusUpdater';
import { format } from 'date-fns';

const currentUser = users[0];

export default function HomePage() {
  return (
    <AppContainer>
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <StatusUpdater user={currentUser}>
            <Avatar className="cursor-pointer">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </StatusUpdater>
          <h1 className="text-xl font-bold font-headline">ChattyLite</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        <StoryReel />
        <ChatList />
      </main>

      <footer className="p-4">
        <Link href="/new-group" passHref>
          <Button className="w-full">
            <Plus className="w-5 h-5 mr-2" />
            New Chat
          </Button>
        </Link>
      </footer>
    </AppContainer>
  );
}

function ChatList() {
  return (
    <div className="p-2 space-y-2">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
}

function ChatListItem({ chat }: { chat: Chat }) {
  const otherParticipant = chat.participants.find(p => p.id !== 'user-1');
  const lastMessage = chat.messages[chat.messages.length - 1];

  const getParticipantInfo = (): { name: string, avatar: string, user?: User } => {
    if (chat.type === 'group') {
      return { name: chat.name!, avatar: chat.avatar! };
    }
    return { name: otherParticipant!.name, avatar: otherParticipant!.avatar, user: otherParticipant };
  };

  const { name, avatar, user } = getParticipantInfo();

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
            <p className="text-xs text-muted-foreground">{format(lastMessage.timestamp, 'p')}</p>
          </div>
          <p className="text-sm truncate text-muted-foreground">{lastMessage.text}</p>
        </div>
      </Card>
    </Link>
  );
}
