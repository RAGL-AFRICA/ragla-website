import Header from "@/components/Header";
import Footer from "@/components/Footer";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

const Gallery = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="section-padding bg-secondary">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Gallery</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden card-shadow aspect-square">
                <img src={img} alt={`Gallery image ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
