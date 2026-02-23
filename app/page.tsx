import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { getProducts } from "@/features/products/actions";
import { getBranches } from "@/lib/dal";
import { ProductCard } from "@/features/products/product-card";
import { HeroBranchCarousel } from "@/features/home/HeroBranchCarousel";
import { EnjoyFreshestSection } from "@/features/home/EnjoyFreshestSection";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

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
      <section className="full-bleed -mt-8 relative min-h-[90vh] flex flex-col overflow-hidden">
        {/* Background: image area (wireframe for now — replace with real image later) */}
        <div
          className="absolute inset-0 wireframe flex items-center justify-center text-neutral-500"
          aria-hidden
        >
          <span className="text-base">Hero background image</span>
        </div>
        <div className="hero-overlay" aria-hidden />

        {/* Top right: nav pills + Explore card */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Link href="/products" className="hero-nav-pill">
            Products
          </Link>
          <Link href="/select-branch" className="hero-nav-pill">
            Find a store
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-1.5 rounded-full bg-black/70 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/85"
          >
            Explore more
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Left: App teaser (glass panel) */}
        <div className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
          <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-md">
            <p className="text-xs font-medium uppercase tracking-wider text-white/90">App</p>
            <div className="mt-2 wireframe aspect-[9/16] w-28 rounded-xl">App</div>
          </div>
        </div>

        {/* Main hero content: headline, subtitle, search bar, store cards */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-10 text-center sm:pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-white opacity-0 animate-hero-fade-in-up sm:text-5xl md:text-6xl lg:text-7xl">
            Your
            <br />
            <span className="text-white">{siteConfig.name}</span>
          </h1>
          <p
            className="mt-3 text-lg text-white/95 opacity-0 animate-hero-fade-in-up sm:text-xl"
            style={{ animationDelay: "0.1s" }}
          >
            Get more of life with {siteConfig.name}
          </p>

          {/* Search bar + Find A Store button (glassmorphism, single pill) */}
          <div
            className="hero-search-glass mt-6 flex h-12 w-full max-w-2xl items-stretch overflow-hidden opacity-0 animate-hero-fade-in-up sm:max-w-xl sm:h-14"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/select-branch"
              className="flex min-w-0 flex-1 items-center gap-3 px-4 text-left text-white/90 sm:px-5"
            >
              <Search className="h-5 w-5 shrink-0 text-white/80" />
              <span className="truncate text-sm sm:text-base">
                Search for stores, area, city or PIN
              </span>
            </Link>
            <Button
              asChild
              className="h-full min-w-0 shrink-0 rounded-none rounded-r-full border-0 bg-primary px-5 font-semibold text-primary-foreground shadow-none hover:bg-primary/90 sm:px-6"
            >
              <Link href="/select-branch" className="flex h-full items-center justify-center">
                Find A Store
              </Link>
            </Button>
          </div>

          {/* Store location cards carousel: 3 visible, arrows, no scrollbar */}
          {branches.length > 0 && <HeroBranchCarousel branches={branches} />}
        </div>
      </section>

      {/* Find a store — store images wireframes */}
      <section className="full-bleed py-16">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-8">Find a store</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="wireframe aspect-[4/3] rounded-xl">Store {i}</div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/select-branch">Find a store</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Membership / rewards */}
      <section className="full-bleed bg-primary py-16 text-primary-foreground">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              The world&apos;s best grocery membership
            </h2>
            <p className="mt-4 text-primary-foreground/90">
              Earn points and cashback on every order. Redeem anytime you like.
            </p>
            <Button asChild size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 border-0">
              <Link href="/select-branch">Explore</Link>
            </Button>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="wireframe w-full max-w-sm aspect-[3/2] rounded-xl bg-white/20 border-white/40 text-white/90">Membership card</div>
          </div>
        </Container>
      </section>

      {/* Enjoy the freshest — floating product boxes, grey bg, scroll parallax */}
      <EnjoyFreshestSection />

      {/* Crafted with love — in-house collections */}
      <section className="full-bleed bg-muted/40 py-16">
        <Container className="w-full max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-8">
            Crafted with love
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

      {/* Happy customers / testimonials */}
      <section className="full-bleed py-16 bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">
              Happy customers
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

      {/* Featured products — keep existing behaviour */}
      <section className="full-bleed border-t bg-muted/30 py-16">
        <Container>
          <h2 className="text-2xl font-bold text-black mb-6">Featured products</h2>
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
    </div>
  );
}
