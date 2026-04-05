import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ragla_portal_saved_state_v1";

const Apply = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [iframeHeight, setIframeHeight] = useState("850px");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Prevent arbitrary messages from causing errors
      if (!event.data || !event.data.type) return;

      const { type, payload } = event.data;

      // 1. Handle Successful Application Submission
      if (type === 'ADMISSIONS_SUCCESS') {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // 2. Handle Dynamic Height Resize from Widget
      if (type === 'SET_HEIGHT' && event.data.height) {
        setIframeHeight(`${event.data.height}px`);
      }

      // 3. Save form data when user types in the iframe
      if (type === "SAVE_APPLICATION_STATE") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
          console.warn("Parent website failed to save widget state:", e);
        }
      }

      // 4. Clear saved data when user successfully submits
      if (type === "CLEAR_APPLICATION_STATE") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.warn("Parent website failed to clear widget state.");
        }
      }

      // 5. Restore saved data when iframe finishes loading
      if (type === "WIDGET_READY") {
        try {
          const savedData = localStorage.getItem(STORAGE_KEY);
          if (savedData) {
            const iframe = document.getElementById("ragla-admissions-widget") as HTMLIFrameElement;
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage({
                type: "RESTORE_APPLICATION_STATE",
                payload: JSON.parse(savedData)
              }, "*");
            }
          }
        } catch (e) {
          console.warn("Parent website failed to restore widget state:", e);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Apply for Membership | RAGLA Application Portal</title>
        <meta name="description" content="Start your journey towards professional excellence in governance and leadership. Complete the RAGLA membership application process online." />
        <link rel="canonical" href="https://ragl-africa.org/apply" />
      </Helmet>
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-secondary/30">
        <div className="container-main max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3 text-yellow-600">Membership Portal</p>
            <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">Apply for Membership</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              Join the Royal Academy of Governance and Leadership Africa. Complete the application below to start your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="pb-24 -mt-8 relative z-10">
        <div className="container-main max-w-5xl mx-auto px-2 md:px-4">
          <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden shadow-primary/5 min-h-[500px] flex items-center justify-center bg-white">
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                // --- THE WIDGET ---
                <motion.div 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full"
                >
                  <iframe 
                    // Make sure to update this with your actual student portal production URL
                    src="https://student.ragl-africa.org/apply?widget=true" 
                    style={{ 
                      width: '100%', 
                      height: iframeHeight, 
                      border: 'none', 
                      transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'block'
                    }}
                    id="ragla-admissions-widget"
                    title="RAGLA Membership Application"
                    scrolling="no"
                  />
                </motion.div>
              ) : (
                // --- SUCCESS VIEW (On Parent Site) ---
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 px-6 max-w-md mx-auto"
                >
                  <div className="h-20 w-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-black mb-4">Submission Received</h2>
                  <p className="text-muted-foreground mb-8">
                    Your official application has been recorded. Our board will review your credentials and send your <strong>Student ID</strong> and portal link via email.
                  </p>
                  <Button size="lg" className="w-full h-14 rounded-xl font-bold bg-black text-white hover:bg-zinc-800" onClick={() => window.location.href = '/'}>
                    Return to Home
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Apply;
