
"use client";

import { Suspense } from 'react';
import { CallUI } from './CallUI';
import { AppContainer } from '@/components/AppContainer';
import { Loader2 } from 'lucide-react';

export default function CallPage() {

  return (
    <Suspense fallback={
        <AppContainer className="bg-slate-800 text-white">
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-12 h-12 text-slate-500 animate-spin" />
            </div>
        </AppContainer>
    }>
        <CallUI />
    </Suspense>
  );
}
