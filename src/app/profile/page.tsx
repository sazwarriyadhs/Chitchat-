
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
const currentUserId = 'user-1'; // In a real app this would come from an auth context

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
    const fetchPresentations = async () => {
        setFetching(true);
        try {
            const response = await fetch(`/api/presentations?senderId=${currentUserId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch presentations');
            }
            const data = await response.json();
            setPresentations(data);
        } catch (error: any) {
            console.error("Could not load presentations:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load your presentations. Is the database running?",
            });
        } finally {
            setFetching(false);
        }
    };
    fetchPresentations();
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
    
    // Mock upload - in a real app, this would be a multipart/form-data POST to an upload API
    await new Promise(resolve => setTimeout(resolve, 1000));
    // After a real upload, you would re-fetch the presentations list.
    
    try {
        // This part remains a mock for now.
        const newPresentation: Presentation = {
            id: Date.now(),
            file_name: file.name,
            file_url: URL.createObjectURL(file), // This URL is temporary
            uploaded_at: new Date().toISOString(),
        };
        
        // Add to the list locally to show immediate feedback
        setPresentations(prev => [newPresentation, ...prev]);

        setFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        toast({
            title: 'Upload Successful (Mock)',
            description: `"${newPresentation.file_name}" has been added to the list locally.`,
        });

    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: 'An unknown error occurred during mock upload.',
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
