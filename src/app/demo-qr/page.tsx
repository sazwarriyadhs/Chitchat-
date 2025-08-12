
"use client";
import { useEffect, useState } from "react";
import { AppContainer } from "@/components/AppContainer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DemoQRPage() {
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    setImgUrl("/api/demo-qr");
  }, []);

  return (
    <AppContainer>
        <header className="flex items-center p-2 border-b gap-2 sticky top-0 bg-card z-10">
            <Link href="/home" passHref>
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            </Link>
            <h1 className="text-xl font-bold font-headline">QR Member Bisnis</h1>
        </header>
        <div className="flex flex-col items-center justify-center flex-1 p-8">
            <p className="text-muted-foreground mb-4 text-center">Tunjukkan QR ini untuk verifikasi.</p>
            {imgUrl ? (
                <img src={imgUrl} alt="QR Member" className="w-64 h-64 border rounded-lg shadow-md" />
            ) : (
                <div className="w-64 h-64 border rounded-lg bg-muted animate-pulse" />
            )}
        </div>
    </AppContainer>
  );
}
