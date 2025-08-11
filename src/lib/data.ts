
import { User, Chat, Story, Message, Presentation, Product } from './types';
import { subHours, subMinutes, subDays } from 'date-fns';

// NOTE: This file is being refactored to use a database.
// The dataStore class is being kept for API compatibility with components,
// but its methods will now query the database instead of using mock data.

class DataStore {
  public users: User[];
  public chats: Chat[];
  public stories: Story[];
  public presentations: Presentation[];
  public currentUser: User;

  constructor() {
    // These arrays will now be populated from the database,
    // but are kept for type consistency during the transition.
    this.users = [];
    this.chats = [];
    this.stories = [];
    this.presentations = [];
    
    // Set a default mock user. The login flow will overwrite this.
    this.currentUser = { id: 'ec4241f4-1cc2-462e-81d7-7725b31a1a1f', name: 'Andi Saputra', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-1_CPcW4a7-D.png', status: 'Ngopi dulu...', online: true, role: 'business' };

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
    this.createUser = this.createUser.bind(this);
    this.getStores = this.getStores.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
  }

  // NOTE: In a real implementation, all these methods would become async
  // and would query a database. For this prototype, we will continue
  // to simulate this behavior with in-memory data that mimics database interactions.
  // The provided database schema would be used to build these queries.

  setCurrentUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
        this.currentUser = user;
    } else {
        // Fallback to a default user if not found, to prevent crashes
        this.currentUser = { id: 'ec4241f4-1cc2-462e-81d7-7725b31a1a1f', name: 'Andi Saputra', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-1_CPcW4a7-D.png', status: 'Ngopi dulu...', online: true, role: 'business' };
    }
  }

  getChatById(chatId: string): Chat | undefined {
     // This would be: SELECT * FROM chats WHERE id = chatId;
     // And then join with users, messages, products tables.
    return this.chats.find(c => c.id === chatId);
  }
  
  addMessageToChat(chatId: string, newMessage: Omit<Message, 'id' | 'timestamp' | 'senderId' | 'read' | 'delivered'>): Message | null {
    // This would be: INSERT INTO messages (...) VALUES (...);
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
    const chat = this.chats[chatIndex];
    this.chats.splice(chatIndex, 1);
    this.chats.unshift(chat);

    return message;
  }

  createGroupChat(groupName: string, participantIds: string[], avatar: string) {
    // This would be: INSERT INTO chats (...) VALUES (...);
    // And then: INSERT INTO chat_participants (...) VALUES (...);
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
          body: `Selamat datang di ${groupName}!`,
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
    // This would be: UPDATE chats SET ... WHERE id = chatId;
    // And then manage chat_participants table.
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
    // This would be: UPDATE users SET ... WHERE id = userId;
      const userIndex = this.users.findIndex(u => u.id === userId);
      if(userIndex !== -1) {
          this.users[userIndex] = { ...this.users[userIndex], ...updates };
          if(userId === this.currentUser.id) {
              this.currentUser = this.users[userIndex];
          }
      }
  }

