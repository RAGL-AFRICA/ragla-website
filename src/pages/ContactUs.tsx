import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, MapPin, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ContactUs = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([form]);

      if (error) throw error;

      toast({ 
        title: "Message sent!", 
        description: "Thank you for reaching out. We will get back to you soon." 
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
       toast({ 
        title: "Error sending message", 
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="section-padding bg-secondary">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Contact Us</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-foreground font-semibold text-lg mb-1">Phone Number</h3>
                <p className="text-muted-foreground">+233 (0)256257507</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-foreground font-semibold text-lg mb-1">Location Address</h3>
                <p className="text-muted-foreground">GA – 334 – 8177<br />2nd Bissau Street,<br />East Legon,<br />Accra – Ghana</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-foreground font-semibold text-lg mb-1">Email Address</h3>
                <p className="text-muted-foreground">Info@ragl-africa.org</p>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-card rounded-xl h-48 flex items-center justify-center card-shadow">
              <p className="text-muted-foreground text-sm">Map will be displayed here</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Your name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <textarea
                placeholder="Your message (optional)"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:brightness-110 transition-all uppercase tracking-wider text-sm w-full disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
