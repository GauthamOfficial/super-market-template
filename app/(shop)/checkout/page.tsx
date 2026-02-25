import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSelectedBranchId } from "@/lib/branch-cookie";
import { getDeliveryAreas } from "@/lib/dal";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = {
  title: "Checkout",
  description: "Complete your order",
};

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const branchId = getSelectedBranchId(cookieStore);

  if (!branchId) {
    redirect("/select-branch");
  }

  const areasResult = await getDeliveryAreas({ enabledOnly: true });
  const deliveryAreas = areasResult.ok ? areasResult.data : [];

  return (
    <div className="min-w-0 min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-6 sm:px-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">Checkout</h1>
          <p className="mt-1 text-base text-muted-foreground">Complete your order with the details below.</p>
        </div>
        <CheckoutForm deliveryAreas={deliveryAreas} />
      </div>
    </div>
  );
}
