
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppContainer } from "@/components/AppContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { dataStore } from "@/lib/data";
import { User } from "@/lib/types";
import { MembershipTable } from "@/components/MembershipTable";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createUser } = dataStore;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User['role']>('regular');

  const handleRegister = () => {
    if (!name || !email || !password) {
        toast({ variant: 'destructive', title: "Error", description: "Please fill in all fields."});
        return;
    }
    
    // In a real app, you would add more robust validation
    try {
        createUser({ name, email, password, role });
        toast({ title: "Registration Successful", description: "You can now log in with your credentials."});
        router.push("/login");
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Registration Failed", description: error.message });
    }
  }

  return (
    <AppContainer className="bg-transparent shadow-none">
      <div className="flex flex-col items-center justify-center h-full p-8 bg-card md:rounded-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <Image src="/image/logomarker.png" alt="ChitChat Logo" width={160} height={80} className="w-auto h-12 mb-4" />
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Join the conversation</p>
        </div>

        <div className="w-full max-w-sm text-left">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="text-gray-900" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="text-gray-900" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-gray-900"/>
                </div>
                <div className="space-y-3">
                    <Label>Account Type</Label>
                    <RadioGroup defaultValue={role} onValueChange={(value: User['role']) => setRole(value)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="regular" id="r1" />
                            <Label htmlFor="r1">Basic Account</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="business" id="r2" />
                            <Label htmlFor="r2">Business Account</Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button className="w-full" onClick={handleRegister}>Create Account</Button>
            </div>
             <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
        </div>
        <MembershipTable />
      </div>
    </AppContainer>
  );
}
