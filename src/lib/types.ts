export type User = {
  id: string;
  name: string;
  avatar: string;
  status?: string;
  online: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  body: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'location' | 'presentation';
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
};

export type Story = {
  id: string;
  user: User;
  imageUrl: string;
  timestamp: Date;
  viewed: boolean;
};
