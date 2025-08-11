
"use client"
import Link from 'next/link';
import { Plus, Search, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import { AppContainer } from '@/components/AppContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { dataStore } from '@/lib/data';
import { Chat, User, Product } from '@/lib/types';
import { StoryReel } from '@/components/stories/StoryReel';
import { StatusUpdater } from '@/components/stories/StatusUpdater';
import { format } from 'date-fns';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart } from 'lucide-react';

export default function HomePage() {
  const { currentUser } = dataStore;
  const router = useRouter();

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
          <h1 className="text-xl font-bold font-headline">{currentUser.name}</h1>
        </div>
        <div className='flex items-center gap-2'>
            <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
            </Button>
            {currentUser.role === 'business' && (
              <Link href="/new-group" passHref>
                <Button variant="ghost" size="icon">
                  <Plus className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <Link href="/profile" passHref>
              <Button variant="ghost" size="icon">
                <UserIcon className="w-5 h-5" />
              </Button>
            </Link>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-2 pt-4">
            <StoryReel />
        </div>
        <StoreUpdates />
        <div className="p-2">
            <h2 className="text-sm font-semibold text-muted-foreground px-2 py-1">Recent Chats</h2>
            <ChatList />
        </div>
      </main>
    </AppContainer>
  );
}

function StoreUpdates() {
  const router = useRouter();
  const { getStores, users } = dataStore;
  const [stores, setStores] = useState<Chat[]>([]);
  const [selectedStore, setSelectedStore] = useState<Chat | null>(null);

  useEffect(() => {
    setStores(getStores());
  }, [getStores]);

  const handleOrder = (storeId: string) => {
    setSelectedStore(null);
    router.push(`/chat/${storeId}`);
  };

  if (stores.length === 0) {
    return null;
  }
  
  return (
    <div className="p-2">
        <h2 className="text-sm font-semibold text-muted-foreground px-2 py-1">Store Updates</h2>
        <Carousel opts={{
            align: "start",
            loop: false,
        }} className="w-full">
            <CarouselContent className="-ml-2">
                {stores.map(store => {
                    return (
                        <CarouselItem key={store.id} className="basis-1/3 pl-2">
                            <Card className="overflow-hidden cursor-pointer" onClick={() => setSelectedStore(store)}>
                                <CardHeader className="p-0">
                                    <Avatar className="w-full h-24 object-cover rounded-b-none rounded-t-lg">
                                        <AvatarImage src={store.avatar} alt={store.name} className="object-cover" />
                                        <AvatarFallback>{store.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <p className="text-sm font-semibold truncate">{store.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{store.participants.length} members</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
        </Carousel>

        <Dialog open={!!selectedStore} onOpenChange={(open) => !open && setSelectedStore(null)}>
            <DialogContent className="max-h-[80vh]">
                {selectedStore && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Products from {selectedStore.name}</DialogTitle>
                            <DialogDescription>Browse items available in this store.</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="pr-4 -mr-4">
                        <div className="space-y-4 py-2">
                           {selectedStore.products && selectedStore.products.map(product => {
                             const seller = users.find(u => u.id === product.sellerId);
                             return (
                                <Card key={product.id} className="overflow-hidden">
                                  <div className="flex gap-4">
                                      <Image src={product.imageUrl} alt={product.name} width={100} height={100} className="w-24 h-24 object-cover" data-ai-hint="product image" />
                                      <div className="flex flex-col justify-between p-2 flex-1">
                                        <div>
                                          <p className="font-semibold">{product.name}</p>
                                          <p className="text-sm font-bold text-primary">Rp{product.price.toLocaleString('id-ID')}</p>
                                          {seller && <p className="text-xs text-muted-foreground">Sold by {seller.name}</p>}
                                        </div>
                                         <Button size="sm" className="self-end" onClick={() => handleOrder(selectedStore.id!)}>
                                           <ShoppingCart className="w-4 h-4 mr-2" /> Order Now
                                        </Button>
                                      </div>
                                  </div>
                                </Card>
                             )
                           })}
                        </div>
                        </ScrollArea>
                    </>
                )}
            </DialogContent>
        </Dialog>
    </div>
  )
}

function ChatList() {
  const { chats } = dataStore;
  return (
    <div className="space-y-2">
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

    