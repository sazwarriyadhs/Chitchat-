"use client";

import { useState } from "react";
import Link from "next/link";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatLogo } from "@/components/icons/ChatLogo";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/home");
  }

  return (
    <AppContainer>
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <ChatLogo className="w-16 h-16 text-primary mb-4" />
          <h1 className="text-2xl font-bold">Welcome to ChattyLite</h1>
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        <Tabs defaultValue="email" className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full" onClick={handleLogin}>Sign In with Email</Button>
            </div>
          </TabsContent>
          <TabsContent value="phone">
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
               <Button className="w-full" onClick={handleLogin}>Send Code</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-6 bg-border/40" />

        <p className="px-8 text-center text-sm text-muted-foreground">
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
    </AppContainer>
  );
}
