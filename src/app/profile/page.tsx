
"use client";

import { useState, useEffect, useRef } from 'react';
import { AppContainer } from '@/components/AppContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, FileUp, Loader2, Share2, Presentation as PresentationIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/data';

// Mock current user ID until auth is implemented
const currentUserId = users[0].id; 

type Presentation = {
  id: number;
  file_name: string;
  file_url: string;
  uploaded_at: string;
};

export default function ProfilePage() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUserId) return;
    setFetching(true);
    fetch(`/api/presentations?senderId=${currentUserId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch presentations');
        return res.json();
      })
      .then(data => {
        setPresentations(data);
      })
      .catch(error => {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch your presentations.",
        });
      })
      .finally(() => setFetching(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please choose a presentation file to upload.',
    });

    setLoading(true);
    const formData = new FormData();
    formData.append('presentation', file);
    formData.append('senderId', currentUserId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setPresentations(prev => [data.presentation, ...prev]);
        setFile(null); // Reset file state
        if(fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
        toast({
            title: 'Upload Successful',
            description: `"${data.presentation.file_name}" has been uploaded.`,
        });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: error.message || 'An unknown error occurred.',
        });
    } finally {
        setLoading(false);
    }
  };

  const handleShareToChat = (presentation: Presentation) => {
    // In a real app, this would trigger a socket event or update chat state
    toast({
        title: "Shared to Chat",
        description: `Your presentation "${presentation.file_name}" is ready to be sent.`
    });
  };

  return (
    <AppContainer>
        <header className="flex items-center p-2 border-b gap-2 sticky top-0 bg-card z-10">
            <Link href="/home" passHref>
                <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
                </Button>
            </Link>
            <h1 className="text-xl font-bold font-headline">My Presentations</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Upload New Presentation</CardTitle>
                <CardDescription>Upload a .ppt, .pptx, or .pdf file to share.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Input id="presentation-upload" type="file" accept=".ppt,.pptx,.pdf" onChange={handleFileChange} className="flex-1" ref={fileInputRef}/>
                        <Button onClick={handleUpload} disabled={loading || !file} className="w-full sm:w-auto">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                            {loading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>My Uploaded Files</CardTitle>
                    <CardDescription>Here are the presentations you've uploaded.</CardDescription>
                </CardHeader>
                <CardContent>
                    {fetching ? (
                         <div className="text-center text-muted-foreground">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                            <p>Loading presentations...</p>
                         </div>
                    ) : presentations.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            <PresentationIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4">You haven't uploaded any presentations yet.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                        {presentations.map((p) => (
                            <li key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <a href={p.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate hover:underline">
                                    {p.file_name}
                                </a>
                                <Button size="sm" variant="ghost" onClick={() => handleShareToChat(p)}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </Button>
                            </li>
                        ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </main>
    </AppContainer>
  );
}
