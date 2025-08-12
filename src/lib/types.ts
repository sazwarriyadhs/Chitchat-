export type User = {
  id: string;
  name: string;
  avatar: string;
  status?: string;
  online: boolean;
  role: 'business' | 'regular';
};

export type Message = {
  id: string;
  senderId: string;
  body: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'location' | 'presentation' | 'product';
  meta?: { [key: string]: any };
  delivered: boolean;
  read: boolean;
};

export type Chat = {
  id: string;
  type: 'private' | 'group';
  participants: User[];
  messages: Message[];
  name?: string;
  avatar?: string;
  products?: Product[];
  backgroundUrl?: string;
};

export type Story = {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: Date;
  viewed: boolean;
};

export type Presentation = {
  id:string;
  userId: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
};

export type Product = {
  id: string;
  chatId: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};
