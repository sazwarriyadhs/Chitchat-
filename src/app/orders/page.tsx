
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppContainer } from '@/components/AppContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, ShoppingCart, Loader2 } from 'lucide-react';
import { dataStore } from '@/lib/data';
import { Order, User, Product } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function OrdersPage() {
  const { currentUser, getOrdersByUserId, users } = dataStore;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const userOrders = getOrdersByUserId(currentUser.id);
    setOrders(userOrders);
    setLoading(false);
  }, [currentUser.id, getOrdersByUserId]);

  const getStatusVariant = (status: Order['shippingStatus']): 'default' | 'secondary' | 'outline' | 'destructive' => {
      switch (status) {
          case 'Menunggu Konfirmasi': return 'default';
          case 'Dikemas': return 'secondary';
          case 'Dikirim': return 'outline';
          case 'Selesai': return 'secondary';
          default: return 'default';
      }
  }

  const getStatusColor = (status: Order['shippingStatus']) => {
    switch(status) {
      case 'Menunggu Konfirmasi': return 'bg-yellow-500';
      case 'Dikemas': return 'bg-blue-500';
      case 'Dikirim': return 'bg-green-500';
      case 'Selesai': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  }


  return (
    <AppContainer>
        <header className="flex items-center p-2 border-b gap-2 sticky top-0 bg-card z-10">
            <Link href="/profile" passHref>
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            </Link>
            <h1 className="text-xl font-bold font-headline">Pesanan Saya</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <ShoppingCart className="w-16 h-16 mb-4" />
                    <h2 className="text-lg font-semibold">Anda belum memiliki pesanan.</h2>
                    <p className="text-sm">Mari kita mulai berbelanja!</p>
                </div>
            ) : (
                orders.map(order => {
                    const seller = users.find(u => u.id === order.sellerId);
                    return (
                    <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="p-4 bg-muted/50 border-b flex-row justify-between items-center">
                           <div>
                                <CardTitle className="text-sm font-semibold">Pesanan #{order.id.slice(-6)}</CardTitle>
                                <CardDescription className="text-xs">
                                    {format(new Date(order.createdAt), "d MMMM yyyy, HH:mm", { locale: id })}
                                </CardDescription>
                           </div>
                           <Badge variant={getStatusVariant(order.shippingStatus)}>{order.shippingStatus}</Badge>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-start gap-4">
                                <Image 
                                    src={order.productSnapshot.imageUrl} 
                                    alt={order.productSnapshot.name} 
                                    width={64} 
                                    height={64} 
                                    className="w-16 h-16 rounded-lg border object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold">{order.productSnapshot.name}</p>
                                    <p className="text-sm text-muted-foreground">{order.qty} barang</p>
                                </div>
                            </div>
                             <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>Rp{order.productSnapshot.price.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ongkos Kirim</span>
                                    <span>Rp{order.shippingCost.toLocaleString('id-ID')}</span>
                                </div>
                                <Separator className="my-2"/>
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">Rp{order.totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 border-t flex justify-between items-center text-xs">
                             <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src={seller?.avatar} alt={seller?.name} />
                                    <AvatarFallback>{seller?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>Dijual oleh <strong>{seller?.name}</strong></span>
                            </div>
                            {order.paymentProof && (
                                <a href={order.paymentProof} target="_blank" rel="noopener noreferrer">
                                <Button variant="link" size="sm" className="h-auto p-0">Lihat Bukti Bayar</Button>
                                </a>
                            )}
                        </CardFooter>
                    </Card>
                    )
                })
            )}
        </main>
    </AppContainer>
  );
}
