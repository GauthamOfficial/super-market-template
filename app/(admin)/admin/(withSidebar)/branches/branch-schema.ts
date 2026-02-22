import { z } from "zod";

export const branchFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  address: z.string().max(500).optional(),
  phone: z.string().max(50).optional(),
  whatsapp_phone: z.string().max(50).optional(),
  timezone: z.string().min(1, "Timezone is required").max(50),
  is_active: z.boolean(),
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;
