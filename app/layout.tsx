import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { HeaderWithMobileNav } from "@/components/layout/HeaderWithMobileNav";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { PageContentTransition } from "@/components/layout/PageContentTransition";
import { AnimateOnScroll } from "@/components/layout/AnimateOnScroll";
import { Toaster } from "@/components/ui/toaster";
import { CartDrawer } from "@/features/cart/CartDrawer";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorVars = [
    siteConfig.colors.primary != null && `--primary: ${siteConfig.colors.primary}`,
    siteConfig.colors.primaryForeground != null && `--primary-foreground: ${siteConfig.colors.primaryForeground}`,
    siteConfig.colors.accent != null && `--accent: ${siteConfig.colors.accent}`,
    siteConfig.colors.accentForeground != null && `--accent-foreground: ${siteConfig.colors.accentForeground}`,
  ].filter(Boolean);

  return (
    <html lang="en">
      <head>
        {siteConfig.faviconUrl && (
          <link rel="icon" href={siteConfig.faviconUrl} />
        )}
        {colorVars.length > 0 && (
          <style
            dangerouslySetInnerHTML={{
              __html: `:root { ${colorVars.join("; ")} }`,
            }}
          />
        )}
      </head>
      <body className={`${inter.className} ${playfair.variable} flex min-h-screen flex-col`}>
        <a
          href="#main-content"
          className="absolute left-[-9999px] top-4 z-[100] rounded-md bg-primary px-4 py-2 text-primary-foreground focus:left-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <HeaderWithMobileNav />
        <main id="main-content" className="flex-1 pt-6 sm:pt-8 pb-10 sm:pb-14" role="main">
          <PageContentTransition>
            <Container>
              <AnimateOnScroll>{children}</AnimateOnScroll>
            </Container>
          </PageContentTransition>
        </main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
