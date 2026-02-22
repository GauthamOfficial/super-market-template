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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <CheckoutForm deliveryAreas={deliveryAreas} />
    </div>
  );
}
