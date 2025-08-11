
"use client"
import { AppContainer } from '@/components/AppContainer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { dataStore } from '@/lib/data';
import { Chat, Message, User, Product } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Plus, ShoppingCart, MessageSquare, Package, Loader2, MoreVertical, Edit, Trash2, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function ChatPage() {
    const params = useParams<{ id: string }>();
    const chatId = params.id as string;
    const { getChatById, currentUser, addMessageToChat, addProductToChat, updateProductInChat, deleteProductFromChat } = dataStore;

    const [chat, setChat] = useState<Chat | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!chatId) return;

        const loadChat = () => {
            const currentChat = getChatById(chatId);
            if (currentChat) {
                setChat(currentChat);
            } else {
                notFound();
            }
            setLoading(false);
        };
        
        loadChat();

        const interval = setInterval(() => {
            const updatedChat = getChatById(chatId as string);
             if (updatedChat) {
                setChat(prevChat => {
                    if (prevChat && JSON.stringify(prevChat.messages) === JSON.stringify(updatedChat.messages) && JSON.stringify(prevChat.products) === JSON.stringify(updatedChat.products)) {
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
        return notFound();
    }
    
    const handleSendMessage = (newMessage: Omit<Message, 'id' | 'timestamp' | 'senderId' | 'read' | 'delivered'>) => {
        addMessageToChat(chat.id, newMessage);
        const updatedChat = getChatById(chat.id);
        if(updatedChat) setChat(updatedChat);
    };

    const handleAddProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => {
        addProductToChat(chat.id, productData);
        const updatedChat = getChatById(chat.id);
        if(updatedChat) setChat(updatedChat);
    };

    const handleUpdateProduct = (productId: string, productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => {
        updateProductInChat(chat.id, productId, productData);
        const updatedChat = getChatById(chat.id);
        if(updatedChat) setChat(updatedChat);
    };
    
    const handleDeleteProduct = (productId: string) => {
        deleteProductFromChat(chat.id, productId);
        const updatedChat = getChatById(chat.id);
        if(updatedChat) setChat(updatedChat);
    };

    const getChatInfo = (chat: Chat, currentUser: User): { name: string, avatar: string, status?: string } => {
        if (chat.type === 'group') {
            return { name: chat.name!, avatar: chat.avatar!, status: `${chat.participants.length} members` };
        }
        const otherUser = chat.participants.find(p => p.id !== currentUser.id)!;
        return { name: otherUser.name, avatar: otherUser.avatar, status: otherUser.online ? 'Online' : 'Offline' };
    };

    const { name, avatar, status } = getChatInfo(chat, currentUser);

    const defaultTab = "chat";

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
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="store"><ShoppingCart className="w-4 h-4 mr-2"/>Store</TabsTrigger>
                    <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2"/>Chat</TabsTrigger>
                </TabsList>
               
                <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden mt-0">
                    <ChatMessages messages={chat.messages} currentUser={currentUser} />
                    <ChatInput onSendMessage={handleSendMessage} chat={chat} />
                </TabsContent>

                <TabsContent value="store" className="flex-1 overflow-y-auto p-4 bg-muted/30 mt-0">
                    <GroupStore 
                        chatId={chat.id}
                        products={chat.products || []}
                        onAddProduct={handleAddProduct}
                        onUpdateProduct={handleUpdateProduct}
                        onDeleteProduct={handleDeleteProduct}
                        onPurchase={handleSendMessage}
                        users={users} 
                        currentUser={currentUser}
                    />
                </TabsContent>
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

interface GroupStoreProps {
    chatId: string;
    products: Product[];
    onAddProduct: (data: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => void;
    onUpdateProduct: (productId: string, data: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => void;
    onDeleteProduct: (productId: string) => void;
    onPurchase: (message: Omit<Message, 'id' | 'timestamp' | 'senderId' | 'read' | 'delivered'>) => void;
    users: User[];
    currentUser: User;
}

function GroupStore({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onPurchase, users, currentUser }: GroupStoreProps) {
    const { toast } = useToast();
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleBuy = (product: Product) => {
        const seller = users.find(u => u.id === product.sellerId);
        onPurchase({
            type: 'text',
            body: `I have purchased ${product.name} from ${seller?.name || 'seller'}.`
        });
        toast({
            title: "Purchase Successful!",
            description: `You have purchased ${product.name}. A message has been sent to the chat.`
        });
    }
    
    const handleProductAdded = (productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => {
        onAddProduct(productData);
        setIsAddProductOpen(false);
    }
    
    const handleProductUpdated = (productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => {
        if (editingProduct) {
            onUpdateProduct(editingProduct.id, productData);
        }
        setEditingProduct(null);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Store</h2>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> List Item
                        </Button>
                    </DialogTrigger>
                    <AddProductDialog onProductSubmit={handleProductAdded} />
                </Dialog>
            </div>
            
            <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                <AddProductDialog product={editingProduct} onProductSubmit={handleProductUpdated} />
            </Dialog>


            {products.length === 0 ? (
                <Card className="text-center p-8 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                        <Package className="w-16 h-16 text-muted-foreground" />
                        <p className="text-muted-foreground">No products for sale in this chat yet.</p>
                        <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setIsAddProductOpen(true)}>List First Item</Button>
                        </DialogTrigger>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map(product => {
                        const seller = users.find(u => u.id === product.sellerId);
                        const isSeller = product.sellerId === currentUser.id;
                        return (
                            <Card key={product.id} className="overflow-hidden relative group">
                                {isSeller && (
                                    <div className="absolute top-1 right-1 z-10">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                 <Button variant="secondary" size="icon" className="h-7 w-7 rounded-full bg-black/40 text-white border-none hover:bg-black/60">
                                                    <MoreVertical className="w-4 h-4" />
                                                 </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Edit Item</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDeleteProduct(product.id)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Delete Item</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
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
    )
}

type AddProductDialogProps = {
  product?: Product | null;
  onProductSubmit: (data: Omit<Product, 'id'|'sellerId'|'chatId'>) => void;
}

function AddProductDialog({ product, onProductSubmit }: AddProductDialogProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://placehold.co/600x400.png');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
        setName(product.name);
        setPrice(String(product.price));
        setDescription(product.description);
        setImage(product.imageUrl);
    } else {
        // Reset form when dialog is for adding new product
        setName('');
        setPrice('');
        setDescription('');
        setImage('https://placehold.co/600x400.png');
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!name || !price) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out the product name and price.",
        });
        return;
    }
    
    onProductSubmit({
        name,
        price: parseFloat(price),
        description,
        imageUrl: image
    });

    toast({
        title: product ? "Product Updated!" : "Product Listed!",
        description: `${name} is now ${product ? 'updated' : 'for sale'}.`
    });
  }

  return (
    <DialogContent>
        <DialogHeader>
            <DialogTitle>{product ? 'Edit Item' : 'List a New Item for Sale'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />
            <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center relative group/image" onClick={() => imageInputRef.current?.click()}>
                <Image src={image} alt="Product image" width={300} height={160} className="object-cover rounded-lg w-full h-full cursor-pointer" data-ai-hint="product image"/>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity cursor-pointer rounded-lg">
                    <Camera className="w-8 h-8 text-white" />
                </div>
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
        <DialogClose asChild>
            <Button onClick={handleSubmit}>{product ? 'Save Changes' : 'List Item Now'}</Button>
        </DialogClose>
    </DialogContent>
  )
}

    