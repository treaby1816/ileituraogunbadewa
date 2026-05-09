import { HeroSection } from "@/components/sections/HeroSection";
import { WelcomeStrip } from "@/components/sections/WelcomeStrip";
import { AmenitiesGrid } from "@/components/sections/AmenitiesGrid";
import { RoomsTeaser } from "@/components/sections/RoomsTeaser";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { GalleryTeaser } from "@/components/sections/GalleryTeaser";
import { BookingStrip } from "@/components/sections/BookingStrip";
import { LocationMap } from "@/components/sections/LocationMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ilé Ìtura Ògúnbádéwà | Luxury Hotel in Ikorodu Lagos",
  description:
    "Experience rest, relaxation and exceptional hospitality at Ilé Ìtura Ògúnbádéwà — a luxury hotel and relaxation centre in Ikorodu, Lagos State, Nigeria.",
  openGraph: {
    title: "Ilé Ìtura Ògúnbádéwà | Luxury Hotel in Ikorodu Lagos",
    description: "Embrace Comfort, Enjoy Luxury. Rooms from ₦15,000/night.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WelcomeStrip />
      <AmenitiesGrid />
      <RoomsTeaser />
      <WhyChooseUs />
      <Testimonials />
      <GalleryTeaser />
      <BookingStrip />
      <LocationMap />
    </main>
  );
}
