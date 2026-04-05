import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UpcomingSection from "@/components/UpcomingSection";
import AboutSection from "@/components/AboutSection";
import FeaturedSection from "@/components/FeaturedSection";
import MembershipSection from "@/components/MembershipSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>RAGLA - Royal Academy of Governance and Leadership Africa</title>
        <meta name="description" content="RAGLA is a top-notch Pan-African professional Academy dedicated to fostering the highest standards of excellence in governance and leadership in Africa." />
        <link rel="canonical" href="https://ragl-africa.org/" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "RAGLA",
              "alternateName": "Royal Academy of Governance and Leadership Africa",
              "url": "https://ragl-africa.org/",
              "logo": "https://ragl-africa.org/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+233 (0)256257507",
                "contactType": "customer service",
                "areaServed": "Africa",
                "availableLanguage": "English"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "2nd Bissau Street, East Legon",
                "addressLocality": "Accra",
                "addressRegion": "Greater Accra",
                "postalCode": "GA – 334 – 8177",
                "addressCountry": "Ghana"
              },
              "sameAs": [
                "https://www.facebook.com/raglafb",
                "https://twitter.com/raglatw",
                "https://www.instagram.com/raglains"
              ]
            }
          `}
        </script>
      </Helmet>
      <Header />
      <HeroSection />
      <UpcomingSection />
      <AboutSection />
      <FeaturedSection />
      <MembershipSection />
      <GallerySection />
      <Footer />
    </div>
  );
};

export default Index;
