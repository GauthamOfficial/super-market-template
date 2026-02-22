"use server";

// Placeholder for cart logic (e.g. Supabase cart table or cookies).
// Safe fallback: no-op until you add a cart table.

export async function addToCart(_productId: string, _quantity: number = 1) {
  // TODO: insert into cart table or update cookie
  return { success: true };
}

export async function removeFromCart(_itemId: string) {
  return { success: true };
}
