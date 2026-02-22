import Link from "next/link";
import { CartPageContent } from "@/features/cart/CartPageContent";
import { getSelectedBranchId } from "@/lib/branch-cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Cart",
  description: "Your shopping cart",
};

export default async function CartPage() {
  const cookieStore = await cookies();
  const branchId = getSelectedBranchId(cookieStore);

  if (!branchId) {
    redirect("/select-branch");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cart</h1>
      <CartPageContent />
    </div>
  );
}
