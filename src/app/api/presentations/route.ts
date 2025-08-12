import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';
import { Message } from '@/lib/types';

// Mock in-memory store for presentations
let mockPresentations: Omit<Message, 'id' | 'timestamp' | 'senderId' | 'read' | 'delivered'>[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const senderId = searchParams.get('senderId');

  if (!senderId) {
    return NextResponse.json({ error: 'senderId is required' }, { status: 400 });
  }

  // Find presentations from mock data (or chats)
  const userChats = dataStore.chats.filter(c => c.participants.some(p => p.id === senderId));
  const presentationMessages: any[] = [];
  userChats.forEach(c => {
    c.messages.forEach(m => {
      if (m.type === 'presentation') {
        presentationMessages.push({
            id: m.id,
            file_name: m.meta?.fileName || 'presentation.pptx',
            file_url: '#', // Mock URL
            uploaded_at: m.timestamp.toISOString(),
        })
      }
    })
  });
  
  // Add any from our mock in-memory store
  const allPresentations = [...presentationMessages, ...mockPresentations.map((p, i) => ({...p, id: `mock-${i}`, file_name: p.meta?.fileName, uploaded_at: new Date().toISOString()}))];
  
  // Sort by date
  allPresentations.sort((a,b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());

  return NextResponse.json(allPresentations);
}

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('senderId');
    
    if (!senderId) {
      return NextResponse.json({ error: 'senderId is required' }, { status: 400 });
    }
  
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File is required.' }, { status: 400 });
        }

        const newPresentation = {
            id: `msg-${Date.now()}`,
            senderId: senderId,
            body: `Shared ${file.name}`,
            timestamp: new Date(),
            type: 'presentation' as const,
            meta: { fileName: file.name },
        };
        
        mockPresentations.unshift(newPresentation);
        
        return NextResponse.json({
            id: newPresentation.id,
            file_name: newPresentation.meta.fileName,
            file_url: '#', // Mock URL
            uploaded_at: newPresentation.timestamp.toISOString(),
        });

    } catch (error: any) {
        console.error('Mock upload failed:', error);
        return NextResponse.json({ error: 'Failed to process mock upload.', details: error.message }, { status: 500 });
    }
}
