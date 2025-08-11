
"use client"
import { AppContainer } from '@/components/AppContainer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { dataStore } from '@/lib/data';
import { Chat, Message, User, Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ShoppingCart, MessageSquare, Package, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function ChatPage({ params }: { params: { id: string } }) {
    const chatId = params.id;
    const { getChatById, currentUser, addMessageToChat, addProductToChat, users } = dataStore;

    const [chat, setChat] = useState<Chat | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const currentChat = getChatById(chatId);
        if (currentChat) {
            setChat(currentChat);
        } else {
            // If chat not found on initial load, it's a 404
            notFound();
        }
        setLoading(false);

        const interval = setInterval(() => {
            const updatedChat = getChatById(chatId);
            if(updatedChat) {
                // A simple check to see if messages have changed to avoid unnecessary re-renders
                setChat(prevChat => {
                    if (prevChat && JSON.stringify(prevChat) === JSON.stringify(updatedChat)) {
                        return prevChat;
                    }
                    return updatedChat;
                });
            }
        }, 1000); // Refresh data every second for real-time feel
        
        return () => clearInterval(interval);
    }, [chatId, getChatById]);
    
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
        // This will be caught by the notFound() call in useEffect, but as a fallback
        return notFound();
    }
    
    const handleSendMessage = (newMessage: Omit<Message, 'id' | 'timestamp' | 'senderId' | 'read' | 'delivered'>) => {
        addMessageToChat(chatId, newMessage);
        setChat(getChatById(chatId)); // Force re-render immediately
    };

    const handleAddProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => {
        addProductToChat(chatId, productData);
        setChat(getChatById(chatId)); // Force re-render immediately
    };

    const getChatInfo = (chat: Chat, currentUser: User): { name: string, avatar: string, status?: string } => {
        if (chat.type === 'group') {
            return { name: chat.name!, avatar: chat.avatar!, status: `${chat.participants.length} members` };
        }
        const otherUser = chat.participants.find(p => p.id !== currentUser.id)!;
        return { name: otherUser.name, avatar: otherUser.avatar, status: otherUser.online ? 'Online' : 'Offline' };
    };

    const { name, avatar, status } = getChatInfo(chat, currentUser);

    const defaultTab = chat.type === 'group' ? "store" : "chat";

    return (
        <AppContainer>
            <ChatHeader 
                name={name} 
                avatarUrl={avatar} 
                status={status || ''} 
                chatId={chat.id}
                chatType={chat.type}
            />
            <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden">
                {chat.type === 'group' && (
                     <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="store"><ShoppingCart className="w-4 h-4 mr-2"/>Store</TabsTrigger>
                        <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2"/>Chat</TabsTrigger>
                    </TabsList>
                )}
               
                <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden mt-0">
                    <ChatMessages messages={chat.messages} currentUser={currentUser} />
                    <ChatInput onSendMessage={handleSendMessage} chat={chat} />
                </TabsContent>

                {chat.type === 'group' && (
                    <TabsContent value="store" className="flex-1 overflow-y-auto p-4 bg-muted/30 mt-0">
                        <GroupStore products={chat.products || []} onAddProduct={handleAddProduct} users={users} />
                    </TabsContent>
                )}

            </Tabs>
        </AppContainer>
    );
}

function ChatMessages({ messages, currentUser }: { messages: Message[], currentUser: User }) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'auto' });
            }
        }
    }, [messages]);

    return (
        <ScrollArea className="flex-1 bg-muted/30" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
                {messages.map(message => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        isCurrentUser={message.senderId === currentUser.id}
                    />
                ))}
            </div>
        </ScrollArea>
    )
}

function GroupStore({ products, onAddProduct, users }: { products: Product[], onAddProduct: (data: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => void, users: User[] }) {
    const { toast } = useToast();
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

    const handleBuy = (product: Product) => {
        toast({
            title: "Purchase Successful!",
            description: `You have purchased ${product.name}.`
        })
    }
    
    const handleProductAdded = (productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => {
        onAddProduct(productData);
        setIsAddProductOpen(false); // Close the dialog
    }

    return (
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Group Store</h2>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            List Item
                        </Button>
                    </DialogTrigger>
                </div>

                {products.length === 0 ? (
                    <Card className="text-center p-8 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-4">
                            <Package className="w-16 h-16 text-muted-foreground" />
                            <p className="text-muted-foreground">No products for sale in this group yet.</p>
                            <DialogTrigger asChild>
                            <Button variant="outline">List First Item</Button>
                            </DialogTrigger>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map(product => {
                            const seller = users.find(u => u.id === product.sellerId);
                            return (
                                <Card key={product.id} className="overflow-hidden">
                                    <CardHeader className="p-0">
                                        <Image src={product.imageUrl} alt={product.name} width={300} height={200} className="w-full h-32 object-cover" data-ai-hint="product image" />
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <CardTitle className="text-base mb-1">{product.name}</CardTitle>
                                        <CardDescription className="text-xs line-clamp-2 mb-2 h-8">{product.description}</CardDescription>
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-primary">Rp{product.price.toLocaleString('id-ID')}</p>
                                            {seller && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Avatar className="w-5 h-5">
                                                        <AvatarImage src={seller.avatar} />
                                                        <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{seller.name.split(' ')[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-2">
                                        <Button className="w-full" onClick={() => handleBuy(product)}>
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Buy Now
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
             <AddProductDialog onProductAdded={handleProductAdded} />
        </Dialog>
    )
}

type AddProductDialogProps = {
  onProductAdded: (data: Omit<Product, 'id'|'sellerId'|'chatId'>) => void;
}

function AddProductDialog({ onProductAdded }: AddProductDialogProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://placehold.co/600x400.png');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name || !price) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out the product name and price.",
        });
        return;
    }
    onProductAdded({
        name,
        price: parseFloat(price),
        description,
        imageUrl: image
    });
    toast({
        title: "Product Listed!",
        description: `${name} is now for sale.`
    });
    // Reset form
    setName('');
    setPrice('');
    setDescription('');
  }

  return (
    <DialogContent>
        <DialogHeader>
            <DialogTitle>List a New Item for Sale</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                <Image src={image} alt="Product image" width={300} height={160} className="object-cover rounded-lg" data-ai-hint="product image"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Handmade Mug" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Price (IDR)</Label>
                <Input id="price" type="number" placeholder="e.g. 50000" value={price} onChange={e => setPrice(e.target.value)}/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" placeholder="Describe your item" value={description} onChange={e => setDescription(e.target.value)}/>
            </div>
        </div>
        <Button onClick={handleSubmit}>List Item Now</Button>
    </DialogContent>
  )
}
