import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BranchForm } from "../branch-form";

export default function AdminNewBranchPage() {
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/admin/branches">← Back to branches</Link>
        </Button>
        <h1 className="text-2xl font-semibold">New branch</h1>
      </div>
      <BranchForm branch={null} onCancelHref="/admin/branches" />
    </div>
  );
}
