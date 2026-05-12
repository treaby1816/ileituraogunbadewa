import type { Metadata } from "next";
import {
  Playfair_Display,
  DM_Sans,
  Cinzel,
  Cormorant_Garamond,
} from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Chatbot } from "@/components/ui/Chatbot";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["400", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans-family",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel-family",
  weight: ["400", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ileitura.vercel.app"),
  title: {
    default: "Ilé Ìtura Ògúnbádéwà | Luxury Hotel in Ikorodu Lagos",
    template: "%s | Ilé Ìtura Ògúnbádéwà",
  },
  description:
    "Experience rest, relaxation and exceptional hospitality at Ilé Ìtura Ògúnbádéwà — a luxury hotel and relaxation centre in Ikorodu, Lagos State, Nigeria.",
  keywords: [
    "hotel ikorodu",
    "lagos hotel",
    "relaxation centre ikorodu",
    "luxury hotel lagos nigeria",
    "ile itura ogunbadewa",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Ilé Ìtura Ògúnbádéwà",
  },
};

const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Ilé Ìtura Ògúnbádéwà",
  description:
    "Luxury hotel and relaxation centre in Ikorodu, Lagos State, Nigeria.",
  url: "https://ileitura.vercel.app",
  telephone: ["+2348129041015", "+2348060721283"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Saheed Anibaba Street, Off Obafemi Awolowo Way (Near Grammar School / Baba Ijebu)",
    addressLocality: "Ikorodu",
    addressRegion: "Lagos",
    addressCountry: "NG",
  },
  priceRange: "₦₦",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Bar & Lounge", value: true },
    { "@type": "LocationFeatureSpecification", name: "Car Park", value: true },
    { "@type": "LocationFeatureSpecification", name: "24/7 Security", value: true },
    { "@type": "LocationFeatureSpecification", name: "Recreation Area", value: true },
  ],
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import DynamicChatbot from "@/components/ui/DynamicChatbot";
import { PostHogProvider } from "@/components/PostHogProvider";
import PostHogPageView from "@/components/PostHogPageView";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NG"
      className={`${playfair.variable} ${dmSans.variable} ${cinzel.variable} ${cormorant.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
        />
      </head>
      <body className="bg-forest-black text-cream font-dm-sans antialiased">
        <PostHogProvider>
          <ThemeProvider>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            <Navbar />
            {children}
            <Footer />
            <ScrollToTop />
            <DynamicChatbot />
            <WhatsAppButton />
            <Toaster position="bottom-center" toastOptions={{ style: { background: "#0D1A0D", color: "#F8F4E8", border: "1px solid rgba(201,168,76,0.2)" } }} />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
