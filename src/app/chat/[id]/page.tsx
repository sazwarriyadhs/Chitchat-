"use client"
import { AppContainer } from '@/components/AppContainer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chats, users } from '@/lib/data';
import { Chat, Message, User } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const currentUser = users[0];

export default function ChatPage() {
    const params = useParams();
    const chatId = typeof params.id === 'string' ? params.id : '';
    const chat = chats.find(c => c.id === chatId);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    
    const [messages, setMessages] = useState(chat?.messages || []);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages]);
    
    if (!chat) {
        notFound();
    }
    
    const handleSendMessage = (newMessage: Omit<Message, 'id' | 'timestamp' | 'senderId' | 'read' | 'delivered'>) => {
        const message: Message = {
            ...newMessage,
            id: `msg-${Date.now()}`,
            timestamp: new Date(),
            senderId: currentUser.id,
            read: false,
            delivered: true, // Mock delivered status
        };
        
        const chatIndex = chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
            chats[chatIndex].messages.push(message);
        }

        setMessages(prevMessages => [...prevMessages, message]);
    };

    const getChatInfo = (chat: Chat, currentUser: User): { name: string, avatar: string, status?: string } => {
        if (chat.type === 'group') {
            return { name: chat.name!, avatar: chat.avatar!, status: `${chat.participants.length} members` };
        }
        const otherUser = chat.participants.find(p => p.id !== currentUser.id)!;
        return { name: otherUser.name, avatar: otherUser.avatar, status: otherUser.online ? 'Online' : 'Offline' };
    };

    const { name, avatar, status } = getChatInfo(chat, currentUser);

    return (
        <AppContainer>
            <ChatHeader 
                name={name} 
                avatarUrl={avatar} 
                status={status || ''} 
                chatId={chat.id}
                chatType={chat.type}
            />
            <ScrollArea className="flex-1 bg-muted/30" ref={scrollAreaRef}>
                <div className="p-4 space-y-4">
                    {messages.map(message => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            isCurrentUser={message.senderId === currentUser.id}
                        />
                    ))}
                </div>
            </ScrollArea>
            <ChatInput onSendMessage={handleSendMessage} />
        </AppContainer>
    );
}
