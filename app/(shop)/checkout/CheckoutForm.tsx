"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/features/cart/store";
import { getSubtotal } from "@/features/cart/cartUtils";
import { placeOrder, type CheckoutFormData } from "@/app/(shop)/checkout/actions";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from "@/lib/utils";
import type { DeliveryArea } from "@/types/db";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    deliveryMethod: z.enum(["delivery", "pickup"]),
    address: z.string().optional(),
    deliveryAreaId: z.string().optional(),
    paymentMethod: z.enum(["cod", "bank_transfer"]),
  })
  .refine(
    (data) => {
      if (data.deliveryMethod === "delivery") {
        return (data.address?.trim()?.length ?? 0) > 0;
      }
      return true;
    },
    { message: "Address is required for delivery", path: ["address"] }
  );

type FormValues = z.infer<typeof schema>;

interface CheckoutFormProps {
  deliveryAreas: DeliveryArea[];
}

export function CheckoutForm({ deliveryAreas }: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      deliveryMethod: "pickup",
      paymentMethod: "cod",
    },
  });

  const deliveryMethod = watch("deliveryMethod");
  const deliveryAreaId = watch("deliveryAreaId");

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const subtotal = getSubtotal(items);
  const selectedArea = deliveryAreas.find((a) => a.id === deliveryAreaId);
  const deliveryFee = deliveryMethod === "delivery" && selectedArea ? selectedArea.fee : 0;
  const total = subtotal + deliveryFee;

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    const formData: CheckoutFormData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      deliveryMethod: data.deliveryMethod,
      address: data.address,
      deliveryAreaId: data.deliveryAreaId,
      paymentMethod: data.paymentMethod,
    };
    const result = await placeOrder(items, formData);
    if (result.ok) {
      clearCart();
      router.push(`/order/success?orderId=${result.orderId}`);
    } else {
      setSubmitError(result.error);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" {...register("phone")} />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Delivery method</Label>
        <RadioGroup
          value={deliveryMethod}
          onValueChange={(v) => setValue("deliveryMethod", v as "delivery" | "pickup")}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup" className="font-normal">Pickup</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery" className="font-normal">Delivery</Label>
          </div>
        </RadioGroup>
      </div>

      {deliveryMethod === "delivery" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="deliveryArea">Delivery area</Label>
            <Select
              value={deliveryAreaId ?? ""}
              onValueChange={(v) => setValue("deliveryAreaId", v)}
            >
              <SelectTrigger id="deliveryArea">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {deliveryAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name} — {formatPrice(area.fee)} fee
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="Street, city, postal code"
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label>Payment method</Label>
        <RadioGroup
          value={watch("paymentMethod")}
          onValueChange={(v) => setValue("paymentMethod", v as "cod" | "bank_transfer")}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="font-normal">Cash on delivery (COD)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="bank_transfer" id="bank_transfer" />
            <Label htmlFor="bank_transfer" className="font-normal">Bank transfer</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="rounded-lg border p-4 space-y-1">
        <p className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </p>
        {deliveryMethod === "delivery" && deliveryFee > 0 && (
          <p className="flex justify-between text-sm">
            <span>Delivery fee</span>
            <span>{formatPrice(deliveryFee)}</span>
          </p>
        )}
        <p className="flex justify-between font-semibold pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </p>
      </div>

      {submitError && (
        <p className="text-sm text-destructive">{submitError}</p>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Placing order…" : "Place order"}
      </Button>
    </form>
  );
}
