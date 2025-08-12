
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Video from 'twilio-video';
import { AppContainer } from '@/components/AppContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, User, Loader2 } from 'lucide-react';
import { dataStore } from '@/lib/data';

export function CallUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const roomName = searchParams.get('id') || 'default-room';
  const isVideoCall = searchParams.get('video') === 'true';
  const { currentUser, users } = dataStore;
  const otherUser = users[1]; // Mock other user

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(isVideoCall);
  const [callDuration, setCallDuration] = useState(0);
  const [room, setRoom] = useState<Video.Room | null>(null);
  const [connecting, setConnecting] = useState(true);
  const [remoteParticipant, setRemoteParticipant] = useState<Video.RemoteParticipant | null>(null);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!roomName || !currentUser.name) return;

    const connectToRoom = async () => {
      try {
        setConnecting(true);
        const response = await fetch(`/api/token?identity=${currentUser.name}&room=${roomName}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal mendapatkan token');
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

        const handleTrack = (track: Video.RemoteTrack) => {
            if (track.kind === 'video' && remoteVideoRef.current) {
                track.attach(remoteVideoRef.current);
                setIsRemoteVideoOn(true);
            }
            if (track.kind === 'audio' && remoteAudioRef.current) {
                track.attach(remoteAudioRef.current);
            }
        };
        
        const handleParticipant = (participant: Video.RemoteParticipant) => {
             setRemoteParticipant(participant);
             participant.tracks.forEach(publication => {
                if (publication.track) handleTrack(publication.track);
                publication.on('subscribed', handleTrack);
             });
             participant.on('trackSubscribed', handleTrack);

             participant.on('trackUnsubscribed', (track) => {
                if(track.kind === 'video') setIsRemoteVideoOn(false);
             });
        }

        connectedRoom.participants.forEach(handleParticipant);
        connectedRoom.on('participantConnected', handleParticipant);

        connectedRoom.on('participantDisconnected', () => {
            setRemoteParticipant(null);
        });
        
      } catch (error: any) {
        console.error('Connection error:', error);
        toast({
          variant: 'destructive',
          title: 'Koneksi Gagal',
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
  
  const handleToggleMic = () => {
    room?.localParticipant.audioTracks.forEach(pub => {
        if(isMicOn) pub.track.disable();
        else pub.track.enable();
    });
    setIsMicOn(prev => !prev);
  };
  
  const handleToggleCamera = () => {
    room?.localParticipant.videoTracks.forEach(pub => {
        if(isCameraOn) pub.track.disable();
        else pub.track.enable();
    });
    setIsCameraOn(prev => !prev);
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
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <video ref={remoteVideoRef} className={`w-full h-full object-cover ${isRemoteVideoOn ? 'block' : 'hidden'}`} autoPlay />
            <audio ref={remoteAudioRef} autoPlay />
            
            {(!remoteParticipant || !isRemoteVideoOn) && (
              <div className="text-center">
                {connecting ? (
                   <>
                       <Loader2 className="w-12 h-12 text-slate-500 animate-spin" />
                       <p className="mt-4 text-slate-400">Menghubungkan...</p>
                   </>
                ) : !remoteParticipant ? (
                    <>
                       <Avatar className="w-32 h-32">
                           <AvatarImage src={otherUser.avatar} />
                           <AvatarFallback><User className="w-16 h-16" /></AvatarFallback>
                       </Avatar>
                       <p className="mt-4 text-slate-400">Menunggu {otherUser.name}...</p>
                    </>
                ) : (
                   <>
                       <Avatar className="w-32 h-32">
                           <AvatarImage src={otherUser.avatar} />
                           <AvatarFallback><User className="w-16 h-16" /></AvatarFallback>
                       </Avatar>
                       <p className="mt-4 text-slate-400">Kamera {otherUser.name} mati</p>
                   </>
                )}
              </div>
            )}
        </div>

        {/* Local Participant View */}
        <div className="absolute top-4 right-4 w-28 h-40 bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600 z-10">
            <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted />
            {!isCameraOn && (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-500"/>
                </div>
            )}
        </div>

        {/* Call Info */}
        <div className="mt-8 text-center z-10 bg-black/30 px-4 py-2 rounded-lg">
            <h2 className="text-2xl font-bold">{remoteParticipant ? otherUser.name : 'Menghubungkan...'}</h2>
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
