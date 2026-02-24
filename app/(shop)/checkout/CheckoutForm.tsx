"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Truck, CreditCard, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import { getSubtotal } from "@/features/cart/cartUtils";
import { placeOrder, type CheckoutFormData } from "@/app/(shop)/checkout/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Only redirect when cart is empty *after* store has rehydrated from localStorage
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (items.length === 0) {
        router.replace("/cart");
      }
    }, 100);
    return () => window.clearTimeout(id);
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

  const itemCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-[1fr,300px] sm:gap-5 max-w-4xl mx-auto items-start">
      {/* Left: Single form card */}
      <Card className="max-w-2xl bg-gradient-to-t from-green-100 to-white dark:from-green-950/30 dark:to-card">
        <CardContent className="p-4 sm:p-5 space-y-0">
          {/* Contact information — single row on sm+ */}
          <div className="space-y-3 pb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Contact information</h2>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">Name</Label>
                <Input id="name" placeholder="Full name" {...register("name")} className="h-10 text-base" />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input id="email" type="email" placeholder="Your email" {...register("email")} className="h-10 text-base" />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm">Phone</Label>
                <Input id="phone" type="tel" placeholder="+94 7x xxx xxxx" {...register("phone")} className="h-10 text-base" />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t py-4">
            {/* Delivery method — horizontal on sm+ */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold">Delivery method</h2>
              </div>
              <RadioGroup
                value={deliveryMethod}
                onValueChange={(v) => setValue("deliveryMethod", v as "delivery" | "pickup")}
                className="flex flex-col gap-2 sm:flex-row sm:gap-3"
              >
                <label
                  htmlFor="pickup"
                  className="flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 flex-1"
                >
                  <RadioGroupItem value="pickup" id="pickup" />
                  <div className="min-w-0">
                    <span className="font-medium text-base">Pickup</span>
                    <p className="text-sm text-muted-foreground truncate">Collect from store</p>
                  </div>
                </label>
                <label
                  htmlFor="delivery"
                  className="flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 flex-1"
                >
                  <RadioGroupItem value="delivery" id="delivery" />
                  <div className="min-w-0">
                    <span className="font-medium text-base">Delivery</span>
                    <p className="text-sm text-muted-foreground truncate">We deliver</p>
                  </div>
                </label>
              </RadioGroup>

              {deliveryMethod === "delivery" && (
                <div className="pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-sm">Address</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="Your address"
                      className="h-10 text-base"
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t py-4">
            {/* Payment method — horizontal on sm+ */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold">Payment method</h2>
              </div>
              <RadioGroup
                value={watch("paymentMethod")}
                onValueChange={(v) => setValue("paymentMethod", v as "cod" | "bank_transfer")}
                className="flex flex-col gap-2 sm:flex-row sm:gap-3"
              >
                <label
                  htmlFor="cod"
                  className="flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 flex-1"
                >
                  <RadioGroupItem value="cod" id="cod" />
                  <span className="font-medium text-base">Cash (COD)</span>
                </label>
                <label
                  htmlFor="bank_transfer"
                  className="flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 flex-1"
                >
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <span className="font-medium text-base">Bank transfer</span>
                </label>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right: Order summary */}
      <Card className="overflow-hidden sm:sticky sm:top-8">
        <CardHeader className="py-4 px-4 sm:px-5">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Order summary
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </CardHeader>
        <CardContent className="space-y-3 px-4 sm:px-5 pb-4 pt-0">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {deliveryMethod === "delivery" && deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-destructive rounded bg-destructive/10 p-2">{submitError}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full h-11 text-base font-semibold"
          >
            {isSubmitting ? "Placing order…" : "Place order"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
