
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

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/home");
  }

  return (
    <AppContainer>
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="flex flex-col items-center text-center mb-8 transform scale-[2] origin-bottom">
          <Image src="/image/logo.png" alt="ChattyLite Logo" width={64} height={64} className="w-16 h-16 mb-4" />
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        <div className="transform scale-[2] w-full max-w-sm mt-24">
            <Tabs defaultValue="email" className="w-full">
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
        </div>
        
        <div className="absolute bottom-8">
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
      </div>
    </AppContainer>
  );
}
