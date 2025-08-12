

import { cn } from "@/lib/utils";
import { Message, User, Order } from "@/lib/types";
import { dataStore } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Presentation, Image as ImageIcon, ShoppingCart, CheckCircle2, Upload, AlertCircle, Clock, Package, Eye } from "lucide-react";
import Image from "next/image";
import { LocationMessage } from "./LocationMessage";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";

type ChatMessageProps = {
  message: Message;
  isCurrentUser: boolean;
  currentUser: User;
  onProductClick: (productId: string) => void;
  onConfirmOrder: (orderId: string) => void;
  onUploadProof: (orderId: string, proofUrl: string) => void;
};

export function ChatMessage({ message, isCurrentUser, currentUser, onProductClick, onConfirmOrder, onUploadProof }: ChatMessageProps) {
  const sender = dataStore.users.find((u) => u.id === message.senderId);

  if (!sender) {
    return null;
  }

  // System message style for product announcements
  if (message.meta?.productId && message.type !== 'product' && message.type !== 'image' && message.type !== 'order') {
    return (
      <div className="text-center text-xs text-muted-foreground my-2">
        <span className="font-semibold">{isCurrentUser ? 'Anda' : sender.name}</span> mendaftarkan item baru: <span className="font-semibold">{message.meta?.productName}</span>
      </div>
    )
  }

  const bubbleStyle = isCurrentUser 
    ? { 
        backgroundColor: 'hsl(var(--chat-primary))', 
        color: 'hsl(var(--chat-primary-foreground))' 
      }
    : {
        backgroundColor: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))'
      };


  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={sender.avatar} />
          <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg rounded-xl",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none shadow-sm",
          ['order', 'image'].includes(message.type) ? 'p-0 overflow-hidden' : 'px-4 py-2' // No padding for order card wrapper
        )}
        style={bubbleStyle}
      >
        {!isCurrentUser && !['text', 'order', 'image'].includes(message.type) && (
          <p className="text-xs font-semibold mb-1 px-4 pt-2">{sender.name}</p>
        )}
        <MessageContent 
          message={message} 
          isCurrentUser={isCurrentUser} 
          currentUser={currentUser}
          onProductClick={onProductClick}
          onConfirmOrder={onConfirmOrder}
          onUploadProof={onUploadProof}
        />
      </div>
    </div>
  );
}

const MessageContent = ({ message, isCurrentUser, currentUser, onProductClick, onConfirmOrder, onUploadProof }: Omit<ChatMessageProps, 'currentUser'> & { currentUser: User }) => {
  const textColor = isCurrentUser ? 'text-primary-foreground' : 'text-card-foreground';
  const style = isCurrentUser ? { color: 'hsl(var(--chat-primary-foreground))' } : { color: 'hsl(var(--card-foreground))' };
  
  switch (message.type) {
    case 'text':
      return <p className="text-sm" style={style}>{message.body}</p>;
    case 'image':
      if (message.meta?.orderId) {
        return <OrderCard meta={message.meta} currentUser={currentUser} onConfirmOrder={onConfirmOrder} onUploadProof={onUploadProof} messageBody={message.body} />
      }
      return <Card className="bg-transparent border-0 shadow-none">
          <CardContent className="p-0">
            <Image src={message.meta?.fileUrl || "https://placehold.co/600x400.png"} width={250} height={150} alt="Shared image" className="rounded-lg" data-ai-hint="chat image" />
            {message.body && <p className={cn("text-sm pt-2", textColor, "px-3 pb-2")} style={style}>{message.body}</p>}
          </CardContent>
        </Card>
    case 'file':
      return <FileCard icon={FileText} title={message.meta?.fileName || 'File'} description={message.body} isCurrentUser={isCurrentUser} />
    case 'location':
      const { latitude, longitude } = message.meta as { latitude: number; longitude: number };
      return <LocationMessage latitude={latitude} longitude={longitude} description={message.body} isCurrentUser={isCurrentUser}/>;
    case 'presentation':
      return <FileCard icon={Presentation} title={message.meta?.fileName || 'Presentation'} description={message.body} isCurrentUser={isCurrentUser} />
    case 'product':
        return <ProductCard meta={message.meta} body={message.body} isCurrentUser={isCurrentUser} onProductClick={onProductClick} />;
    case 'order':
        return <OrderCard meta={message.meta} currentUser={currentUser} onConfirmOrder={onConfirmOrder} onUploadProof={onUploadProof} />
    default:
      return null;
  }
}

const FileCard = ({ icon: Icon, title, description, isCurrentUser }: { icon: React.ElementType, title: string, description: string, isCurrentUser: boolean }) => {
    const textColor = isCurrentUser ? 'var(--chat-primary-foreground)' : 'var(--card-foreground)';
    const mutedColor = isCurrentUser ? 'var(--chat-primary-foreground)' : 'var(--muted-foreground)';
    const iconBg = isCurrentUser ? 'hsla(var(--chat-primary-foreground), 0.2)' : 'hsl(var(--muted))';
    const descriptionOpacity = isCurrentUser ? '0.8' : '1';

    return (
        <a href={ "https://placehold.co/1x1.png" } target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 not-prose">
            <div className="p-2 rounded-lg" style={{ backgroundColor: iconBg }}>
                <Icon className="w-6 h-6" style={{ color: `hsl(${textColor})`}} />
            </div>
            <div>
                <p className="font-semibold text-sm" style={{ color: `hsl(${textColor})`}}>{title}</p>
                <p className="text-xs" style={{ color: `hsl(${mutedColor})`, opacity: descriptionOpacity }}>{description}</p>
            </div>
        </a>
    )
}

