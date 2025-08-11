
import { User, Chat, Story, Message, Presentation, Product } from './types';
import { subHours, subMinutes, subDays } from 'date-fns';

class DataStore {
  public users: User[];
  public chats: Chat[];
  public stories: Story[];
  public presentations: Presentation[];
  public currentUser: User;

  constructor() {
    this.users = [
      { id: 'ec4241f4-1cc2-462e-81d7-7725b31a1a1f', name: 'Andi Saputra', avatar: 'https://ik.imagekit.io/demo/avatar1.jpg', status: 'Ngopi dulu...', online: true },
      { id: '65a40f57-c574-438d-a21b-cd8472d3c769', name: 'Budi Santoso', avatar: 'https://ik.imagekit.io/demo/avatar2.jpg', status: 'Kerja keras, tidur nyenyak', online: false },
      { id: '969f5a5e-5ff0-406e-9650-821aa22bc886', name: 'Citra Dewi', avatar: 'https://ik.imagekit.io/demo/avatar3.jpg', status: 'Lagi liburan', online: true },
      { id: 'd90de2e2-ea68-43e2-a0aa-92ab4a7b414b', name: 'Dina Pratiwi', avatar: 'https://ik.imagekit.io/demo/avatar4.jpg', status: 'Belajar coding', online: false },
      { id: '36190390-d9fc-45ba-862d-155811dbd129', name: 'Eko Prabowo', avatar: 'https://ik.imagekit.io/demo/avatar5.jpg', status: 'Selalu semangat!', online: true },
    ];
    this.currentUser = this.users[0];

    this.chats = [
      {
        id: 'chat-1',
        type: 'private',
        participants: [this.currentUser, this.users[1]],
        messages: [
          { id: 'msg-1-1', senderId: this.users[1].id, body: 'Hey, how is it going?', timestamp: subMinutes(new Date(), 5), type: 'text', read: true, delivered: true },
          { id: 'msg-1-2', senderId: this.currentUser.id, body: 'Pretty good! Just working on the new chat app. What do you think?', timestamp: subMinutes(new Date(), 4), type: 'text', read: true, delivered: true },
          { id: 'msg-1-3', senderId: this.users[1].id, body: 'Looks amazing! The UI is so clean.', timestamp: subMinutes(new Date(), 3), type: 'text', read: false, delivered: true },
        ],
        products: [],
      },
      {
        id: 'chat-2',
        type: 'private',
        participants: [this.currentUser, this.users[2]],
        messages: [
          { id: 'msg-2-1', senderId: this.users[2].id, body: 'Can you send me the file?', timestamp: subHours(new Date(), 1), type: 'text', read: true, delivered: true },
          { id: 'msg-2-2', senderId: this.currentUser.id, body: 'Sure, here it is.', timestamp: subHours(new Date(), 1), type: 'file', meta: { fileName: 'project-brief.pdf', fileUrl: '#' }, read: true, delivered: true },
        ],
        products: [],
      },
      {
        id: 'chat-3',
        type: 'group',
        name: 'Project Team',
        avatar: 'https://placehold.co/100x100.png',
        participants: [this.currentUser, this.users[1], this.users[3]],
        messages: [
          { id: 'msg-3-1', senderId: this.users[3].id, body: 'Team, let\'s sync up at 3 PM.', timestamp: subHours(new Date(), 2), type: 'text', read: true, delivered: true },
          { id: 'msg-3-2', senderId: this.currentUser.id, body: 'Sounds good!', timestamp: subHours(new Date(), 2), type: 'text', read: true, delivered: true },
          { id: 'msg-3-3', senderId: this.users[1].id, body: 'I\'ll be there.', timestamp: subHours(new Date(), 2), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-1', chatId: 'chat-3', sellerId: this.users[1].id, name: 'Vintage Camera', description: 'A classic film camera from the 70s. Fully functional.', price: 750000, imageUrl: 'https://placehold.co/600x400.png' },
            { id: 'prod-2', chatId: 'chat-3', sellerId: this.users[3].id, name: 'Handmade Scarf', description: 'Warm and cozy scarf, knitted by hand. Various colors available.', price: 150000, imageUrl: 'https://placehold.co/600x400.png' },
        ]
      },
    ];

    this.stories = [
        { id: 'story-1', userId: this.users[1].id, imageUrl: 'https://placehold.co/400x700.png', timestamp: subHours(new Date(), 2), viewed: false },
        { id: 'story-2', userId: this.users[2].id, imageUrl: 'https://placehold.co/400x700.png', timestamp: subHours(new Date(), 5), viewed: false },
        { id: 'story-3', userId: this.users[3].id, imageUrl: 'https://placehold.co/400x700.png', timestamp: subHours(new Date(), 8), viewed: true },
    ];
    
    this.presentations = [
        { id: 'pres-1', userId: this.currentUser.id, file_name: 'Q3-roadmap.pptx', file_url: '#', uploaded_at: subDays(new Date(), 1).toISOString() }
    ];

    // Bind methods
    this.getChatById = this.getChatById.bind(this);
    this.addMessageToChat = this.addMessageToChat.bind(this);
    this.createGroupChat = this.createGroupChat.bind(this);
    this.updateGroupChat = this.updateGroupChat.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.addStory = this.addStory.bind(this);
    this.addPresentation = this.addPresentation.bind(this);
    this.getPresentationsByUserId = this.getPresentationsByUserId.bind(this);
    this.addProductToChat = this.addProductToChat.bind(this);
    this.updateProductInChat = this.updateProductInChat.bind(this);
    this.deleteProductFromChat = this.deleteProductFromChat.bind(this);
    this.getRecentProducts = this.getRecentProducts.bind(this);
  }

  getChatById(chatId: string): Chat | undefined {
    return this.chats.find(c => c.id === chatId);
  }
  
  addMessageToChat(chatId: string, newMessage: Omit<Message, 'id' | 'timestamp' | 'senderId' | 'read' | 'delivered'>): Message | null {
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return null;

    const message: Message = {
        ...newMessage,
        id: `msg-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        senderId: this.currentUser.id,
        read: false,
        delivered: true,
    };
    
    this.chats[chatIndex].messages.push(message);
    // Move chat to top
    const chat = this.chats[chatIndex];
    this.chats.splice(chatIndex, 1);
    this.chats.unshift(chat);

    return message;
  }

  createGroupChat(groupName: string, participantIds: string[], avatar: string) {
    const participants = this.users.filter(u => participantIds.includes(u.id));
    const newGroup: Chat = {
      id: `chat-${Date.now()}`,
      type: 'group',
      name: groupName,
      avatar: avatar,
      participants: participants,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: this.currentUser.id,
          body: `Welcome to ${groupName}!`,
          timestamp: new Date(),
          type: 'text',
          read: true,
          delivered: true,
        },
      ],
      products: [],
    };

    this.chats.unshift(newGroup);
    return newGroup;
  }

  updateGroupChat(chatId: string, updates: { name: string, avatar: string, participantIds: string[] }) {
    const chatIndex = this.chats.findIndex(c => c.id === chatId && c.type === 'group');
    if (chatIndex === -1) return null;
    
    const participants = this.users.filter(u => updates.participantIds.includes(u.id));
    
    this.chats[chatIndex] = {
      ...this.chats[chatIndex],
      name: updates.name,
      avatar: updates.avatar,
      participants: participants
    };

    return this.chats[chatIndex];
  }
  
  updateUser(userId: string, updates: Partial<User>) {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if(userIndex !== -1) {
          this.users[userIndex] = { ...this.users[userIndex], ...updates };
          if(userId === this.currentUser.id) {
              this.currentUser = this.users[userIndex];
          }
      }
  }

  addStory(userId: string, imageUrl: string) {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      userId: userId,
      imageUrl: imageUrl,
      timestamp: new Date(),
      viewed: false,
    };
    this.stories.unshift(newStory);
    return newStory;
  }

  addPresentation(userId: string, fileName: string): Presentation {
      const newPresentation: Presentation = {
          id: `pres-${Date.now()}`,
          userId,
          file_name: fileName,
          file_url: '#', // Mock URL
          uploaded_at: new Date().toISOString(),
      };
      this.presentations.unshift(newPresentation);
      return newPresentation;
  }

  getPresentationsByUserId(userId: string): Presentation[] {
      return this.presentations.filter(p => p.userId === userId).sort((a,b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
  }

  addProductToChat(chatId: string, productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>): Product | null {
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return null;

    const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        chatId: chatId,
        sellerId: this.currentUser.id
    };

    if (!this.chats[chatIndex].products) {
        this.chats[chatIndex].products = [];
    }

    this.chats[chatIndex].products!.unshift(newProduct);
    
    // Also post a message to the chat
    this.addMessageToChat(chatId, {
        body: `New item for sale: ${newProduct.name}`,
        type: 'product',
        meta: {
            productId: newProduct.id,
            productName: newProduct.name,
            productPrice: newProduct.price,
            productImage: newProduct.imageUrl
        }
    });

    return newProduct;
  }
  
  updateProductInChat(chatId: string, productId: string, productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>): Product | null {
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return null;

    const chat = this.chats[chatIndex];
    if (!chat.products) return null;

    const productIndex = chat.products.findIndex(p => p.id === productId);
    if (productIndex === -1) return null;

    const updatedProduct = {
      ...chat.products[productIndex],
      ...productData
    };
    
    this.chats[chatIndex].products![productIndex] = updatedProduct;
    return updatedProduct;
  }

  deleteProductFromChat(chatId: string, productId: string): boolean {
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return false;

    const chat = this.chats[chatIndex];
    if (!chat.products) return false;
    
    const initialLength = chat.products.length;
    this.chats[chatIndex].products = chat.products.filter(p => p.id !== productId);
    
    return this.chats[chatIndex].products!.length < initialLength;
  }

  getRecentProducts(): Product[] {
    const allProducts: Product[] = [];
    this.chats.forEach(chat => {
      if (chat.products) {
        allProducts.push(...chat.products);
      }
    });
    // Sort by id, which is based on timestamp
    return allProducts.sort((a, b) => b.id.localeCompare(a.id));
  }
}

// Singleton instance of the data store
export const dataStore = new DataStore();