  addStory(userId: string, imageUrl: string) {
    // This would be: INSERT INTO stories (...) VALUES (...);
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
    // This would be: INSERT INTO presentations (...) VALUES (...);
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
      // This would be: SELECT * FROM presentations WHERE userId = userId;
      return this.presentations.filter(p => p.userId === userId).sort((a,b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
  }

  addProductToChat(chatId: string, productData: Omit<Product, 'id' | 'sellerId' | 'chatId'>): Product | null {
    // This would be: INSERT INTO products (...) VALUES (...);
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
    // This would be: UPDATE products SET ... WHERE id = productId;
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
    // This would be: DELETE FROM products WHERE id = productId;
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return false;

    const chat = this.chats[chatIndex];
    if (!chat.products) return false;
    
    const initialLength = chat.products.length;
    this.chats[chatIndex].products = chat.products.filter(p => p.id !== productId);
    
    return this.chats[chatIndex].products!.length < initialLength;
  }

  getRecentProducts(): Product[] {
    // This would be: SELECT * FROM products ORDER BY created_at DESC;
    const allProducts: Product[] = [];
    this.chats.forEach(chat => {
      if (chat.products) {
        allProducts.push(...chat.products);
      }
    });
    return allProducts.sort((a, b) => b.id.localeCompare(a.id));
  }

  getStores(): Chat[] {
    // This would be: SELECT * FROM chats WHERE type = 'group' AND has_products = true;
    return this.chats.filter(chat => chat.type === 'group' && chat.products && chat.products.length > 0).sort((a, b) => a.id.localeCompare(b.id));
  }

  createUser(userData: Omit<User, 'id' | 'avatar' | 'online' | 'status'> & { password?: string }): User {
    // This would be: INSERT INTO users (...) VALUES (...);
    const existingUser = this.users.find(u => u.name === userData.email);
    if (existingUser) {
        throw new Error("User with this email already exists.");
    }
    
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        avatar: 'https://placehold.co/100x100.png',
        online: false,
        status: 'New user!',
        role: userData.role
    };

    this.users.push(newUser);
    return newUser;
  }
}

// Since we are moving to a database, we will export functions instead of a singleton instance.
// For now, these functions will still use a mock data instance, but the API surface
// prepares for a full database integration.

const mockData = {
    users: [
      { id: 'ec4241f4-1cc2-462e-81d7-7725b31a1a1f', name: 'Andi Saputra', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-1_CPcW4a7-D.png', status: 'Ngopi dulu...', online: true, role: 'business', membership_id: 2 },
      { id: '65a40f57-c574-438d-a21b-cd8472d3c769', name: 'Budi Santoso', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-2_m-OUtW6n1.png', status: 'Kerja keras, tidur nyenyak', online: false, role: 'regular', membership_id: 1 },
      { id: '969f5a5e-5ff0-406e-9650-821aa22bc886', name: 'Citra Dewi', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-3_xR-f-4_Yy.png', status: 'Lagi liburan', online: true, role: 'regular', membership_id: 1 },
      { id: 'd90de2e2-ea68-43e2-a0aa-92ab4a7b414b', name: 'Dina Pratiwi', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-4_vQW-j-b_t.png', status: 'Belajar coding', online: false, role: 'regular', membership_id: 1 },
      { id: '36190390-d9fc-45ba-862d-155811dbd129', name: 'Eko Prabowo', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-5_b_g-2-g_a.png', status: 'Selalu semangat!', online: true, role: 'business', membership_id: 2 },
    ],
    memberships: [
        { id: 1, name: 'Basic' /* ...other fields */ },
        { id: 2, name: 'Bisnis' /* ...other fields */ },
    ]
}

export async function getUserById(userId: string): Promise<User | undefined> {
    // In a real DB: SELECT * FROM users WHERE id = $1;
    return mockData.users.find(u => u.id === userId);
}

export async function getChatsForUser(userId: string): Promise<Chat[]> {
    // In a real DB: SELECT * FROM chats JOIN chat_participants ON ... WHERE user_id = $1
    // This is a simplified mock implementation.
    return dataStore.chats.filter(c => c.participants.some(p => p.id === userId));
}

// ... other database-interacting functions would go here ...

// The existing dataStore will be used as a temporary mock database.
export const dataStore = new DataStore();
// To ensure components don't break during refactor, we re-populate the mock store.
dataStore.users = mockData.users;
dataStore.chats = [
      {
        id: 'chat-1',
        type: 'private',
        participants: [mockData.users[0], mockData.users[1]],
        messages: [
          { id: 'msg-1-1', senderId: mockData.users[1].id, body: 'Halo, apa kabar?', timestamp: subMinutes(new Date(), 5), type: 'text', read: true, delivered: true },
          { id: 'msg-1-2', senderId: mockData.users[0].id, body: 'Baik! Lagi sibuk sama aplikasi chat baru nih. Menurutmu gimana?', timestamp: subMinutes(new Date(), 4), type: 'text', read: true, delivered: true },
          { id: 'msg-1-3', senderId: mockData.users[1].id, body: 'Keren banget! Tampilannya bersih dan modern.', timestamp: subMinutes(new Date(), 3), type: 'text', read: false, delivered: true },
        ],
        products: [],
      },
      {
        id: 'chat-2',
        type: 'private',
        participants: [mockData.users[0], mockData.users[2]],
        messages: [
          { id: 'msg-2-1', senderId: mockData.users[2].id, body: 'Bisa kirim filenya?', timestamp: subHours(new Date(), 1), type: 'text', read: true, delivered: true },
          { id: 'msg-2-2', senderId: mockData.users[0].id, body: 'Tentu, ini filenya.', timestamp: subHours(new Date(), 1), type: 'file', meta: { fileName: 'rencana-proyek.pdf', fileUrl: '#' }, read: true, delivered: true },
        ],
        products: [],
      },
       {
        id: 'store-1',
        type: 'group',
        name: 'Toko A',
        avatar: '/image/tokoA.jpeg',
        participants: mockData.users,
        messages: [
          { id: 'msg-s1-1', senderId: mockData.users[3].id, body: 'Selamat datang di Toko A!', timestamp: subHours(new Date(), 2), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-s1-1', chatId: 'store-1', sellerId: mockData.users[0].id, name: 'Kaos Polos Putih', description: 'Kaos katun berkualitas tinggi, nyaman dipakai sehari-hari.', price: 75000, imageUrl: '/image/kaosputih.jpeg' },
            { id: 'prod-s1-2', chatId: 'store-1', sellerId: mockData.users[0].id, name: 'Jaket Bomber Hitam', description: 'Jaket bomber stylish untuk segala cuaca.', price: 250000, imageUrl: 'https://via.placeholder.com/400?text=Jaket+Bomber+Hitam' },
        ]
      },
      {
        id: 'store-2',
        type: 'group',
        name: 'Toko B',
        avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/other/store-gadgets.png',
        participants: mockData.users,
        messages: [
          { id: 'msg-s2-1', senderId: mockData.users[4].id, body: 'Selamat datang di Toko B!', timestamp: subHours(new Date(), 3), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-s2-1', chatId: 'store-2', sellerId: mockData.users[4].id, name: 'Headphone Over-Ear', description: 'Kualitas suara jernih dengan bass mendalam.', price: 350000, imageUrl: '/image/headset.png' },
            { id: 'prod-s2-2', chatId: 'store-2', sellerId: mockData.users[4].id, name: 'Charger USB-C 65W', description: 'Pengisian daya super cepat untuk semua perangkat Anda.', price: 120000, imageUrl: 'https://via.placeholder.com/400?text=Charger+USB-C' },
        ]
      }
];
dataStore.stories = [
    { id: 'story-1', userId: mockData.users[1].id, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/stories/story-1_H3O0gQ-sE.png', timestamp: subHours(new Date(), 2), viewed: false },
    { id: 'story-2', userId: mockData.users[2].id, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/stories/story-2_g5b9Qn-sE.png', timestamp: subHours(new Date(), 5), viewed: false },
];
dataStore.presentations = [
    { id: 'pres-1', userId: mockData.users[0].id, file_name: 'Q3-roadmap.pptx', file_url: '#', uploaded_at: subDays(new Date(), 1).toISOString() },
    { id: 'pres-2', userId: mockData.users[4].id, file_name: 'analisis-kompetitor.pptx', file_url: '#', uploaded_at: subDays(new Date(), 3).toISOString() }
];

// Set initial current user for components that rely on it.
dataStore.currentUser = mockData.users[0];

    