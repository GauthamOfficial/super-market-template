import { z } from "zod";

export const deliveryAreaFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  fee: z.coerce.number().min(0, "Fee must be ≥ 0"),
  branch_id: z.string().uuid().optional().nullable().or(z.literal("")),
  is_enabled: z.boolean(),
});

export type DeliveryAreaFormValues = z.infer<typeof deliveryAreaFormSchema>;
