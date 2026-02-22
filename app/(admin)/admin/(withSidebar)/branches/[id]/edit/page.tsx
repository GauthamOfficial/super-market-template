import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBranches } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { BranchForm } from "../../branch-form";

export default async function AdminEditBranchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAllBranches();

  if (!isOk(result)) {
    return (
      <div className="space-y-6">
        <p className="text-destructive">{result.error}</p>
        <Button asChild variant="outline">
          <Link href="/admin/branches">Back to branches</Link>
        </Button>
      </div>
    );
  }

  const branch = result.data.find((b) => b.id === id);
  if (!branch) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/admin/branches">← Back to branches</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit: {branch.name}</h1>
      </div>
      <BranchForm branch={branch} onCancelHref="/admin/branches" />
    </div>
  );
}
