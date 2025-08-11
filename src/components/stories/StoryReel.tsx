
"use client";

import { dataStore } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Story } from "@/lib/types";
import { useRouter } from "next/navigation";

export function StoryReel() {
  const { stories, users } = dataStore;
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const router = useRouter();

  const handleOpenStory = (story: Story) => {
    setViewingStory(story);
  };

  const handleCloseStory = () => {
    setViewingStory(null);
  };
  
  const handleAddStoryClick = () => {
      router.push('/profile');
  }

  return (
    <div>
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 -mb-2">
        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
          <button className="w-16 h-16 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors" onClick={handleAddStoryClick}>
            <Plus className="w-6 h-6 text-muted-foreground" />
          </button>
          <span className="text-xs w-16 truncate text-center">Your Story</span>
        </div>
        {stories.map((story) => {
          const user = users.find(u => u.id === story.userId);
          if(!user) return null;
          return (
            <div
              key={story.id}
              className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer"
              onClick={() => handleOpenStory(story)}
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 flex items-center justify-center
                ${story.viewed ? 'bg-muted' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'}`
                }
              >
                <Avatar className="w-full h-full border-2 border-card">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs w-16 truncate text-center">{user.name}</span>
            </div>
          )
        })}
      </div>

      <Dialog open={!!viewingStory} onOpenChange={(open) => { if (!open) handleCloseStory()}}>
        <DialogContent className="p-0 max-w-md w-full h-full md:h-[90vh] md:max-h-[800px] border-0 gap-0 flex flex-col">
          {viewingStory && (() => {
            const user = users.find(u => u.id === viewingStory.userId);
            if (!user) return null;
            return (
              <>
                <DialogHeader className="p-4 flex flex-row items-center space-x-2 absolute top-0 left-0 bg-gradient-to-b from-black/50 to-transparent w-full z-10 text-white">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-sm font-semibold text-white">{user.name}</DialogTitle>
                </DialogHeader>
                <Image 
                    src={viewingStory.imageUrl} 
                    alt={`Story by ${user.name}`} 
                    fill
                    objectFit="cover"
                    className="rounded-none md:rounded-2xl"
                    data-ai-hint="story social media"
                />
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
