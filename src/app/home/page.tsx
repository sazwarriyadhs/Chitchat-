
"use client"
import Link from 'next/link';
import { Plus, Search, ShoppingCart } from 'lucide-react';
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
  const { getRecentProducts, users } = dataStore;
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(getRecentProducts());
  }, [getRecentProducts]);

  const handleOrder = () => {
    if (selectedProduct) {
      router.push(`/chat/${selectedProduct.chatId}`);
    }
  };

  if (products.length === 0) {
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
                {products.map(product => {
                    const seller = users.find(u => u.id === product.sellerId);
                    return (
                        <CarouselItem key={product.id} className="basis-1/3 pl-2">
                            <Card className="overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                                <CardHeader className="p-0">
                                    <Image src={product.imageUrl} alt={product.name} width={200} height={120} className="w-full h-24 object-cover" data-ai-hint="product image" />
                                </CardHeader>
                                <CardContent className="p-2">
                                    <p className="text-sm font-semibold truncate">{product.name}</p>
                                    <p className="text-xs text-primary font-bold">Rp{product.price.toLocaleString('id-ID')}</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
        </Carousel>
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
            <DialogContent>
                {selectedProduct && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{selectedProduct.name}</DialogTitle>
                            <DialogDescription>{selectedProduct.description}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="rounded-lg overflow-hidden">
                                <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} width={400} height={250} className="w-full h-auto object-cover" data-ai-hint="product image" />
                            </div>
                            <p className="text-2xl font-bold text-primary">Rp{selectedProduct.price.toLocaleString('id-ID')}</p>
                            <Button className="w-full" onClick={handleOrder}>
                               <ShoppingCart className="w-4 h-4 mr-2" /> Order Now
                            </Button>
                        </div>
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
