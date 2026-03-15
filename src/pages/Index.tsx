import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UpcomingSection from "@/components/UpcomingSection";
import AboutSection from "@/components/AboutSection";
import MembershipSection from "@/components/MembershipSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <UpcomingSection />
      <AboutSection />
      <MembershipSection />
      <GallerySection />
      <Footer />
    </div>
  );
};

export default Index;
