
"use client"
import Link from 'next/link';
import { LayoutGrid, Plus, Search, Users, ShoppingCart, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import { AppContainer } from '@/components/AppContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { dataStore } from '@/lib/data';
import { Chat, User, Product } from '@/lib/types';
import { StoryReel } from '@/components/stories/StoryReel';
import { StatusUpdater } from '@/components/stories/StatusUpdater';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';

export default function HomePage() {
  const { currentUser } = dataStore;
  const [activeTab, setActiveTab] = useState("channel");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!carouselApi) return;
    
    const onSelect = () => {
      const newTab = carouselApi.selectedScrollSnap() === 0 ? 'channel' : 'story';
      setActiveTab(newTab);
    };

    carouselApi.on("select", onSelect);
    
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const slide = value === 'channel' ? 0 : 1;
    carouselApi?.scrollTo(slide);
  }

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
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="channel"><LayoutGrid className="w-4 h-4 mr-2"/>Channel</TabsTrigger>
          <TabsTrigger value="story"><Users className="w-4 h-4 mr-2"/>Story</TabsTrigger>
        </TabsList>
        <Carousel setApi={setCarouselApi} className="flex-1 w-full">
            <CarouselContent>
                <CarouselItem>
                    <div className="overflow-y-auto h-[calc(100vh_-_110px)] pb-4">
                        <StoreUpdates />
                        <div className="p-2">
                            <h2 className="text-sm font-semibold text-muted-foreground px-2 py-1">Recent Chats</h2>
                            <ChatList />
                        </div>
                    </div>
                </CarouselItem>
                 <CarouselItem>
                    <div className="overflow-y-auto h-[calc(100vh_-_110px)] p-4">
                        <StoryReel />
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
      </Tabs>
    </AppContainer>
  );
}

function StoreUpdates() {
  const { getRecentProducts, users, currentUser } = dataStore;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getRecentProducts());
  }, [getRecentProducts]);

  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="p-2">
        <h2 className="text-sm font-semibold text-muted-foreground px-2 py-1">Store Updates</h2>
        <div className="grid grid-cols-2 gap-2">
            {products.slice(0, 4).map(product => {
                const seller = users.find(u => u.id === product.sellerId);
                return (
                    <Card key={product.id} className="overflow-hidden">
                        <Link href={`/chat/${product.chatId}`} passHref>
                            <CardHeader className="p-0">
                                <Image src={product.imageUrl} alt={product.name} width={200} height={120} className="w-full h-24 object-cover" data-ai-hint="product image" />
                            </CardHeader>
                            <CardContent className="p-2">
                                <p className="text-sm font-semibold truncate">{product.name}</p>
                                <p className="text-xs text-primary font-bold">Rp{product.price.toLocaleString('id-ID')}</p>
                                {seller && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                        <Avatar className="w-4 h-4">
                                            <AvatarImage src={seller.avatar} />
                                            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{seller.name.split(' ')[0]}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Link>
                    </Card>
                )
            })}
        </div>
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
