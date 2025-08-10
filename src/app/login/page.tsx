
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/home");
  }

  return (
    <AppContainer className="bg-transparent shadow-none">
      <div className="flex flex-col items-center justify-center h-full p-8 bg-card md:rounded-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <Image src="/logo.png" alt="ChitChat Logo" width={160} height={80} className="w-auto h-8 mb-4" />
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        <div className="w-full max-w-sm">
            <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
                <div className="space-y-4 pt-4 text-left">
                  <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" defaultValue="andi@example.com" className="text-gray-900" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" defaultValue="password" className="text-gray-900"/>
                  </div>
                  <Button className="w-full" onClick={handleLogin}>Sign In with Email</Button>
                </div>
            </TabsContent>
            <TabsContent value="phone">
                <div className="space-y-4 pt-4 text-left">
                  <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="text-gray-900" />
                  </div>
                  <Button className="w-full" onClick={handleLogin}>Send Code</Button>
                </div>
            </TabsContent>
            </Tabs>
        </div>
        
        <div className="absolute bottom-8">
            <p className="px-8 text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
            >
                Terms of Service
            </Link>{" "}
            and{" "}
            <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
            >
                Privacy Policy
            </Link>
            .
            </p>
        </div>
      </div>
    </AppContainer>
  );
}
