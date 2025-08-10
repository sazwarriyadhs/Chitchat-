
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Video from 'twilio-video';
import { AppContainer } from '@/components/AppContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!roomName || !currentUser.name) return;

    const connectToRoom = async () => {
      try {
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

        const connectedRoom = await Video.connect(token, {
            name: roomName,
            tracks: localTracks,
        });
        
        setRoom(connectedRoom);
        setConnecting(false);

        const localVideoTrack = localTracks.find(track => track.kind === 'video') as Video.LocalVideoTrack;
        if (localVideoTrack && localVideoRef.current) {
            localVideoTrack.attach(localVideoRef.current);
        }

        connectedRoom.participants.forEach(participant => {
            participant.on('trackSubscribed', track => {
                if (track.kind === 'video' && remoteVideoRef.current) {
                    remoteVideoRef.current.innerHTML = '';
                    track.attach(remoteVideoRef.current);
                }
                 if (track.kind === 'audio') {
                    track.attach();
                }
            });
        });

        connectedRoom.on('participantConnected', participant => {
            participant.on('trackSubscribed', track => {
                if (track.kind === 'video' && remoteVideoRef.current) {
                    remoteVideoRef.current.innerHTML = '';
                    track.attach(remoteVideoRef.current);
                }
                 if (track.kind === 'audio') {
                    track.attach();
                }
            });
        });

        connectedRoom.on('participantDisconnected', (participant) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.innerHTML = '';
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
            room.disconnect();
        }
    };
  }, [roomName, currentUser.name, isVideoCall, toast]);
  
  const toggleTrack = (kind: 'video' | 'audio', enabled: boolean) => {
      if (!room) return;
      const trackPublication = room.localParticipant.tracks.forEach(pub => {
          if (pub.kind === kind) {
              if (enabled) {
                  pub.track.enable();
              } else {
                  pub.track.disable();
              }
          }
      });
  };

  const handleToggleMic = () => {
    const newMicState = !isMicOn;
    setIsMicOn(newMicState);
    toggleTrack('audio', newMicState);
  };
  
  const handleToggleCamera = () => {
    const newCameraState = !isCameraOn;
    setIsCameraOn(newCameraState);
    toggleTrack('video', newCameraState);
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
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center" ref={remoteVideoRef}>
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
            <h2 className="text-2xl font-bold">{room?.participants.size > 0 ? otherUser.name : 'Group Call'}</h2>
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
