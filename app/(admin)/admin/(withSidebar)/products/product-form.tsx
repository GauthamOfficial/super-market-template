"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Image from "next/image";
import { productFormSchema, slugFromName, type ProductFormValues } from "./product-schema";
import { uploadProductImage, upsertProductAction } from "./actions";
import type { Category } from "@/types/db";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import type { Product, ProductVariant } from "@/types/db";

const defaultVariant: ProductFormValues["variants"][0] = {
  name: "",
  sku: "",
  price: 0,
};

function toFormValues(
  product: Product | null,
  variants: ProductVariant[]
): ProductFormValues {
  if (!product) {
    return {
      name: "",
      slug: "",
      description: "",
      image_url: "",
      base_price: 0,
      is_active: true,
      category_id: "",
      variants: [defaultVariant],
    };
  }
  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    image_url: product.image_url ?? "",
    base_price: product.base_price,
    is_active: product.is_active,
    category_id: product.category_id ?? "",
    variants:
      variants.length > 0
        ? variants.map((v) => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            price: v.price,
          }))
        : [defaultVariant],
  };
}

export function ProductForm({
  categories,
  initialProduct,
  initialVariants,
}: {
  categories: Category[];
  initialProduct: Product | null;
  initialVariants: ProductVariant[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toFormValues(initialProduct, initialVariants),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const name = form.watch("name");
  const slug = form.watch("slug");

  const syncSlugFromName = () => {
    const generated = slugFromName(name);
    if (generated) form.setValue("slug", generated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadProductImage(formData);
    setUploading(false);
    e.target.value = "";
    if (result.ok) {
      form.setValue("image_url", result.url);
    } else {
      form.setError("image_url", { message: result.error });
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitError(null);
    const result = await upsertProductAction(
      {
        id: initialProduct?.id,
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        image_url: values.image_url || null,
        base_price: values.base_price,
        is_active: values.is_active,
        category_id: values.category_id || null,
      },
      values.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
      }))
    );

    if (result.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {submitError && (
        <p className="text-destructive text-sm" role="alert">
          {submitError}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              onBlur={syncSlugFromName}
            />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...form.register("slug")} />
            {form.formState.errors.slug && (
              <p className="text-destructive text-sm">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-2"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload image
              </Button>
              {form.watch("image_url") && (
                <span className="text-muted-foreground text-sm truncate max-w-[200px]">
                  Image set
                </span>
              )}
            </div>
            {form.formState.errors.image_url && (
              <p className="text-destructive text-sm">
                {form.formState.errors.image_url.message}
              </p>
            )}
            {form.watch("image_url") && (
              <div className="relative h-24 w-24 rounded border overflow-hidden">
                <Image
                  src={form.watch("image_url")!}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_price">Base price</Label>
            <Input
              id="base_price"
              type="number"
              step="0.01"
              min="0"
              {...form.register("base_price")}
            />
            {form.formState.errors.base_price && (
              <p className="text-destructive text-sm">
                {form.formState.errors.base_price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Select
              value={form.watch("category_id") || "none"}
              onValueChange={(v) =>
                form.setValue("category_id", v === "none" ? "" : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              className="h-4 w-4 rounded border-input"
              {...form.register("is_active")}
            />
            <Label htmlFor="is_active">Active (visible in store)</Label>
          </div>
          {form.formState.errors.is_active && (
            <p className="text-destructive text-sm">
              {form.formState.errors.is_active.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Variants</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append(defaultVariant)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add variant
            </Button>
          </div>
          {form.formState.errors.variants &&
            typeof form.formState.errors.variants === "object" &&
            "message" in form.formState.errors.variants && (
              <p className="text-destructive text-sm">
                {String(form.formState.errors.variants.message)}
              </p>
            )}
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-wrap items-end gap-3 rounded-lg border p-3"
              >
                <div className="flex-1 min-w-[120px] space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    placeholder="e.g. 500g"
                    {...form.register(`variants.${index}.name`)}
                  />
                  {form.formState.errors.variants?.[index]?.name && (
                    <p className="text-destructive text-xs">
                      {form.formState.errors.variants[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs">SKU</Label>
                  <Input
                    placeholder="SKU"
                    {...form.register(`variants.${index}.sku`)}
                  />
                  {form.formState.errors.variants?.[index]?.sku && (
                    <p className="text-destructive text-xs">
                      {form.formState.errors.variants[index]?.sku?.message}
                    </p>
                  )}
                </div>
                <div className="w-24 space-y-1">
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register(`variants.${index}.price`)}
                  />
                  {form.formState.errors.variants?.[index]?.price && (
                    <p className="text-destructive text-xs">
                      {form.formState.errors.variants[index]?.price?.message}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : initialProduct ? (
            "Update product"
          ) : (
            "Create product"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
