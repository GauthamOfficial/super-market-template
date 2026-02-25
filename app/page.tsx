import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getProducts } from "@/features/products/actions";
import { getBranches } from "@/lib/dal";
import { getBranchImageUrl } from "@/lib/branch-image";
import { ProductCard } from "@/features/products/product-card";
import { HeroBranchCarousel } from "@/features/home/HeroBranchCarousel";
import { HeroTagline } from "@/features/home/HeroTagline";
import { EnjoyFreshestSection } from "@/features/home/EnjoyFreshestSection";
import { HeroProductSearch } from "@/features/search/HeroProductSearch";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { AnimateOnScroll } from "@/components/layout/AnimateOnScroll";
import { siteConfig } from "@/config/site";

/** Landing page always shows these 4 branches (names + images) from site config. */
const displayBranches = siteConfig.branchNames.map((name, i) => ({ id: `branch-${i}`, name }));

export default async function HomePage() {
  const [productsResult, branchesResult] = await Promise.all([
    getProducts(),
    getBranches(),
  ]);
  const products = productsResult;
  const featured = products.slice(0, 6);
  const branches = branchesResult.ok ? branchesResult.data : [];

  return (
    <div className="min-w-0">
      {/* Hero — reference style: full-bleed image background, white text, search bar, store carousel */}
      <section className="full-bleed -mt-8 relative min-h-[94vh] sm:min-h-[90vh] flex flex-col overflow-hidden bg-black">
        {/* Black base */}
        <div className="absolute inset-0 bg-black" aria-hidden />
        <div className="hero-overlay" aria-hidden />
        {/* Green gradient from bottom */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent pointer-events-none"
          aria-hidden
        />

        {/* Top: 3 small buttons, same style (black + subtle green glow), moved down from navbar */}
        <div className="absolute top-10 right-2 left-2 z-20 flex flex-row flex-nowrap items-center justify-center gap-1.5 sm:left-auto sm:top-6 sm:right-6 sm:justify-end sm:gap-3">
          <Link
            href="/products"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-black/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md transition-all duration-200 shadow-[0_0_6px_2px_rgba(0,165,79,0.4)] hover:bg-black/90 hover:shadow-[0_0_12px_4px_rgba(0,165,79,0.5)] hover:scale-[1.02] sm:px-4 sm:py-2 sm:text-sm sm:shadow-[0_0_8px_3px_rgba(0,165,79,0.35)] sm:hover:shadow-[0_0_14px_5px_rgba(0,165,79,0.45)]"
          >
            Products
          </Link>
          <Link
            href="/find-store"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-black/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md transition-all duration-200 shadow-[0_0_6px_2px_rgba(0,165,79,0.4)] hover:bg-black/90 hover:shadow-[0_0_12px_4px_rgba(0,165,79,0.5)] hover:scale-[1.02] sm:px-4 sm:py-2 sm:text-sm sm:shadow-[0_0_8px_3px_rgba(0,165,79,0.35)] sm:hover:shadow-[0_0_14px_5px_rgba(0,165,79,0.45)]"
          >
            Find a store
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full bg-black/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md transition-all duration-200 shadow-[0_0_6px_2px_rgba(0,165,79,0.4)] hover:bg-black/90 hover:shadow-[0_0_12px_4px_rgba(0,165,79,0.5)] hover:scale-[1.02] sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm sm:shadow-[0_0_8px_3px_rgba(0,165,79,0.35)] sm:hover:shadow-[0_0_14px_5px_rgba(0,165,79,0.45)]"
          >
            Explore more
            <ChevronRight className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
          </Link>
        </div>

        {/* Main hero content: headline, tagline, search, branch carousel */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-3 pt-14 pb-6 text-center sm:px-4 sm:pt-28 sm:pb-10">
          <h1 className="font-impact text-3xl font-normal tracking-tight text-white opacity-0 animate-hero-fade-in-up sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl" style={{ letterSpacing: "0.03em" }}>
            {siteConfig.name}
          </h1>
          <HeroTagline />

          {/* Search bar — full width on mobile */}
          <div
            className="relative z-20 mt-4 w-full max-w-full opacity-0 animate-hero-fade-in-up sm:mt-6 sm:max-w-xl"
            style={{ animationDelay: "0.2s" }}
          >
            <HeroProductSearch />
          </div>

          {/* Store location cards carousel */}
          <HeroBranchCarousel branches={displayBranches} />
        </div>
      </section>

      {/* Find a store — branch images */}
      <AnimateOnScroll>
      <section className="full-bleed py-16">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-8">Find a <span className="font-accent italic text-[1.1em]">store</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayBranches.map((branch) => (
              <Link
                key={branch.id}
                href="/find-store"
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border shadow-sm transition hover:shadow-md"
              >
                <Image
                  src={getBranchImageUrl(branch)}
                  alt={branch.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <span className="text-sm font-semibold text-white">{branch.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/find-store">Find a store</Link>
            </Button>
          </div>
        </Container>
      </section>
      </AnimateOnScroll>

      {/* Enjoy the freshest — floating product boxes, grey bg, scroll parallax */}
      <AnimateOnScroll>
      <EnjoyFreshestSection />
      </AnimateOnScroll>

      {/* Crafted with love — mobile: 2 cols × 3 rows; desktop: single row */}
      <AnimateOnScroll delay={80}>
      <section className="full-bleed bg-white py-16">
        <Container className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-8">
            Crafted with <span className="font-accent italic text-[1.1em]">love</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-xl mx-auto mb-8">
            Discover our in-house collections and daily essentials.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-4 max-w-2xl sm:max-w-none mx-auto">
            {[
              { label: "Premium Staples", src: "/fn/fn-1.png" },
              { label: "Value Staples", src: "/fn/fn-2.png" },
              { label: "Cleaning", src: "/fn/fn-3.png" },
              { label: "Fun Foods", src: "/fn/fn-4.png" },
              { label: "Ready to Eat", src: "/fn/fn-5.png" },
              { label: "Daily Needs", src: "/fn/fn-6.png" },
            ].map(({ label, src }) => (
              <div key={label} className="relative aspect-[5/6] rounded-xl overflow-hidden border border-border bg-muted">
                <Image
                  src={src}
                  alt={label}
                  fill
                  className="object-cover w-full h-full"
                  sizes="(max-width: 640px) 50vw, 280px"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
      </AnimateOnScroll>

      {/* Happy customers — image with gradient overlay and text */}
      <AnimateOnScroll delay={100}>
      <section className="full-bleed py-16 bg-white">
        <Container>
          <div className="w-full relative h-96 rounded-xl overflow-hidden">
            <Image
              src="/customer.jpg"
              alt="Happy customers"
              fill
              className="object-cover object-[38%_28%] sm:object-[50%_28%]"
              sizes="100vw"
              priority={false}
            />
            {/* Black gradient from bottom-left at 45° — stronger on mobile */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl sm:hidden"
              style={{
                background: "linear-gradient(45deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.58) 45%, transparent 75%)",
              }}
              aria-hidden
            />
            <div
              className="absolute inset-0 pointer-events-none rounded-xl hidden sm:block"
              style={{
                background: "linear-gradient(45deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 45%, transparent 75%)",
              }}
              aria-hidden
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end">
              <p className="font-playfair text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white drop-shadow-lg italic">
                1000+
              </p>
              <p className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white drop-shadow-lg mt-1 italic">
                Happy Customers
              </p>
              <p className="mt-3 text-white/95 text-base sm:text-lg max-w-md font-medium drop-shadow">
                join us on this journey built on trust and satisfaction
              </p>
            </div>
          </div>
        </Container>
      </section>
      </AnimateOnScroll>

      {/* Featured products — keep existing behaviour */}
      <AnimateOnScroll delay={120}>
      <section className="full-bleed border-t bg-muted/30 py-16">
        <Container>
          <h2 className="text-2xl font-bold text-black mb-6">Featured <span className="font-accent italic text-[1.1em]">products</span></h2>
          {featured.length > 0 ? (
            <div className="grid min-w-0 gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {featured.map((product) => (
                <div key={product.id} className="min-w-0">
                  <ProductCard product={product} compact actionLabel="View" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <p>No products yet. Add products in Supabase or run the seed script.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/products">View products</Link>
              </Button>
            </div>
          )}
          <div className="mt-6 text-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/products">Browse all products</Link>
            </Button>
          </div>
        </Container>
      </section>
      </AnimateOnScroll>
    </div>
  );
}
