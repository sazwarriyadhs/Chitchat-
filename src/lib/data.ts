import { User, Chat, Story } from './types';
import { subHours, subMinutes, subDays } from 'date-fns';

export const users: User[] = [
  { id: 'ec4241f4-1cc2-462e-81d7-7725b31a1a1f', name: 'Andi Saputra', avatar: 'https://ik.imagekit.io/demo/avatar1.jpg', status: 'Ngopi dulu...', online: true },
  { id: '65a40f57-c574-438d-a21b-cd8472d3c769', name: 'Budi Santoso', avatar: 'https://ik.imagekit.io/demo/avatar2.jpg', status: 'Kerja keras, tidur nyenyak', online: false },
  { id: '969f5a5e-5ff0-406e-9650-821aa22bc886', name: 'Citra Dewi', avatar: 'https://ik.imagekit.io/demo/avatar3.jpg', status: 'Lagi liburan', online: true },
  { id: 'd90de2e2-ea68-43e2-a0aa-92ab4a7b414b', name: 'Dina Pratiwi', avatar: 'https://ik.imagekit.io/demo/avatar4.jpg', status: 'Belajar coding', online: false },
  { id: '36190390-d9fc-45ba-862d-155811dbd129', name: 'Eko Prabowo', avatar: 'https://ik.imagekit.io/demo/avatar5.jpg', status: 'Selalu semangat!', online: true },
  { id: '2cebeb6d-a4d2-46e7-9f86-54b0d803f41f', name: 'Alice Wonderland', avatar: 'https://example.com/avatar/alice.png', status: 'Exploring the world', online: true },
  { id: '1bb5b631-2db4-4e6a-a532-737497e6fb89', name: 'Bob Builder', avatar: 'https://example.com/avatar/bob.png', status: 'Can we fix it? Yes we can!', online: false },
  { id: '551ad56c-3de7-4d0d-b33c-2ae21780cc15', name: 'Charlie Brown', avatar: 'https://example.com/avatar/charlie.png', status: 'Good grief!', online: true },
];

// Let's assume the first user in the new list is the current user
const currentUser = users[0];

export const chats: Chat[] = [
  {
    id: 'chat-1',
    type: 'private',
    participants: [currentUser, users[1]],
    messages: [
      { id: 'msg-1-1', senderId: users[1].id, text: 'Hey, how is it going?', timestamp: subMinutes(new Date(), 5), type: 'text' },
      { id: 'msg-1-2', senderId: currentUser.id, text: 'Pretty good! Just working on the new chat app. What do you think?', timestamp: subMinutes(new Date(), 4), type: 'text' },
      { id: 'msg-1-3', senderId: users[1].id, text: 'Looks amazing! The UI is so clean.', timestamp: subMinutes(new Date(), 3), type: 'text' },
    ],
  },
  {
    id: 'chat-2',
    type: 'private',
    participants: [currentUser, users[2]],
    messages: [
      { id: 'msg-2-1', senderId: users[2].id, text: 'Can you send me the file?', timestamp: subHours(new Date(), 1), type: 'text' },
      { id: 'msg-2-2', senderId: currentUser.id, text: 'Sure, here it is.', timestamp: subHours(new Date(), 1), type: 'file', fileName: 'project-brief.pdf' },
    ],
  },
  {
    id: 'chat-3',
    type: 'group',
    name: 'Project Team',
    avatar: 'https://placehold.co/100x100.png',
    participants: [currentUser, users[1], users[3]],
    messages: [
      { id: 'msg-3-1', senderId: users[3].id, text: 'Team, let\'s sync up at 3 PM.', timestamp: subHours(new Date(), 2), type: 'text' },
      { id: 'msg-3-2', senderId: currentUser.id, text: 'Sounds good!', timestamp: subHours(new Date(), 2), type: 'text' },
      { id: 'msg-3-3', senderId: users[1].id, text: 'I\'ll be there.', timestamp: subHours(new Date(), 2), type: 'text' },
      { id: 'msg-3-4', senderId: currentUser.id, text: 'I\'m sharing the presentation for the meeting.', timestamp: subMinutes(new Date(), 90), type: 'presentation', fileName: 'Q3-roadmap.pptx' },
    ],
  },
  {
    id: 'chat-4',
    type: 'private',
    participants: [currentUser, users[4]],
    messages: [
      { id: 'msg-4-1', senderId: users[4].id, text: 'Where should we meet for lunch?', timestamp: subDays(new Date(), 1), type: 'text' },
      { id: 'msg-4-2', senderId: currentUser.id, text: 'How about The Corner Cafe?', timestamp: subDays(new Date(), 1), type: 'location', content: 'The Corner Cafe' },
    ],
  },
];

export const stories: Story[] = [
    { id: 'story-1', user: users[1], imageUrl: 'https://placehold.co/400x700.png', timestamp: subHours(new Date(), 2), viewed: false },
    { id: 'story-2', user: users[2], imageUrl: 'https://placehold.co/400x700.png', timestamp: subHours(new Date(), 5), viewed: false },
    { id: 'story-3', user: users[3], imageUrl: 'https://placehold.co/400x700.png', timestamp: subHours(new Date(), 8), viewed: true },
];