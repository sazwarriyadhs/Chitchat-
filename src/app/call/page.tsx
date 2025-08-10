
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Video from 'twilio-video';
import { AppContainer } from '@/components/AppContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, User, Loader2 } from 'lucide-react';
import { users } from '@/lib/data';

const currentUser = users[0];
const otherUser = users[1]; // Mock other user

export default function CallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const roomName = searchParams.get('id') || 'default-room';
  const isVideoCall = searchParams.get('video') === 'true';

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(isVideoCall);
  const [callDuration, setCallDuration] = useState(0);
  const [room, setRoom] = useState<Video.Room | null>(null);
  const [connecting, setConnecting] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomName || !currentUser.name) return;

    const connectToRoom = async () => {
      try {
        setConnecting(true);
        const response = await fetch(`/api/token?identity=${currentUser.name}&room=${roomName}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get token');
        }
        const { token } = await response.json();
        
        const localTracks = await Video.createLocalTracks({
            audio: true,
            video: isVideoCall ? { name: 'camera' } : false,
        });

        const localVideoTrack = localTracks.find(track => track.kind === 'video') as Video.LocalVideoTrack;
        if (localVideoTrack && localVideoRef.current) {
            localVideoTrack.attach(localVideoRef.current);
        }

        const connectedRoom = await Video.connect(token, {
            name: roomName,
            tracks: localTracks,
        });
        
        setRoom(connectedRoom);
        setConnecting(false);

        // Handle already connected participants
        connectedRoom.participants.forEach(participant => {
            participant.on('trackSubscribed', track => {
                if (remoteVideoContainerRef.current) {
                  remoteVideoContainerRef.current.innerHTML = '';
                  remoteVideoContainerRef.current.appendChild(track.attach());
                }
            });
        });

        // Handle new participants
        connectedRoom.on('participantConnected', participant => {
            participant.tracks.forEach(publication => {
                if (publication.isSubscribed) {
                    const track = publication.track;
                     if (remoteVideoContainerRef.current) {
                       remoteVideoContainerRef.current.innerHTML = '';
                       remoteVideoContainerRef.current.appendChild(track.attach());
                     }
                }
            });
            participant.on('trackSubscribed', track => {
                 if (remoteVideoContainerRef.current) {
                   remoteVideoContainerRef.current.innerHTML = '';
                   remoteVideoContainerRef.current.appendChild(track.attach());
                 }
            });
        });

        connectedRoom.on('participantDisconnected', (participant) => {
            if (remoteVideoContainerRef.current) {
                remoteVideoContainerRef.current.innerHTML = '';
                 // Show waiting message again
                const waitingDiv = document.createElement('div');
                waitingDiv.className = "text-center";
                waitingDiv.innerHTML = `
                    <div class="w-32 h-32 rounded-full bg-slate-700 mx-auto flex items-center justify-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="w-16 h-16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg></div>
                    <p class="mt-4 text-slate-400">Waiting for ${otherUser.name}...</p>
                `;
                remoteVideoContainerRef.current.appendChild(waitingDiv);
            }
        });
        
      } catch (error: any) {
        console.error('Connection error:', error);
        toast({
          variant: 'destructive',
          title: 'Connection Failed',
          description: error.message,
        });
        setConnecting(false);
      }
    };
    
    connectToRoom();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
        clearInterval(timer);
        if (room) {
            room.localParticipant.tracks.forEach(publication => {
                publication.track.stop();
            });
            room.disconnect();
        }
    };
  }, [roomName, currentUser.name, isVideoCall, toast]);
  
  const toggleTrack = (kind: 'video' | 'audio') => {
      if (!room) return;
      const track = room.localParticipant.tracks.get(kind === 'video' ? 'camera' : 'mic');
      
      const localTrack = room.localParticipant.tracks.forEach(pub => {
          if (pub.kind === kind) {
              if (pub.track.isEnabled) {
                  pub.track.disable();
              } else {
                  pub.track.enable();
              }

              if(kind === 'audio') setIsMicOn(pub.track.isEnabled);
              if(kind === 'video') setIsCameraOn(pub.track.isEnabled);
          }
      });
  };

  const handleToggleMic = () => {
    setIsMicOn(prev => !prev);
    room?.localParticipant.audioTracks.forEach(pub => {
        if(isMicOn) pub.track.disable();
        else pub.track.enable();
    })
  };
  
  const handleToggleCamera = () => {
    setIsCameraOn(prev => !prev);
    room?.localParticipant.videoTracks.forEach(pub => {
        if(isCameraOn) pub.track.disable();
        else pub.track.enable();
    })
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleEndCall = () => {
    if(room) room.disconnect();
    router.back();
  };

  return (
    <AppContainer className="bg-slate-800 text-white">
      <div className="relative w-full h-full flex flex-col items-center justify-between">
        
        {/* Remote Participant View */}
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center" ref={remoteVideoContainerRef}>
           {connecting && (
               <div className="text-center">
                   <Loader2 className="w-12 h-12 text-slate-500 animate-spin" />
                   <p className="mt-4 text-slate-400">Connecting...</p>
               </div>
           )}
           {!connecting && (
             <div className="text-center">
                <Avatar className="w-32 h-32">
                    <AvatarImage src={otherUser.avatar} />
                    <AvatarFallback><User className="w-16 h-16" /></AvatarFallback>
                </Avatar>
                <p className="mt-4 text-slate-400">Waiting for {otherUser.name}...</p>
            </div>
           )}
        </div>

        {/* Local Participant View */}
        <div className="absolute top-4 right-4 w-28 h-40 bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600">
            <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted />
            {!isCameraOn && (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-500"/>
                </div>
            )}
        </div>

        {/* Call Info */}
        <div className="mt-8 text-center z-10">
            <h2 className="text-2xl font-bold">{room?.participants.size > 0 ? otherUser.name : 'Connecting...'}</h2>
            <p className="text-sm text-slate-300">{formatDuration(callDuration)}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 p-6 bg-slate-900/50 rounded-full mb-8 z-10">
          <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30" onClick={handleToggleMic}>
            {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>
          {isVideoCall && (
            <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30" onClick={handleToggleCamera}>
                {isCameraOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
          )}
          <Button variant="destructive" size="icon" className="w-16 h-16 rounded-full" onClick={handleEndCall}>
            <PhoneOff className="w-7 h-7" />
          </Button>
        </div>
      </div>
    </AppContainer>
  );
}
