import Link from "next/link";
import { getAllBranches } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

export default async function AdminBranchesPage() {
  const result = await getAllBranches();

  if (!isOk(result)) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold sm:text-2xl">Branches</h1>
        <p className="text-destructive">{result.error}</p>
      </div>
    );
  }

  const branches = result.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl">Branches</h1>
        <Button asChild>
          <Link href="/admin/branches/new" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New branch
          </Link>
        </Button>
      </div>

      <div className="admin-table-wrapper overflow-x-auto">
        <Table className="admin-table min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No branches yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {branch.address ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {branch.phone ?? "—"}
                  </TableCell>
                  <TableCell>
                    {branch.is_active ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/branches/${branch.id}/edit`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
