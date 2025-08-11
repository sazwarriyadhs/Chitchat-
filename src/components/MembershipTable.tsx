
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export function MembershipTable() {
  const memberships = [
    {
      type: "Basic",
      features: [
        { name: "Buat & gabung grup", included: true },
        { name: "Kirim pesan & media", included: true },
        { name: "Update status", included: true },
        { name: "Lihat produk di Store", included: true },
        { name: "Order produk dari Store", included: true },
        { name: "Posting / jual produk di Store", included: false },
        { name: "Buat Channel Store", included: false },
        { name: "Share Presentasi", included: false }
      ]
    },
    {
      type: "Bisnis",
      features: [
        { name: "Buat & gabung grup", included: true },
        { name: "Kirim pesan & media", included: true },
        { name: "Update status", included: true },
        { name: "Lihat produk di Store", included: true },
        { name: "Order produk dari Store", included: true },
        { name: "Posting / jual produk di Store", included: true },
        { name: "Buat Channel Store", included: true },
        { name: "Share Presentasi", included: true }
      ]
    }
  ];

  return (
    <div className="grid w-full max-w-sm sm:max-w-none sm:grid-cols-2 gap-4 mt-8">
      {memberships.map((m) => (
        <Card key={m.type} className={cn(m.type === 'Bisnis' && 'border-primary ring-1 ring-primary')}>
          <CardHeader>
            <CardTitle>{m.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {m.features.map((f, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className={cn(!f.included && 'text-muted-foreground line-through')}>{f.name}</span>
                  {f.included ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-destructive" />}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
