import { User, Chat, Story } from './types';
import { subHours, subMinutes, subDays } from 'date-fns';

export const users: User[] = [
  { id: 'user-1', name: 'You', avatar: 'https://placehold.co/100x100.png', status: 'On a mission! 🚀', online: true },
  { id: 'user-2', name: 'Alice', avatar: 'https://placehold.co/100x100.png', status: 'Coffee first.', online: true },
  { id: 'user-3', name: 'Bob', avatar: 'https://placehold.co/100x100.png', status: 'Coding away...', online: false },
  { id: 'user-4', name: 'Charlie', avatar: 'https://placehold.co/100x100.png', online: true },
  { id: 'user-5', name: 'Diana', avatar: 'https://placehold.co/100x100.png', online: false },
];

export const chats: Chat[] = [
  {
    id: 'chat-1',
    type: 'private',
    participants: [users[0], users[1]],
    messages: [
      { id: 'msg-1-1', senderId: 'user-2', text: 'Hey, how is it going?', timestamp: subMinutes(new Date(), 5), type: 'text' },
      { id: 'msg-1-2', senderId: 'user-1', text: 'Pretty good! Just working on the new chat app. What do you think?', timestamp: subMinutes(new Date(), 4), type: 'text' },
      { id: 'msg-1-3', senderId: 'user-2', text: 'Looks amazing! The UI is so clean.', timestamp: subMinutes(new Date(), 3), type: 'text' },
    ],
  },
  {
    id: 'chat-2',
    type: 'private',
    participants: [users[0], users[2]],
    messages: [
      { id: 'msg-2-1', senderId: 'user-2', text: 'Can you send me the file?', timestamp: subHours(new Date(), 1), type: 'text' },
      { id: 'msg-2-2', senderId: 'user-1', text: 'Sure, here it is.', timestamp: subHours(new Date(), 1), type: 'file', fileName: 'project-brief.pdf' },
    ],
  },
  {
    id: 'chat-3',
    type: 'group',
    name: 'Project Team',
    avatar: 'https://placehold.co/100x100.png',
    participants: [users[0], users[1], users[3]],
    messages: [
      { id: 'msg-3-1', senderId: 'user-4', text: 'Team, let\'s sync up at 3 PM.', timestamp: subHours(new Date(), 2), type: 'text' },
      { id: 'msg-3-2', senderId: 'user-1', text: 'Sounds good!', timestamp: subHours(new Date(), 2), type: 'text' },
      { id: 'msg-3-3', senderId: 'user-2', text: 'I\'ll be there.', timestamp: subHours(new Date(), 2), type: 'text' },
      { id: 'msg-3-4', senderId: 'user-1', text: 'I\'m sharing the presentation for the meeting.', timestamp: subMinutes(new Date(), 90), type: 'presentation', fileName: 'Q3-roadmap.pptx' },
    ],
  },
  {
    id: 'chat-4',
    type: 'private',
    participants: [users[0], users[4]],
    messages: [
      { id: 'msg-4-1', senderId: 'user-4', text: 'Where should we meet for lunch?', timestamp: subDays(new Date(), 1), type: 'text' },
      { id: 'msg-4-2', senderId: 'user-1', text: 'How about The Corner Cafe?', timestamp: subDays(new Date(), 1), type: 'location', content: 'The Corner Cafe' },
    ],
  },
];

export const stories: Story[] = [
    { id: 'story-1', user: users[1], imageUrl: 'https://placehold.co/400x700.png', timestamp: subHours(new Date(), 2), viewed: false },
    { id: 'story-2', user: users[2], imageUrl: 'https://placehold.co/400x700.png', timestamp: subHours(new Date(), 5), viewed: false },
    { id: 'story-3', user: users[3], imageUrl: 'https://placehold.co/400x700.png', timestamp: subHours(new Date(), 8), viewed: true },
];
