

import { User, Chat, Story, Message, Presentation, Product, ChatTheme, Order } from './types';
import { subHours, subMinutes, subDays } from 'date-fns';

// NOTE: This file is being refactored to use a database.
// The dataStore class is being kept for API compatibility with components,
// but its methods will now query the database instead of using mock data.

class DataStore {
  public users: User[];
  public chats: Chat[];
  public stories: Story[];
  public presentations: Presentation[];
  public orders: Order[];
  public currentUser: User;

  constructor() {
    // These arrays will now be populated from the database,
    // but are kept for type consistency during the transition.
    this.users = [];
    this.chats = [];
    this.stories = [];
    this.presentations = [];
    this.orders = [];
    
    // Set a default mock user. The login flow will overwrite this.
    this.currentUser = { id: '11111111-1111-1111-1111-111111111111', name: 'Tania Kusuma', avatar: '/profileuser/04_tania_kusuma.jpg', status: 'Hello there!', online: true, role: 'business' };

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
    this.updateChatBackgroundAndTheme = this.updateChatBackgroundAndTheme.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.getOrdersByUserId = this.getOrdersByUserId.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
    this.confirmOrder = this.confirmOrder.bind(this);
    this.uploadProofOfPayment = this.uploadProofOfPayment.bind(this);
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
        this.currentUser = { id: '11111111-1111-1111-1111-111111111111', name: 'Tania Kusuma', avatar: '/profileuser/04_tania_kusuma.jpg', status: 'Hello there!', online: true, role: 'business' };
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
      backgroundUrl: '/image/background/theme1.jpeg'
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

  updateChatBackgroundAndTheme(chatId: string, backgroundUrl: string, theme: ChatTheme) {
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      this.chats[chatIndex].backgroundUrl = backgroundUrl;
      this.chats[chatIndex].theme = theme;
      return this.chats[chatIndex];
    }
    return null;
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
        type: 'text', // A system-like message
        meta: {
            productId: newProduct.id,
            productName: newProduct.name,
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
    return this.chats.filter(chat => chat.type === 'group' && (chat.name?.toLowerCase().includes('toko') || (chat.products && chat.products.length > 0))).sort((a, b) => a.id.localeCompare(b.id));
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
  
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'paymentStatus' | 'shippingStatus' | 'productSnapshot' | 'sellerId' | 'shippingCost' | 'totalPrice'> & { product: Product }): Order {
    // This would be: INSERT INTO orders (...) VALUES (...);
    const seller = this.users.find(u => u.id === orderData.product.sellerId);
    if (!seller) throw new Error("Seller not found for product");

    const shippingCost = 15000; // Mock shipping cost
    const totalPrice = orderData.product.price * orderData.qty + shippingCost;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      buyerId: orderData.buyerId,
      sellerId: seller.id,
      productSnapshot: orderData.product,
      qty: orderData.qty,
      shippingCost: shippingCost,
      totalPrice: totalPrice,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending',
      shippingStatus: 'Menunggu Konfirmasi'
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  getOrdersByUserId(userId: string): Order[] {
    // This would be: SELECT * FROM orders WHERE buyer_id = $1 or seller_id = $1;
    return this.orders.filter(o => o.buyerId === userId || o.sellerId === userId)
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(orderId: string): Order | undefined {
    // This would be: SELECT * FROM orders WHERE id = $1;
    return this.orders.find(o => o.id === orderId);
  }

  confirmOrder(orderId: string): Order | undefined {
    // This would be: UPDATE orders SET shipping_status = 'Menunggu Pembayaran' WHERE id = $1;
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex].shippingStatus = 'Menunggu Pembayaran';
      return this.orders[orderIndex];
    }
    return undefined;
  }

  uploadProofOfPayment(orderId: string, proofUrl: string): Order | undefined {
    // This would be: UPDATE orders SET payment_proof_url = $1, payment_status = 'paid', shipping_status = 'Dikemas' WHERE id = $2;
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex].paymentProof = proofUrl;
      this.orders[orderIndex].paymentStatus = 'paid';
      this.orders[orderIndex].shippingStatus = 'Dikemas';
      return this.orders[orderIndex];
    }
    return undefined;
  }
}

// Since we are moving to a database, we will export functions instead of a singleton instance.
// For now, these functions will still use a mock data instance, but the API surface
// prepares for a full database integration.

