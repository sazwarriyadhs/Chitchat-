
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
      { id: 'ec4241f4-1cc2-462e-81d7-7725b31a1a1f', name: 'Andi Saputra', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-1_CPcW4a7-D.png', status: 'Ngopi dulu...', online: true, role: 'business' },
      { id: '65a40f57-c574-438d-a21b-cd8472d3c769', name: 'Budi Santoso', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-2_m-OUtW6n1.png', status: 'Kerja keras, tidur nyenyak', online: false, role: 'regular' },
      { id: '969f5a5e-5ff0-406e-9650-821aa22bc886', name: 'Citra Dewi', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-3_xR-f-4_Yy.png', status: 'Lagi liburan', online: true, role: 'regular' },
      { id: 'd90de2e2-ea68-43e2-a0aa-92ab4a7b414b', name: 'Dina Pratiwi', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-4_vQW-j-b_t.png', status: 'Belajar coding', online: false, role: 'regular' },
      { id: '36190390-d9fc-45ba-862d-155811dbd129', name: 'Eko Prabowo', avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/avatars/user-5_b_g-2-g_a.png', status: 'Selalu semangat!', online: true, role: 'business' },
    ];
    this.currentUser = this.users[0];

    this.chats = [
      {
        id: 'chat-1',
        type: 'private',
        participants: [this.users[0], this.users[1]],
        messages: [
          { id: 'msg-1-1', senderId: this.users[1].id, body: 'Halo, apa kabar?', timestamp: subMinutes(new Date(), 5), type: 'text', read: true, delivered: true },
          { id: 'msg-1-2', senderId: this.users[0].id, body: 'Baik! Lagi sibuk sama aplikasi chat baru nih. Menurutmu gimana?', timestamp: subMinutes(new Date(), 4), type: 'text', read: true, delivered: true },
          { id: 'msg-1-3', senderId: this.users[1].id, body: 'Keren banget! Tampilannya bersih dan modern.', timestamp: subMinutes(new Date(), 3), type: 'text', read: false, delivered: true },
        ],
        products: [],
      },
      {
        id: 'chat-2',
        type: 'private',
        participants: [this.users[0], this.users[2]],
        messages: [
          { id: 'msg-2-1', senderId: this.users[2].id, body: 'Bisa kirim filenya?', timestamp: subHours(new Date(), 1), type: 'text', read: true, delivered: true },
          { id: 'msg-2-2', senderId: this.users[0].id, body: 'Tentu, ini filenya.', timestamp: subHours(new Date(), 1), type: 'file', meta: { fileName: 'rencana-proyek.pdf', fileUrl: '#' }, read: true, delivered: true },
        ],
        products: [],
      },
      {
        id: 'store-1',
        type: 'group',
        name: 'Kopi Kenangan Senja',
        avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/store-logos/store-1_Yd1mAsVl9.png',
        participants: [this.users[0], this.users[1], this.users[3], this.users[2], this.users[4]],
        messages: [
          { id: 'msg-s1-1', senderId: this.users[3].id, body: 'Selamat datang di Kopi Kenangan Senja!', timestamp: subHours(new Date(), 2), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-s1-1', chatId: 'store-1', sellerId: this.users[0].id, name: 'Es Kopi Susu Gula Aren', description: 'Perpaduan kopi, susu, dan gula aren yang pas.', price: 18000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-1_FayVmG6iG.png' },
            { id: 'prod-s1-2', chatId: 'store-1', sellerId: this.users[0].id, name: 'Americano', description: 'Kopi hitam klasik untuk penikmat sejati.', price: 15000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-2_yBqL7mEaD.png' },
            { id: 'prod-s1-3', chatId: 'store-1', sellerId: this.users[0].id, name: 'Croissant Cokelat', description: 'Pastry renyah dengan isian cokelat lumer.', price: 22000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-3_XBnJzVvj-.png' },
            { id: 'prod-s1-4', chatId: 'store-1', sellerId: this.users[0].id, name: 'Teh Melati', description: 'Teh melati hangat yang menenangkan.', price: 12000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-4_P2K4iXU5U.png' },
            { id: 'prod-s1-5', chatId: 'store-1', sellerId: this.users[0].id, name: 'Paket Bundling Kopi + Roti', description: 'Pilih kopi dan roti favoritmu dengan harga lebih hemat.', price: 35000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-5_G3FmI7C0y.png' },
        ]
      },
      {
        id: 'store-2',
        type: 'group',
        name: 'Toko Buku Aksara',
        avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/store-logos/store-2_6WqpB3B2S.png',
        participants: [this.users[0], this.users[1], this.users[3], this.users[2], this.users[4]],
        messages: [
           { id: 'msg-s2-1', senderId: this.users[2].id, body: 'Cari buku apa hari ini?', timestamp: subHours(new Date(), 3), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-s2-1', chatId: 'store-2', sellerId: this.users[4].id, name: 'Novel "Bumi Manusia"', description: 'Karya sastra legendaris oleh Pramoedya Ananta Toer.', price: 95000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-6_y6k4fzvDB.png' },
            { id: 'prod-s2-2', chatId: 'store-2', sellerId: this.users[4].id, name: 'Buku Komik "One Piece Vol. 100"', description: 'Edisi terbaru petualangan Luffy dan kawan-kawan.', price: 45000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-7_vJ3c9yD2E.png' },
            { id: 'prod-s2-3', chatId: 'store-2', sellerId: this.users[4].id, name: 'Notebook Kulit', description: 'Buku catatan elegan dengan sampul kulit.', price: 120000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-8_BwH2zX80G.png' },
            { id: 'prod-s2-4', chatId: 'store-2', sellerId: this.users[4].id, name: 'Kamus Inggris-Indonesia', description: 'Kamus lengkap untuk pelajar dan umum.', price: 150000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-9_nJqK5vU-g.png' },
            { id: 'prod-s2-5', chatId: 'store-2', sellerId: this.users[4].id, name: 'Pembatas Buku Magnetik', description: 'Penanda buku lucu dengan magnet.', price: 25000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-10_lGv3qX57k.png' },
        ]
      },
       {
        id: 'store-3',
        type: 'group',
        name: 'Fashionista Preloved',
        avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/store-logos/store-3_Bf-pM-b8T.png',
        participants: [this.users[0], this.users[1], this.users[3], this.users[2], this.users[4]],
        messages: [
          { id: 'msg-s3-1', senderId: this.users[3].id, body: 'Happy thrifting!', timestamp: subHours(new Date(), 5), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-s3-1', chatId: 'store-3', sellerId: this.users[0].id, name: 'Jaket Denim Vintage', description: 'Jaket denim gaya 90-an, kondisi 9/10.', price: 250000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-11_Jz-N9Fw2y.png' },
            { id: 'prod-s3-2', chatId: 'store-3', sellerId: this.users[0].id, name: 'Kemeja Flanel Uniqlo', description: 'Kemeja flanel kotak-kotak, ukuran M.', price: 150000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-12_m4rK9w-0D.png' },
            { id: 'prod-s3-3', chatId: 'store-3', sellerId: this.users[0].id, name: 'Tas Tangan Kulit Asli', description: 'Tas kulit asli, brand lokal.', price: 400000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-13_cE-9V-v2y.png' },
            { id: 'prod-s3-4', chatId: 'store-3', sellerId: this.users[0].id, name: 'Sneakers Converse All Star', description: 'Ukuran 42, jarang dipakai.', price: 350000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-14_Jv-1c-w-2.png' },
            { id: 'prod-s3-5', chatId: 'store-3', sellerId: this.users[0].id, name: 'Gaun Musim Panas', description: 'Gaun bunga-bunga, cocok untuk liburan.', price: 180000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-15_V-9c-2-v2.png' },
        ]
      },
      {
        id: 'store-4',
        type: 'group',
        name: 'Gamer\'s Garage Sale',
        avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/store-logos/store-4_Jv-1c-w-2.png',
        participants: [this.users[0], this.users[1], this.users[3], this.users[2], this.users[4]],
        messages: [
           { id: 'msg-s4-1', senderId: this.users[1].id, body: 'Jual-beli santai, no tipu-tipu.', timestamp: subHours(new Date(), 6), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-s4-1', chatId: 'store-4', sellerId: this.users[4].id, name: 'Kaset PS5 "God of War"', description: 'Kondisi mulus, seperti baru.', price: 550000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-16_V-9c-2-v2.png' },
            { id: 'prod-s4-2', chatId: 'store-4', sellerId: this.users[4].id, name: 'Keyboard Mechanical Rexus', description: 'Blue switch, RGB. Lengkap dengan box.', price: 450000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-17_Jv-1c-w-2.png' },
            { id: 'prod-s4-3', chatId: 'store-4', sellerId: this.users[0].id, name: 'Mouse Gaming Logitech G102', description: 'Mouse gaming sejuta umat, masih oke.', price: 150000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-18_cE-9V-v2y.png' },
            { id: 'prod-s4-4', chatId: 'store-4', sellerId: this.users[4].id, name: 'Headset Gaming Steelseries', description: 'Suara jernih, mic berfungsi normal.', price: 600000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-19_m4rK9w-0D.png' },
            { id: 'prod-s4-5', chatId: 'store-4', sellerId: this.users[0].id, name: 'Voucher Steam Wallet', description: 'Voucher Steam 100.000 IDR.', price: 98000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-20_Jz-N9Fw2y.png' },
        ]
      },
      {
        id: 'store-5',
        type: 'group',
        name: 'Dapur Bunda Homemade',
        avatar: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/store-logos/store-5_V-9c-2-v2.png',
        participants: [this.users[0], this.users[1], this.users[3], this.users[2], this.users[4]],
        messages: [
           { id: 'msg-s5-1', senderId: this.users[3].id, body: 'Open PO untuk kue lebaran!', timestamp: subHours(new Date(), 10), type: 'text', read: true, delivered: true },
        ],
        products: [
            { id: 'prod-s5-1', chatId: 'store-5', sellerId: this.users[0].id, name: 'Nastar Premium', description: 'Nastar dengan isian nanas asli dan mentega Wijsman.', price: 150000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-21_lGv3qX57k.png' },
            { id: 'prod-s5-2', chatId: 'store-5', sellerId: this.users[0].id, name: 'Kastengel Keju Edam', description: 'Kue keju renyah dengan keju Edam asli.', price: 160000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-22_nJqK5vU-g.png' },
            { id: 'prod-s5-3', chatId: 'store-5', sellerId: this.users[0].id, name: 'Putri Salju', description: 'Kue manis dengan taburan gula halus.', price: 130000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-23_BwH2zX80G.png' },
            { id: 'prod-s5-4', chatId: 'store-5', sellerId: this.users[0].id, name: 'Sambal Bawang Botolan', description: 'Sambal bawang pedas, dijamin nagih!', price: 35000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-24_vJ3c9yD2E.png' },
            { id: 'prod-s5-5', chatId: 'store-5', sellerId: this.users[0].id, name: 'Rendang Daging Sapi', description: 'Rendang siap saji (250gr).', price: 85000, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/products/prod-25_y6k4fzvDB.png' },
        ]
      },
    ];

    this.stories = [
        { id: 'story-1', userId: this.users[1].id, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/stories/story-1_H3O0gQ-sE.png', timestamp: subHours(new Date(), 2), viewed: false },
        { id: 'story-2', userId: this.users[2].id, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/stories/story-2_g5b9Qn-sE.png', timestamp: subHours(new Date(), 5), viewed: false },
        { id: 'story-3', userId: this.users[3].id, imageUrl: 'https://ik.imagekit.io/y3w0fa1s9/UpWork/chattie/stories/story-3_g5b9Qn-sE.png', timestamp: subHours(new Date(), 8), viewed: true },
    ];
    
    this.presentations = [
        { id: 'pres-1', userId: this.users[0].id, file_name: 'Q3-roadmap.pptx', file_url: '#', uploaded_at: subDays(new Date(), 1).toISOString() },
        { id: 'pres-2', userId: this.users[4].id, file_name: 'analisis-kompetitor.pptx', file_url: '#', uploaded_at: subDays(new Date(), 3).toISOString() }
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
    this.createUser = this.createUser.bind(this);
    this.getStores = this.getStores.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
  }

  setCurrentUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
        this.currentUser = user;
    }
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

  getStores(): Chat[] {
    // A store is a group chat that has a products array defined.
    return this.chats.filter(chat => chat.type === 'group' && chat.products).sort((a, b) => a.id.localeCompare(b.id));
  }

  createUser(userData: Omit<User, 'id' | 'avatar' | 'online' | 'status'> & { password?: string }): User {
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

// Singleton instance of the data store
export const dataStore = new DataStore();

    