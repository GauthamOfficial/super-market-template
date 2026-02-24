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
      <section className="full-bleed -mt-8 relative min-h-[90vh] flex flex-col overflow-hidden bg-black">
        {/* Black base */}
        <div className="absolute inset-0 bg-black" aria-hidden />
        {/* Background image — lowered opacity so black shows through
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <Image
            src="/bg-3.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div> */}
        <div className="hero-overlay" aria-hidden />
        {/* Green gradient from bottom */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent pointer-events-none"
          aria-hidden
        />

        {/* Top right: nav pills + Explore card */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Link href="/products" className="hero-nav-pill">
            Products
          </Link>
          <Link href="/find-store" className="hero-nav-pill">
            Find a store
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-1.5 rounded-full bg-black/70 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/85 shadow-[0_0_16px_6px_rgba(0,165,79,0.35)]"
          >
            Explore more
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Main hero content: headline, subtitle, search bar, store cards */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-10 text-center sm:pt-24">
          <h1 className="font-impact text-5xl font-normal tracking-tight text-white opacity-0 animate-hero-fade-in-up sm:text-6xl md:text-7xl lg:text-8xl" style={{ letterSpacing: "0.03em" }}>
            {siteConfig.name}
          </h1>
          <HeroTagline />

          {/* Search bar — product search with suggestions */}
          <div
            className="relative z-20 mt-6 w-full max-w-2xl opacity-0 animate-hero-fade-in-up sm:max-w-xl"
            style={{ animationDelay: "0.2s" }}
          >
            <HeroProductSearch />
          </div>

          {/* Store location cards carousel: always show 4 branches from config with images */}
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
              <Link href="/find-store">Find a <span className="font-accent italic text-[1.1em]">store</span></Link>
            </Button>
          </div>
        </Container>
      </section>
      </AnimateOnScroll>

      {/* Enjoy the freshest — floating product boxes, grey bg, scroll parallax */}
      <AnimateOnScroll>
      <EnjoyFreshestSection />
      </AnimateOnScroll>

      {/* Crafted with love — in-house collections */}
      <AnimateOnScroll delay={80}>
      <section className="full-bleed bg-white py-16">
        <Container className="w-full max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-8">
            Crafted with <span className="font-accent italic text-[1.1em]">love</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-xl mx-auto mb-8">
            Discover our in-house collections and daily essentials.
          </p>
          <div className="w-full min-w-0 overflow-x-auto pb-4">
            <div className="flex gap-4">
              {["Premium Staples", "Value Staples", "Cleaning", "Fun Foods", "Ready to Eat", "Daily Needs"].map((label) => (
                <div key={label} className="wireframe shrink-0 w-40 h-44 rounded-xl">{label}</div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      </AnimateOnScroll>

      {/* Happy customers / testimonials */}
      <AnimateOnScroll delay={100}>
      <section className="full-bleed py-16 bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">
              Happy <span className="font-accent italic text-[1.1em]">customers</span>
            </h2>
            <p className="mt-2 text-muted-foreground">Join us on this journey built on trust and satisfaction.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="wireframe aspect-video rounded-xl">Customer photo</div>
            <div className="space-y-4">
              <p className="text-muted-foreground italic">
                &ldquo;Great experience shopping here. Clean, well-organized, and fully stocked. Checkout is quick and efficient.&rdquo;
              </p>
              <p className="font-semibold text-black">— Happy Customer</p>
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
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} compact />
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
