

"use client"
import { AppContainer } from '@/components/AppContainer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { dataStore } from '@/lib/data';
import { Chat, Message, User, Product, ChatTheme, Order } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, ShoppingCart, MessageSquare, Package, Loader2, MoreVertical, Edit, Trash2, Camera, CreditCard, Image as ImageIcon, Upload, Save, Palette, Paperclip, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { io, Socket } from "socket.io-client";
import { UpgradeDialog } from '@/components/UpgradeDialog';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ChatPage() {
    const params = useParams<{ id: string }>();
    const chatId = params.id as string;
    const router = useRouter();
    const { getChatById, currentUser, addMessageToChat, addProductToChat, updateProductInChat, deleteProductFromChat, users, updateChatBackgroundAndTheme, createOrder, confirmOrder, uploadProofOfPayment } = dataStore;
    const { toast } = useToast();

    const [chat, setChat] = useState<Chat | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isBgChangerOpen, setIsBgChangerOpen] = useState(false);
    const [checkingOutProduct, setCheckingOutProduct] = useState<Product | null>(null);
    const socketRef = useRef<Socket | null>(null);
    
    // Force re-render to update order statuses
    const [_, setForceUpdate] = useState(0);
    const forceUpdate = () => setForceUpdate(f => f + 1);

    const handleConfirmOrder = (orderId: string) => {
        confirmOrder(orderId);
        forceUpdate(); // Re-render to show updated status
    };

    const handleUploadProof = (orderId: string, proofUrl: string) => {
        uploadProofOfPayment(orderId, proofUrl);
        forceUpdate(); // Re-render to show updated status
    };

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

        // Socket.io connection
        const socket = io({ path: "/api/socket" });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socket.emit('join-chat', chatId);
        });

        socket.on('new-message', (message: Message) => {
            setChat(prevChat => {
                if (!prevChat) return prevChat;
                const newMessages = [...prevChat.messages, message];
                // Prevent duplicate messages
                const uniqueMessages = newMessages.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
                return { ...prevChat, messages: uniqueMessages };
            });
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            if (socket) {
                socket.emit('leave-chat', chatId);
                socket.disconnect();
            }
        };
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
    
    const handleSendMessage = (newMessageData: Omit<Message, 'id' | 'timestamp' | 'senderId' | 'read' | 'delivered'>) => {
        const message = addMessageToChat(chat.id, newMessageData);
        if (socketRef.current && message) {
            socketRef.current.emit('chat-message', {
                chatId: chat.id,
                message: message,
            });
        }
    };

    const handleAddProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>) => {
        const newProduct = addProductToChat(chat.id, productData);
        const updatedChat = getChatById(chat.id);
        if(updatedChat) setChat(updatedChat);
        if(socketRef.current && updatedChat?.messages[updatedChat.messages.length - 1]){
            socketRef.current.emit('chat-message', {
                chatId: chat.id,
                message: updatedChat.messages[updatedChat.messages.length - 1]
            });
        }
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
    
    const handleUpdateBackground = (bgUrl: string, theme: ChatTheme) => {
      updateChatBackgroundAndTheme(chat.id, bgUrl, theme);
      const updatedChat = getChatById(chat.id);
      if(updatedChat) setChat(updatedChat);
      setIsBgChangerOpen(false);
    }

    const getChatInfo = (chat: Chat, currentUser: User): { name: string, avatar: string, status?: string } => {
        if (chat.type === 'group') {
            return { name: chat.name!, avatar: chat.avatar!, status: `${chat.participants.length} anggota` };
        }
        const otherUser = chat.participants.find(p => p.id !== currentUser.id)!;
        return { name: otherUser.name, avatar: otherUser.avatar, status: otherUser.online ? 'Online' : 'Offline' };
    };

    const { name, avatar, status } = getChatInfo(chat, currentUser);

    const isStore = chat.type === 'group' && chat.products && chat.products.length > 0;
    const defaultTab = isStore ? "store" : "chat";

    const messageAreaStyle: React.CSSProperties = {
      backgroundImage: chat.backgroundUrl ? `url(${chat.backgroundUrl})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      '--chat-primary': chat.theme?.primary,
      '--chat-primary-foreground': chat.theme?.primaryForeground,
      '--chat-accent': chat.theme?.accent,
      '--chat-accent-foreground': chat.theme?.accentForeground,
    } as React.CSSProperties;

    const handleConfirmCheckout = (paymentMethod: string) => {
        if (!checkingOutProduct) return;
        
        const newOrder = createOrder({
            buyerId: currentUser.id,
            product: checkingOutProduct,
            qty: 1,
            totalPrice: checkingOutProduct.price,
            paymentMethod: paymentMethod,
        });

        const seller = users.find(u => u.id === newOrder.sellerId);
        
        // Send a new 'order' type message
        handleSendMessage({
            type: 'order',
            body: `Pesanan baru untuk ${checkingOutProduct.name}.`,
            meta: {
                orderId: newOrder.id,
            }
        });
        
        if (socketRef.current) {
            socketRef.current.emit('new-order-notification', {
                sellerId: newOrder.sellerId,
                order: newOrder
            });
        }

        toast({
            title: "Pesanan Dibuat!",
            description: `Pesanan Anda untuk ${checkingOutProduct.name} telah dibuat. Silakan tunggu konfirmasi penjual.`,
        });
        setCheckingOutProduct(null);
    }
    
    const handleProductCardClick = (productId: string) => {
      const product = chat.products?.find(p => p.id === productId);
      if (product) {
        setCheckingOutProduct(product);
      }
    };

    return (
        <AppContainer>
            <ChatHeader 
                name={name} 
                avatarUrl={avatar} 
                status={status || ''} 
                chatId={chat.id}
                chatType={chat.type}
                onOpenBackgroundChanger={() => setIsBgChangerOpen(true)}
            />
            <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="store"><ShoppingCart className="w-4 h-4 mr-2"/>Toko</TabsTrigger>
                    <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2"/>Chat</TabsTrigger>
                </TabsList>
               
                <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden mt-0">
                    <ChatMessages 
                      messages={chat.messages} 
                      currentUser={currentUser} 
                      style={messageAreaStyle} 
                      onProductClick={handleProductCardClick}
                      onConfirmOrder={handleConfirmOrder}
                      onUploadProof={handleUploadProof}
                    />
                    <ChatInput onSendMessage={handleSendMessage} chat={chat} />
                </TabsContent>

                <TabsContent value="store" className="flex-1 overflow-y-auto p-4 bg-muted/30 mt-0">
                    <GroupStore 
                        chatId={chat.id}
                        products={chat.products || []}
                        onAddProduct={handleAddProduct}
                        onUpdateProduct={handleUpdateProduct}
                        onDeleteProduct={handleDeleteProduct}
                        onPurchase={(product) => setCheckingOutProduct(product)}
                        users={users} 
                        currentUser={currentUser}
                    />
                </TabsContent>
            </Tabs>
            <BackgroundChangerDialog 
              isOpen={isBgChangerOpen} 
              onOpenChange={setIsBgChangerOpen} 
              onSaveBackground={handleUpdateBackground}
              currentBackground={chat.backgroundUrl}
            />
            <Dialog open={!!checkingOutProduct} onOpenChange={(open) => !open && setCheckingOutProduct(null)}>
                <CheckoutDialog product={checkingOutProduct} onConfirm={handleConfirmCheckout} />
            </Dialog>
        </AppContainer>
    );
}

function ChatMessages({ messages, currentUser, style, onProductClick, onConfirmOrder, onUploadProof }: { messages: Message[], currentUser: User, style: React.CSSProperties, onProductClick: (productId: string) => void, onConfirmOrder: (orderId: string) => void, onUploadProof: (orderId: string, proofUrl: string) => void }) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages]);

    return (
        <ScrollArea className="flex-1 bg-muted/30" ref={scrollAreaRef} style={style}>
            <div className="p-4 space-y-4 bg-black/10 min-h-full">
                {messages.map(message => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        isCurrentUser={message.senderId === currentUser.id}
                        currentUser={currentUser}
                        onProductClick={onProductClick}
                        onConfirmOrder={onConfirmOrder}
                        onUploadProof={onUploadProof}
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
    onPurchase: (product: Product) => void;
    users: User[];
    currentUser: User;
}

function GroupStore({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onPurchase, users, currentUser }: GroupStoreProps) {
    const { toast } = useToast();
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

    const handleSellClick = () => {
        if (currentUser.role === 'business') {
            setIsAddProductOpen(true);
        } else {
            setIsUpgradeOpen(true);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Toko</h2>
                 <Button onClick={handleSellClick}>
                    <Plus className="w-4 h-4 mr-2" /> Jual Item
                 </Button>
            </div>
            
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <AddProductDialog onProductSubmit={handleProductAdded} />
            </Dialog>

            <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                <AddProductDialog product={editingProduct} onProductSubmit={handleProductUpdated} />
            </Dialog>

            <UpgradeDialog isOpen={isUpgradeOpen} onOpenChange={setIsUpgradeOpen} featureName="menjual produk" />

            {products.length === 0 ? (
                <Card className="text-center p-8 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                        <Package className="w-16 h-16 text-muted-foreground" />
                        <p className="text-muted-foreground">Belum ada produk yang dijual di obrolan ini.</p>
                        <Button variant="outline" onClick={handleSellClick}>Jual Item Pertama</Button>
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
                                                    <span>Ubah Item</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDeleteProduct(product.id)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Hapus Item</span>
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
                                    <Button className="w-full" onClick={() => onPurchase(product)}>
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Beli Sekarang
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
            title: "Informasi Kurang",
            description: "Silakan isi nama produk dan harga.",
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
        title: product ? "Produk Diperbarui!" : "Produk Terdaftar!",
        description: `${name} sekarang ${product ? 'diperbarui' : 'dijual'}.`
    });
  }

  return (
    <DialogContent>
        <DialogHeader>
            <DialogTitle>{product ? 'Ubah Item' : 'Jual Item Baru'}</DialogTitle>
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
                <Label htmlFor="name">Nama Produk</Label>
                <Input id="name" placeholder="cth. Gelas Buatan Tangan" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Harga (IDR)</Label>
                <Input id="price" type="number" placeholder="cth. 50000" value={price} onChange={e => setPrice(e.target.value)}/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (opsional)</Label>
                <Textarea id="description" placeholder="Deskripsikan item Anda" value={description} onChange={e => setDescription(e.target.value)}/>
            </div>
        </div>
        <DialogClose asChild>
            <Button onClick={handleSubmit}>{product ? 'Simpan Perubahan' : 'Jual Sekarang'}</Button>
        </DialogClose>
    </DialogContent>
  )
}

function CheckoutDialog({ product, onConfirm }: { product: Product | null, onConfirm: (paymentMethod: string) => void }) {
    if (!product) return null;
    const [paymentMethod, setPaymentMethod] = useState("gopay");
    
    const paymentMethods = [
      { id: "gopay", name: "GoPay", icon: "/image/ewallet/gopay.png"},
      { id: "ovo", name: "OVO", icon: "/image/ewallet/ovo.png"},
      { id: "shopeepay", name: "ShopeePay", icon: "/image/ewallet/shopeepay.png"},
      { id: "dana", name: "DANA", icon: "/image/ewallet/dana.png"},
    ];

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Konfirmasi Pesanan</DialogTitle>
                <DialogDescription>
                    Anda akan memesan item berikut. Pilih metode pembayaran Anda.
                </DialogDescription>
            </DialogHeader>
            <div className="py-2">
                <Card className="overflow-hidden">
                    <CardContent className="p-4 flex gap-4 items-start">
                        <Image src={product.imageUrl} alt={product.name} width={80} height={80} className="w-20 h-20 object-cover rounded-md border" data-ai-hint="product image" />
                        <div className="flex-1">
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                            <p className="font-bold text-lg text-primary mt-1">Rp{product.price.toLocaleString('id-ID')}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <div className="space-y-3">
                <Label>Metode Pembayaran</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((method) => (
                      <Label key={method.id} htmlFor={method.id} className={cn("flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 cursor-pointer", paymentMethod === method.id && "border-primary ring-2 ring-primary")}>
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Image src={method.icon} width={20} height={20} alt={method.name} className="h-5 w-auto object-contain" />
                          <span>{method.name}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
            </div>
            <DialogFooter className="mt-4">
                <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={() => onConfirm(paymentMethod)}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Konfirmasi Pesanan
                  </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

type BackgroundChangerDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveBackground: (url: string, theme: ChatTheme) => void;
  currentBackground?: string;
};

function BackgroundChangerDialog({ isOpen, onOpenChange, onSaveBackground, currentBackground }: BackgroundChangerDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [selectedBg, setSelectedBg] = useState(currentBackground || '');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedBg(currentBackground || '/image/background/theme1.jpeg');
    }
  }, [isOpen, currentBackground]);


  const backgrounds = [
    '/image/background/theme2.jpeg',
    '/image/background/theme3.jpeg',
    '/image/background/theme4.jpeg',
    '/image/background/bg_1.png',
    '/image/background/bg_2.png',
    '/image/background/bg_3.png',
    '/image/background/bg_4.png',
    '/image/background/bg_5.png',
    '/image/background/bg_6.png',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: 'destructive',
          title: 'File Terlalu Besar',
          description: 'Ukuran gambar tidak boleh melebihi 2MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedBg(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSave = async () => {
    if (!selectedBg) return;
    setIsGeneratingTheme(true);
    try {
        const response = await fetch('/api/theme-from-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: selectedBg }),
        });
        if (!response.ok) {
            throw new Error('Gagal menghasilkan tema dari gambar.');
        }
        const theme = await response.json();
        onSaveBackground(selectedBg, theme);

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Gagal Menyimpan Tema',
            description: error.message || 'Silakan coba gambar lain.',
        });
    } finally {
        setIsGeneratingTheme(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Latar Belakang Obrolan</DialogTitle>
          <DialogDescription>
            Pilih gambar atau unggah milik Anda. Warna tema obrolan akan disesuaikan secara otomatis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
          />
          <div className="relative aspect-[9/16] cursor-pointer group flex flex-col items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="mt-2 text-xs text-center text-muted-foreground">Unggah dari Galeri</p>
          </div>
          {backgrounds.map((bg, index) => (
            <div key={index} className={cn("relative aspect-[9/16] cursor-pointer group rounded-lg", selectedBg === bg && "ring-2 ring-primary ring-offset-2")} onClick={() => setSelectedBg(bg)}>
              <Image src={bg} alt={`Latar Belakang ${index + 1}`} layout="fill" objectFit="cover" className="rounded-lg" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
            <Button onClick={handleSave} disabled={isGeneratingTheme}>
                {isGeneratingTheme ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isGeneratingTheme ? 'Menghasilkan Tema...' : 'Simpan Latar Belakang'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
    
