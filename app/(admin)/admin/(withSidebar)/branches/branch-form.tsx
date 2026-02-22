"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { branchFormSchema, type BranchFormValues } from "./branch-schema";
import { createBranchAction, updateBranchAction } from "./actions";
import type { Branch } from "@/types/db";
import { Loader2 } from "lucide-react";

export function BranchForm({
  branch,
  onCancelHref,
}: {
  branch: Branch | null;
  onCancelHref: string;
}) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: branch
      ? {
          name: branch.name,
          address: branch.address ?? "",
          phone: branch.phone ?? "",
          whatsapp_phone: (branch as { whatsapp_phone?: string | null }).whatsapp_phone ?? "",
          timezone: branch.timezone,
          is_active: branch.is_active,
        }
      : {
          name: "",
          address: "",
          phone: "",
          whatsapp_phone: "",
          timezone: "UTC",
          is_active: true,
        },
  });

  const onSubmit = async (values: BranchFormValues) => {
    setSubmitError(null);
    const payload = {
      name: values.name,
      address: values.address || null,
      phone: values.phone || null,
      whatsapp_phone: values.whatsapp_phone?.trim() || null,
      timezone: values.timezone,
      is_active: values.is_active,
    };
    const result = branch
      ? await updateBranchAction(branch.id, payload)
      : await createBranchAction(payload as Parameters<typeof createBranchAction>[0]);

    if (result.ok) {
      router.push("/admin/branches");
      router.refresh();
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      {submitError && (
        <p className="text-destructive text-sm" role="alert">
          {submitError}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-destructive text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <textarea
          id="address"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...form.register("address")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...form.register("phone")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp_phone">WhatsApp number</Label>
        <Input
          id="whatsapp_phone"
          {...form.register("whatsapp_phone")}
          placeholder="e.g. 1234567890 (country code, no +)"
        />
        <p className="text-muted-foreground text-xs">
          Used for &quot;Send to Shop&quot; link on order success. Leave empty to use Phone or env NEXT_PUBLIC_WHATSAPP_NUMBER.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Input id="timezone" {...form.register("timezone")} placeholder="e.g. UTC" />
        {form.formState.errors.timezone && (
          <p className="text-destructive text-sm">
            {form.formState.errors.timezone.message}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          className="h-4 w-4 rounded border-input"
          {...form.register("is_active")}
        />
        <Label htmlFor="is_active">Active (visible to customers)</Label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : branch ? (
            "Update branch"
          ) : (
            "Create branch"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(onCancelHref)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
