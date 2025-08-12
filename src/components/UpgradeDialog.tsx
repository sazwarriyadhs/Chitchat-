
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MembershipTable } from "./MembershipTable";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";

type UpgradeDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
};

export function UpgradeDialog({ isOpen, onOpenChange, featureName }: UpgradeDialogProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    // In a real app, this would navigate to a payment page
    // For this prototype, we'll just navigate to the registration/profile page
    onOpenChange(false);
    router.push('/register');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Tingkatkan ke Akun Bisnis</DialogTitle>
          <DialogDescription>
            Fitur untuk {featureName} hanya tersedia untuk anggota Bisnis. Tingkatkan akun Anda untuk membuka kunci fitur ini dan banyak lagi.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
           <MembershipTable />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Nanti Saja</Button>
          <Button onClick={handleUpgrade}>
            <Rocket className="w-4 h-4 mr-2" />
            Upgrade Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
