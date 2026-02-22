"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AdminSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      Sign out
    </Button>
  );
}
