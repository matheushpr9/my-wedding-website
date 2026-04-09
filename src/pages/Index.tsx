import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RSVPSection from "@/components/RSVPSection";
import VenueSection from "@/components/VenueSection";
import PhotosSection from "@/components/PhotosSection";
import GiftListSection from "@/components/GiftListSection";
import GuestGuideSection from "@/components/GuestGuideSection";
import VerseSection from "@/components/VerseSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Header />
    <main>
      <HeroSection />
      <RSVPSection />
      <VenueSection />
      <PhotosSection />
      <GiftListSection />
      <GuestGuideSection />
      <VerseSection />
    </main>
    <Footer />
  </>
);

export default Index;
