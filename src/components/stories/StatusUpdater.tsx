
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User } from "@/lib/types"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Smile } from "lucide-react"

export function StatusUpdater({ user, children }: { user: User, children: React.ReactNode }) {
  const [status, setStatus] = useState(user.status || "");
  const { toast } = useToast();

  const handleUpdate = () => {
    // In a real app, you'd save this to a backend.
    toast({
      title: "Status Diperbarui",
      description: `Status baru Anda adalah: "${status}"`,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perbarui status Anda</DialogTitle>
          <DialogDescription>
            Beri tahu semua orang apa yang sedang Anda lakukan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Apa yang ada di pikiranmu?"
              className="pr-10"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdate}>Simpan perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
