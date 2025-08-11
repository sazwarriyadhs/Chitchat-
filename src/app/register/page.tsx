
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
        toast({ variant: 'destructive', title: "Error", description: "Silakan isi semua kolom."});
        return;
    }
    
    // In a real app, you would add more robust validation
    try {
        createUser({ name, email, password, role });
        toast({ title: "Pendaftaran Berhasil", description: "Anda sekarang dapat masuk dengan kredensial Anda."});
        router.push("/login");
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Pendaftaran Gagal", description: error.message });
    }
  }

  return (
    <AppContainer className="bg-transparent shadow-none">
      <div className="flex flex-col items-center justify-center h-full p-8 bg-card md:rounded-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <Image src="/image/logomarker.png" alt="ChitChat Logo" width={240} height={120} className="w-auto h-12 mb-4" />
          <h1 className="text-2xl font-bold">Buat Akun</h1>
          <p className="text-muted-foreground">Bergabunglah dalam percakapan</p>
        </div>

        <div className="w-full max-w-sm text-left">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="text-gray-900" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="text-gray-900" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Kata Sandi</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-gray-900"/>
                </div>
                <div className="space-y-3">
                    <Label>Tipe Akun</Label>
                    <RadioGroup defaultValue={role} onValueChange={(value: User['role']) => setRole(value)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="regular" id="r1" />
                            <Label htmlFor="r1">Akun Dasar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="business" id="r2" />
                            <Label htmlFor="r2">Akun Bisnis</Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button className="w-full" onClick={handleRegister}>Buat Akun</Button>
            </div>
             <div className="mt-4 text-center text-sm">
              Sudah punya akun?{" "}
              <Link href="/login" className="underline">
                Masuk
              </Link>
            </div>
        </div>
        <MembershipTable />
      </div>
    </AppContainer>
  );
}
