
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AppContainer } from '@/components/AppContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Camera, Edit, FileUp, Loader2, LogOut, Plus, Presentation as PresentationIcon, Share2, User, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dataStore } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { Presentation } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { currentUser, updateUser, addStory, addPresentation, getPresentationsByUserId } = dataStore;
  const currentUserId = currentUser.id;
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [status, setStatus] = useState(currentUser.status || '');
  const [profileImage, setProfileImage] = useState(currentUser.avatar);
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const storyImageInputRef = useRef<HTMLInputElement>(null);
  const [storyImage, setStoryImage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser.role !== 'business') {
        setFetching(false);
        return;
    };
    const fetchPresentations = async () => {
        setFetching(true);
        setError(null);
        try {
            // Using the mock data store directly
            const data = getPresentationsByUserId(currentUserId);
            setPresentations(data);
        } catch (error: any) {
            console.error("Could not load presentations:", error);
            setError("Could not load your presentations. Please try again later.");
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load your presentations.",
            });
        } finally {
            setFetching(false);
        }
    };
    fetchPresentations();
  }, [currentUserId, getPresentationsByUserId, toast, currentUser.role]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setProfileImage(event.target?.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleStoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setStoryImage(event.target?.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    updateUser(currentUser.id, {
        name,
        status,
        avatar: profileImage
    });
    toast({ title: "Profile Saved", description: "Your changes have been saved."});
    setIsEditing(false);
  };
  
  const handleAddToStory = () => {
    if (!storyImage) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please choose a photo for your story.',
      });
      return;
    }

    addStory(currentUser.id, storyImage);

    toast({
      title: 'Story Added!',
      description: 'Your new story is now visible to your friends.',
    });
    
    setStoryImage(null);
    if(storyImageInputRef.current) {
        storyImageInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please choose a presentation file to upload.',
    });

    setLoading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const newPresentation = addPresentation(currentUser.id, file.name);
        
        setPresentations(prev => [newPresentation, ...prev]);
        setFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        toast({
            title: 'Upload Successful',
            description: `"${newPresentation.file_name}" has been added.`,
        });

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
    // This part would require more complex state management (e.g. Redux or Zustand)
    // or passing state through router, which is complex for this demo.
    // For now, we just show a toast.
    toast({
        title: "Share feature not fully implemented",
        description: `This would open a chat to share "${presentation.file_name}".`
    });
  };

  const handleLogout = () => {
    router.push('/');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  return (
    <AppContainer>
        <header className="flex items-center p-2 border-b gap-2 sticky top-0 bg-card z-10">
            <Link href="/home" passHref>
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            </Link>
            <h1 className="text-xl font-bold font-headline">My Profile</h1>
            <div className="flex-grow" />
            {isEditing ? (
                <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </>
            ) : (
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4" />
                </Button>
            )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <Avatar className="w-28 h-28 border-4 border-background ring-2 ring-primary">
                        <AvatarImage src={profileImage} alt={name} />
                        <AvatarFallback><User className="w-12 h-12" /></AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <>
                            <input type="file" accept="image/*" ref={profileImageInputRef} onChange={handleProfileImageChange} className="hidden" />
                            <Button size="icon" className="absolute bottom-1 right-1 rounded-full" onClick={() => profileImageInputRef.current?.click()}>
                                <Camera className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
                <div className="text-center">
                    {isEditing ? (
                        <Input className="text-2xl font-bold text-center" value={name} onChange={(e) => setName(e.target.value)} />
                    ) : (
                        <h2 className="text-2xl font-bold">{name}</h2>
                    )}
                    {isEditing ? (
                         <Input className="text-sm text-muted-foreground mt-1 text-center" placeholder="Your status" value={status} onChange={(e) => setStatus(e.target.value)} />
                    ) : (
                        <p className="text-sm text-muted-foreground mt-1">{status || 'No status'}</p>
                    )}
                </div>
            </div>

            <Tabs defaultValue="story" className="w-full">
                <TabsList className={cn("grid w-full", currentUser.role === 'business' ? 'grid-cols-2' : 'grid-cols-1')}>
                    <TabsTrigger value="story">My Story</TabsTrigger>
                    {currentUser.role === 'business' && <TabsTrigger value="presentations">Presentations</TabsTrigger>}
                </TabsList>
                <TabsContent value="story">
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Your Story</CardTitle>
                             <CardDescription>Share a photo with your friends.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <input type="file" accept="image/*" ref={storyImageInputRef} onChange={handleStoryImageChange} className="hidden" />
                            <div className="w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed" onClick={() => storyImageInputRef.current?.click()}>
                                {storyImage ? (
                                    <Image src={storyImage} width={300} height={169} alt="Story preview" className="rounded-md object-cover w-full h-full" data-ai-hint="story preview"/>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Camera className="w-12 h-12" />
                                        <p>Click to upload a photo</p>
                                    </div>
                                )}
                            </div>
                            <Button variant="outline" className="mt-4" onClick={handleAddToStory} disabled={!storyImage}><Plus className="w-4 h-4 mr-2" />Add to Story</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                {currentUser.role === 'business' && 
                    <TabsContent value="presentations">
                        <Card>
                            <CardHeader>
                            <CardTitle>New Presentation</CardTitle>
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

                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>My Uploaded Files</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {fetching ? (
                                    <div className="text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /><p>Loading...</p></div>
                                ) : error ? (
                                    <Alert variant="destructive">
                                        <XCircle className="h-4 w-4" />
                                        <AlertTitle>Loading Error</AlertTitle>
                                        <AlertDescription>
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                ) : presentations.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        <PresentationIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-4">You have no presentations.</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                    {presentations.map((p) => (
                                        <li key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <div className="flex items-center gap-3 flex-1 truncate">
                                                <PresentationIcon className="w-5 h-5 text-muted-foreground" />
                                                <a href={p.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate hover:underline">
                                                    {p.file_name}
                                                </a>
                                            </div>
                                            <Button size="sm" variant="ghost" onClick={() => handleShareToChat(p)}>
                                                <Share2 className="mr-2 h-4 w-4" /> Share
                                            </Button>
                                        </li>
                                    ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                }
            </Tabs>
        </main>
        <footer className="p-4 border-t bg-card">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
            </Button>
        </footer>
    </AppContainer>
  );
}
