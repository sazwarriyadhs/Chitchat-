"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppContainer } from '@/components/AppContainer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Users } from 'lucide-react';
import { users } from '@/lib/data';

const otherUser = users[1]; // Mock other user

export default function CallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const isVideoCall = searchParams.get('video') === 'true';
  const isGroupCall = searchParams.get('type') === 'group';

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(isVideoCall);
  const [callDuration, setCallDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoCall,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(isVideoCall ? true : null);
        setHasMicPermission(true);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasCameraPermission(false);
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Media Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getPermissions();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
        clearInterval(timer);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };
  }, [isVideoCall, toast]);
  
  useEffect(() => {
    if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = isCameraOn;
        }
    }
  }, [isCameraOn]);
  
   useEffect(() => {
    if (streamRef.current) {
        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = isMicOn;
        }
    }
  }, [isMicOn]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleEndCall = () => {
    router.back();
  };

  const renderPermissionsError = () => {
    if (hasCameraPermission === false || hasMicPermission === false) {
        return (
            <Alert variant="destructive" className="m-4">
                <AlertTitle>Permissions Required</AlertTitle>
                <AlertDescription>
                    Camera and microphone access is needed for calls. Please update your browser settings.
                </AlertDescription>
            </Alert>
        )
    }
    return null;
  }

  return (
    <AppContainer className="bg-slate-800 text-white">
      <div className="relative w-full h-full flex flex-col items-center justify-between">
        
        {/* Remote Participant View */}
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            {isGroupCall ? (
                 <Users className="w-32 h-32 text-slate-600" />
            ) : (
                isCameraOn ? (
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={otherUser.avatar} />
                        <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                ) : (
                    <Avatar className="w-32 h-32">
                         <AvatarImage src={otherUser.avatar} />
                        <AvatarFallback><User className="w-16 h-16" /></AvatarFallback>
                    </Avatar>
                )
            )}
        </div>

        {/* Local Participant View */}
        <div className="absolute top-4 right-4 w-28 h-40 bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
            {!isCameraOn && (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-500"/>
                </div>
            )}
        </div>

        {/* Call Info */}
        <div className="mt-8 text-center z-10">
            <h2 className="text-2xl font-bold">{isGroupCall ? 'Group Call' : otherUser.name}</h2>
            <p className="text-sm text-slate-300">{formatDuration(callDuration)}</p>
        </div>

        {renderPermissionsError()}

        {/* Controls */}
        <div className="flex items-center gap-4 p-6 bg-slate-900/50 rounded-full mb-8 z-10">
          <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30" onClick={() => setIsMicOn(prev => !prev)}>
            {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>
          {isVideoCall && (
            <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30" onClick={() => setIsCameraOn(prev => !prev)}>
                {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
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
