
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { users, setCurrentUser } = dataStore;

  // Find a default business and regular user to simulate
  const defaultBusinessUser = users.find(u => u.role === 'business');

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
            toast({ variant: 'destructive', title: "Error", description: "Silakan masukkan email dan kata sandi."});
            return;
        }
    }
    
    // Set the current user in the data store
    setCurrentUser(selectedUserId);

    toast({ title: "Login Berhasil", description: `Selamat datang kembali, ${users.find(u => u.id === selectedUserId)?.name}!`});
    router.push("/home");
  }

  const handleSendCode = () => {
    if (phone.trim()) {
      setCodeSent(true);
      toast({ title: "Kode Terkirim", description: "Kode verifikasi telah dikirim ke ponsel Anda."});
    }
  };

  const handleVerifyCode = () => {
    if (code.trim()) {
      handleLogin('phone');
    }
  };

  return (
    <AppContainer className="bg-transparent shadow-none">
      <div className="flex flex-col items-center justify-center p-8 bg-card md:rounded-2xl h-full overflow-y-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <Image src="/image/logomarker.png" alt="ChitChat Logo" width={240} height={120} className="w-auto h-36 mb-4" />
          <p className="text-muted-foreground">Masuk untuk melanjutkan</p>
        </div>

        <div className="w-full max-w-sm">
            <Card className="bg-muted/50 mb-4">
                <CardHeader className="p-3">
                    <CardDescription className="flex items-center gap-2 text-xs"><Users /><span>Mode Simulasi</span></CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                    <Label htmlFor="user-select" className="text-xs">Login sebagai:</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger id="user-select" className="text-foreground mt-1 h-9">
                            <SelectValue placeholder="Pilih pengguna" />
                        </SelectTrigger>
                        <SelectContent>
                            {users.map(user => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.name} ({user.role})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Telepon</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
                <div className="space-y-4 pt-4 text-left">
                  <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="text-foreground" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="password">Kata Sandi</Label>
                      <Input id="password" type="password" value={password} readOnly className="text-foreground italic"/>
                  </div>
                  <Button className="w-full" onClick={() => handleLogin('email')}>Masuk dengan Email</Button>
                </div>
            </TabsContent>
            <TabsContent value="phone">
                {!codeSent ? (
                    <div className="space-y-4 pt-4 text-left">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input 
                            id="phone" 
                            type="tel" 
                            placeholder="+62 812 3456 7890" 
                            className="text-foreground" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" onClick={handleSendCode} disabled={!phone.trim()}>Kirim Kode</Button>
                    </div>
                ) : (
                    <div className="space-y-4 pt-4 text-left animate-in fade-in">
                        <div className="space-y-2">
                            <Label htmlFor="code">Kode Verifikasi</Label>
                            <Input 
                                id="code" 
                                type="text" 
                                placeholder="Masukkan kode 6 digit" 
                                className="text-foreground" 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
                            />
                        </div>
                        <Button className="w-full" onClick={handleVerifyCode} disabled={!code.trim()}>Verifikasi & Masuk</Button>
                        <Button variant="link" size="sm" className="w-full" onClick={() => setCodeSent(false)}>Kembali</Button>
                    </div>
                )}
            </TabsContent>
            </Tabs>
             <div className="mt-4 text-center text-sm">
              Belum punya akun?{" "}
              <Link href="/register" className="underline">
                Daftar
              </Link>
            </div>
            <p className="px-8 text-center text-xs text-muted-foreground mt-6">
              Dengan mengklik lanjutkan, Anda menyetujui{" "}
              <Link
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
              >
                  Ketentuan Layanan
              </Link>{" "}
              dan{" "}
              <Link
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
              >
                  Kebijakan Privasi
              </Link>
              kami.
            </p>
        </div>
      </div>
    </AppContainer>
  );
}