const mockData = {
  users: [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Tania Kusuma', avatar: '/profileuser/04_tania_kusuma.jpg', status: 'Hello there!', online: true, role: 'business' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Melati Anggraeni', avatar: '/profileuser/05_melati_anggraeni.jpg', status: 'Available', online: false, role: 'business' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Citra Kirana', avatar: '/profileuser/closeup-young-female-professional-making-eye-contact-against-colored-background.jpg', status: 'Feeling good', online: true, role: 'business' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Dion Mahendra', avatar: '/profileuser/front-view-smiley-man-seaside.jpg', status: 'Busy', online: false, role: 'business' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Eliza Sari', avatar: '/profileuser/horizontal-portrait-smiling-happy-young-pleasant-looking-female-wears-denim-shirt-stylish-glasses-with-straight-blonde-hair-expresses-positiveness-poses.jpg', status: 'Happy', online: true, role: 'regular' },
    { id: '66666666-6666-6666-6666-666666666666', name: 'Fitria Lestari', avatar: '/profileuser/portrait-expressive-young-woman.jpg', status: 'Available', online: true, role: 'regular' },
    { id: '77777777-7777-7777-7777-777777777777', name: 'Gilang Ramadhan', avatar: '/profileuser/portrait-man-laughing.jpg', status: 'Helping others', online: false, role: 'regular' },
    { id: '88888888-8888-8888-8888-888888888888', name: 'Hana Yulita', avatar: '/profileuser/portrait-smiling-blonde-woman.jpg', status: 'Chilling', online: true, role: 'regular' },
    { id: '99999999-9999-9999-9999-999999999999', name: 'Indra Gunawan', avatar: '/profileuser/portrait-volunteer-who-organized-donations-charity.jpg', status: 'At the office', online: false, role: 'regular' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Joko Widodo', avatar: '/profileuser/portrait-white-man-isolated.jpg', status: 'Ready to go', online: true, role: 'regular' },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Kevin Sanjaya', avatar: '/profileuser/young-bearded-man-with-striped-shirt (1).jpg', status: 'On vacation', online: false, role: 'regular' },
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
        backgroundUrl: '/image/background/theme1.jpeg'
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
        backgroundUrl: '/image/background/theme2.jpeg'
      },
       {
        id: 'store-1',
        type: 'group',
        name: 'Toko Satu',
        avatar: '/image/stores/download (1).jpeg',
        participants: mockData.users,
        messages: [
          { id: 'msg-s1-1', senderId: '11111111-1111-1111-1111-111111111111', body: 'Selamat datang di Toko Satu!', timestamp: subHours(new Date(), 2), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-a', chatId: 'store-1', sellerId: '11111111-1111-1111-1111-111111111111', name: 'Produk A', description: 'Deskripsi Produk A dari Toko Satu', price: 100000, imageUrl: '/image/products/produk_a.jpg'},
            { id: 'prod-b', chatId: 'store-1', sellerId: '11111111-1111-1111-1111-111111111111', name: 'Produk B', description: 'Deskripsi Produk B dari Toko Satu', price: 150000, imageUrl: '/image/products/produk_b.jpg'},
        ],
        backgroundUrl: '/image/background/theme3.jpeg'
      },
      {
        id: 'store-2',
        type: 'group',
        name: 'Toko Dua',
        avatar: '/image/stores/download (2).jpeg',
        participants: mockData.users,
        messages: [
          { id: 'msg-s2-1', senderId: '22222222-2222-2222-2222-222222222222', body: 'Selamat datang di Toko Dua!', timestamp: subHours(new Date(), 3), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-c', chatId: 'store-2', sellerId: '22222222-2222-2222-2222-222222222222', name: 'Produk C', description: 'Deskripsi Produk C dari Toko Dua', price: 200000, imageUrl: '/image/products/produk_c.jpg'},
        ],
        backgroundUrl: '/image/background/theme4.jpeg'
      },
      {
        id: 'store-3',
        type: 'group',
        name: 'Toko Tiga',
        avatar: '/image/stores/download (3).jpeg',
        participants: mockData.users,
        messages: [
          { id: 'msg-s3-1', senderId: '33333333-3333-3333-3333-333333333333', body: 'Selamat datang di Toko Tiga!', timestamp: subHours(new Date(), 4), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-d', chatId: 'store-3', sellerId: '33333333-3333-3333-3333-333333333333', name: 'Produk D', description: 'Deskripsi Produk D dari Toko Tiga', price: 250000, imageUrl: '/image/products/produk_d.jpg'},
        ],
        backgroundUrl: '/image/background/bg_1.png'
      },
      {
        id: 'store-4',
        type: 'group',
        name: 'Toko Empat',
        avatar: '/image/stores/images (1).jpeg',
        participants: mockData.users,
        messages: [
          { id: 'msg-s4-1', senderId: '44444444-4444-4444-4444-444444444444', body: 'Selamat datang di Toko Empat!', timestamp: subHours(new Date(), 5), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-e', chatId: 'store-4', sellerId: '44444444-4444-4444-4444-444444444444', name: 'Produk E', description: 'Deskripsi Produk E dari Toko Empat', price: 300000, imageUrl: '/image/products/produk_e.jpg'},
        ],
        backgroundUrl: '/image/background/bg_2.png'
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
dataStore.currentUser = mockData.users[1];

    
