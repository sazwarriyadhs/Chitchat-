import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';
import { Order } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('ownerId');

  if (!ownerId) {
    return NextResponse.json({ error: 'ownerId is required' }, { status: 400 });
  }

  // In our prototype, "notifications" for a store owner are their incoming orders.
  // We will filter the global orders list to find all orders where the sellerId matches the ownerId.
  const allOrders = dataStore.orders;
  const notifications: Order[] = allOrders
    .filter(order => order.sellerId === ownerId)
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // We can format this to look more like a notification object if needed,
  // but for now, returning the order object contains all the necessary info.
  return NextResponse.json(notifications);
}
