import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { getCartItemCount } from "@/lib/storefront/cart";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let cartCount = 0;
  try {
    cartCount = await getCartItemCount();
  } catch (error) {
    // Next's internal dynamic-rendering bailout signal — must propagate, not be swallowed.
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("DYNAMIC_SERVER_USAGE")
    ) {
      throw error;
    }
    console.error("StorefrontLayout: failed to load cart count", error);
  }

  return (
    <>
      <Header cartCount={cartCount} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
