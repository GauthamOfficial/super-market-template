"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deliveryAreaFormSchema, type DeliveryAreaFormValues } from "./delivery-schema";
import { createDeliveryAreaAction, updateDeliveryAreaAction } from "./actions";
import type { Branch } from "@/types/db";
import type { DeliveryArea } from "@/types/db";
import { Loader2 } from "lucide-react";

export function DeliveryAreaForm({
  branches,
  area,
  trigger,
}: {
  branches: Branch[];
  area?: DeliveryArea | null;
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<DeliveryAreaFormValues>({
    resolver: zodResolver(deliveryAreaFormSchema),
    defaultValues: {
      name: "",
      fee: 0,
      branch_id: "",
      is_enabled: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (area) {
        form.reset({
          name: area.name,
          fee: area.fee,
          branch_id: area.branch_id ?? "",
          is_enabled: area.is_enabled,
        });
      } else {
        form.reset({ name: "", fee: 0, branch_id: "", is_enabled: true });
      }
      setSubmitError(null);
    }
  }, [open, area, form]);

  const onSubmit = async (values: DeliveryAreaFormValues) => {
    setSubmitError(null);
    const payload = {
      name: values.name,
      fee: values.fee,
      branch_id: values.branch_id || null,
      is_enabled: values.is_enabled,
    };
    const result = area
      ? await updateDeliveryAreaAction(area.id, payload)
      : await createDeliveryAreaAction(payload as Parameters<typeof createDeliveryAreaAction>[0]);

    if (result.ok) {
      setOpen(false);
      router.refresh();
      if (!area) form.reset({ name: "", fee: 0, branch_id: "", is_enabled: true });
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{area ? `Edit ${area.name}` : "Add delivery area"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {submitError && (
            <p className="text-destructive text-sm" role="alert">
              {submitError}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} placeholder="e.g. Downtown" />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee">Delivery fee</Label>
            <Input
              id="fee"
              type="number"
              step="0.01"
              min="0"
              {...form.register("fee")}
            />
            {form.formState.errors.fee && (
              <p className="text-destructive text-sm">
                {form.formState.errors.fee.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Branch (optional)</Label>
            <Select
              value={form.watch("branch_id") || "none"}
              onValueChange={(v) => form.setValue("branch_id", v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific branch</SelectItem>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_enabled"
              className="h-4 w-4 rounded border-input"
              {...form.register("is_enabled")}
            />
            <Label htmlFor="is_enabled">Enabled (show at checkout)</Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : area ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
