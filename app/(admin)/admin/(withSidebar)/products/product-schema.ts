import { z } from "zod";

const variantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().min(0, "Price must be ≥ 0"),
});

export const productFormSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
    description: z.string().max(5000).optional().nullable(),
    image_url: z
      .union([z.string().url(), z.literal(""), z.null()])
      .optional()
      .nullable(),
    base_price: z.coerce.number().min(0, "Base price must be ≥ 0"),
    is_active: z.boolean(),
    category_id: z.string().uuid().optional().nullable().or(z.literal("")),
    variants: z.array(variantSchema).min(1, "Add at least one variant"),
  })
  .refine(
    (data) => {
      const skus = data.variants.map((v) => v.sku.trim());
      return new Set(skus).size === skus.length;
    },
    { message: "Variant SKUs must be unique", path: ["variants"] }
  );

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function slugFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