const ProductCard = ({ meta, body, isCurrentUser, onProductClick }: { meta: any, body: string, isCurrentUser: boolean, onProductClick: (productId: string) => void }) => {
    const textColor = isCurrentUser ? 'text-primary-foreground' : 'text-card-foreground';
    
    const handleCardClick = () => {
      onProductClick(meta.productId);
    };

    return (
        <Card className={cn("w-64", isCurrentUser ? 'bg-transparent border-primary-foreground/30' : 'bg-card border')}>
            <CardContent className="p-2 space-y-2">
                <p className={cn("text-xs", isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground")}>{body}</p>
                <div className="flex gap-3">
                    <Image src={meta.productImage} alt={meta.productName} width={64} height={64} className="rounded-md object-cover h-16 w-16" data-ai-hint="product image thumbnail"/>
                    <div className="flex flex-col justify-between">
                        <div>
                            <p className={cn("font-bold", textColor)}>{meta.productName}</p>
                            <p className={cn("text-sm font-semibold", isCurrentUser ? 'text-green-300' : 'text-green-500')}>Rp{meta.productPrice.toLocaleString('id-ID')}</p>
                        </div>
                         <Button size="sm" variant={isCurrentUser ? 'secondary' : 'default'} className="h-7 mt-1" onClick={handleCardClick}>
                            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                            Beli Lagi
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function OrderCard({ meta, currentUser, onConfirmOrder, onUploadProof, messageBody }: { meta: any, currentUser: User, onConfirmOrder: (orderId: string) => void, onUploadProof: (orderId: string, proofUrl: string) => void, messageBody?: string }) {
  const { getOrderById } = dataStore;
  const order = getOrderById(meta.orderId);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!order) {
    return <div className="p-4 text-xs text-destructive-foreground bg-destructive">Pesanan tidak ditemukan.</div>;
  }

  const { productSnapshot, sellerId, buyerId, shippingStatus } = order;
  const isSeller = currentUser.id === sellerId;
  const isBuyer = currentUser.id === buyerId;

  const handleProofUploadClick = () => {
    proofInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            onUploadProof(order.id, result);
            toast({ title: "Bukti pembayaran terunggah!", description: "Status pesanan telah diperbarui." });
        };
        reader.readAsDataURL(file);
    }
  };

  const getStatusInfo = () => {
    switch (shippingStatus) {
      case 'Menunggu Konfirmasi': return { icon: AlertCircle, text: 'Menunggu Konfirmasi Penjual', color: 'text-amber-500' };
      case 'Menunggu Pembayaran': return { icon: Clock, text: 'Menunggu Pembayaran Pembeli', color: 'text-blue-500' };
      case 'Dikemas': return { icon: Package, text: 'Pesanan Sedang Dikemas', color: 'text-indigo-500' };
      case 'Dikirim': return { icon: CheckCircle2, text: 'Pesanan Telah Dikirim', color: 'text-green-500' };
      case 'Selesai': return { icon: CheckCircle2, text: 'Pesanan Selesai', color: 'text-gray-500' };
      default: return { icon: AlertCircle, text: 'Status Tidak Diketahui', color: 'text-red-500' };
    }
  };
  const { icon: StatusIcon, text: statusText, color: statusColor } = getStatusInfo();
  
  return (
    <Card className="w-64 bg-card border-none rounded-xl">
        {meta.fileUrl && <Image src={meta.fileUrl} alt={productSnapshot.name} width={256} height={144} className="w-full h-36 object-cover" data-ai-hint="product image"/>}
      <div className="p-3 space-y-3">
        {messageBody && <p className="text-sm text-card-foreground">{messageBody}</p>}
        
        <div className={cn("flex items-center gap-2 text-xs font-medium p-2 rounded-md", statusColor.replace('text-', 'bg-') + '/10', statusColor)}>
            <StatusIcon className="w-4 h-4"/>
            <span>{statusText}</span>
        </div>

        {order.paymentProof && (
             <Card className="bg-muted/50">
                <CardContent className="p-3 text-card-foreground">
                    <h4 className="text-xs font-semibold mb-2">Rincian Pembayaran</h4>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span>Subtotal</span><span>Rp{order.productSnapshot.price.toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Ongkir</span><span>Rp{order.shippingCost.toLocaleString('id-ID')}</span></div>
                        <Separator className="my-1 bg-border/50"/>
                        <div className="flex justify-between font-bold"><span>Total</span><span>Rp{order.totalPrice.toLocaleString('id-ID')}</span></div>
                    </div>
                    <a href={order.paymentProof} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="w-full mt-3 h-8">
                           <Eye className="w-4 h-4 mr-2"/> Lihat Bukti Bayar
                        </Button>
                    </a>
                </CardContent>
            </Card>
        )}

        <div className="flex flex-col gap-2">
            {isSeller && shippingStatus === 'Menunggu Konfirmasi' && (
                <Button size="sm" onClick={() => onConfirmOrder(order.id)}>
                    Konfirmasi Pesanan
                </Button>
            )}
            {isBuyer && shippingStatus === 'Menunggu Pembayaran' && (
                <>
                    <input type="file" ref={proofInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Button size="sm" variant="outline" onClick={handleProofUploadClick}>
                        <Upload className="w-4 h-4 mr-2" /> Unggah Bukti Bayar
                    </Button>
                </>
            )}
        </div>
      </div>
    </Card>
  );
}
