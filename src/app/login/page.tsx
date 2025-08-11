
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { dataStore } from "@/lib/data";
import { User } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { users, setCurrentUser } = dataStore;

  // Find a default business and regular user to simulate
  const defaultBusinessUser = users.find(u => u.role === 'business');
  const defaultRegularUser = users.find(u => u.role === 'regular');

  const [selectedUserId, setSelectedUserId] = useState(defaultBusinessUser?.id || users[0].id);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");

  useEffect(() => {
    const selectedUser = users.find(u => u.id === selectedUserId);
    if(selectedUser) {
        // Mock email based on name
        const mockEmail = `${selectedUser.name.split(' ')[0].toLowerCase()}@example.com`;
        setEmail(mockEmail);
    }
  }, [selectedUserId, users]);

  const handleLogin = (method: 'email' | 'phone') => {
    if (method === 'email') {
        if (!email || !password) {
            toast({ variant: 'destructive', title: "Error", description: "Please enter email and password."});
            return;
        }
    }
    
    // Set the current user in the data store
    setCurrentUser(selectedUserId);

    toast({ title: "Login Successful", description: `Welcome back, ${users.find(u => u.id === selectedUserId)?.name}!`});
    router.push("/home");
  }

  const handleSendCode = () => {
    if (phone.trim()) {
      setCodeSent(true);
      toast({ title: "Code Sent", description: "A verification code has been sent to your phone."});
    }
  };

  const handleVerifyCode = () => {
    if (code.trim()) {
      handleLogin('phone');
    }
  };

  return (
    <AppContainer className="bg-transparent shadow-none">
      <div className="flex flex-col items-center justify-center h-full p-8 bg-card md:rounded-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <Image src="/image/logomarker.png" alt="ChitChat Logo" width={160} height={80} className="w-auto h-24 mb-4" />
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        <div className="w-full max-w-sm">
            <div className="space-y-2 mb-4 text-left">
                <Label htmlFor="user-select">Simulate Login As</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger id="user-select" className="text-gray-900">
                        <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.role})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
                <div className="space-y-4 pt-4 text-left">
                  <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="text-gray-900" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-gray-900"/>
                  </div>
                  <Button className="w-full" onClick={() => handleLogin('email')}>Sign In with Email</Button>
                </div>
            </TabsContent>
            <TabsContent value="phone">
                {!codeSent ? (
                    <div className="space-y-4 pt-4 text-left">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                            id="phone" 
                            type="tel" 
                            placeholder="+62 812 3456 7890" 
                            className="text-gray-900" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" onClick={handleSendCode} disabled={!phone.trim()}>Send Code</Button>
                    </div>
                ) : (
                    <div className="space-y-4 pt-4 text-left animate-in fade-in">
                        <div className="space-y-2">
                            <Label htmlFor="code">Verification Code</Label>
                            <Input 
                                id="code" 
                                type="text" 
                                placeholder="Enter 6-digit code" 
                                className="text-gray-900" 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
                            />
                        </div>
                        <Button className="w-full" onClick={handleVerifyCode} disabled={!code.trim()}>Verify & Sign In</Button>
                        <Button variant="link" size="sm" className="w-full" onClick={() => setCodeSent(false)}>Back</Button>
                    </div>
                )}
            </TabsContent>
            </Tabs>
             <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
            <p className="px-8 text-center text-xs text-muted-foreground mt-6">
              By clicking continue, you agree to our{" "}
              <Link
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
              >
                  Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                  href="#"
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
