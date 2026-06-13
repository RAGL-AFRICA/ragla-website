import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Award, ShieldCheck, Globe, Star } from "lucide-react";

const AmbassadorHighlight = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-[#000714] via-[#00122e] to-[#000714] border-y border-primary/10">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Announcement</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight uppercase">
              Welcoming Our Strategic Partner <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-500">
                & Global Ambassador
              </span>
            </h2>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase">
                Amb. (Dr.) Smily Mukta Ghoshal
              </h3>
              <p className="text-xs uppercase tracking-widest text-primary font-bold">
                Founder & CEO, #1 Natural Beauty Organic Skin & Hair Products, USA
              </p>
            </div>

            <p className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium italic border-l-2 lg:border-l-4 border-primary/40 pl-4 lg:pl-6 py-1">
              "We are delighted to partner with a globally respected thought leader whose vision, values, and commitment to sustainable impact strongly align with our mission of developing principled leaders and strengthening governance institutions across Africa and beyond."
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 pt-2 text-left">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Ethical Governance</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Global Leadership</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/global-ambassador"
                className="inline-flex items-center justify-center gap-3 bg-primary text-[#00122e] h-14 px-8 rounded-xl font-black uppercase tracking-[0.15em] text-xs shadow-lg shadow-primary/10 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                Read Executive Profile
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[360px] aspect-[4/5]">
              {/* Decorative Frame Elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 rounded-[2.5rem] blur-sm -m-2 pointer-events-none" />
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-3xl pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-3xl pointer-events-none" />
              
              {/* Main Image Container */}
              <div className="w-full h-full rounded-[2rem] overflow-hidden border-2 border-primary/30 bg-[#001a3d] p-3 shadow-2xl relative">
                <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                  <img
                    src="/smily-mukta-ghoshal.jpg"
                    alt="Amb. (Dr.) Smily Mukta Ghoshal"
                    className="w-full h-full object-cover grayscale-[0.15] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Small badge inside image */}
                  <div className="absolute bottom-4 left-4 bg-primary text-[#00122e] px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-md flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-[#00122e]" />
                    Global Ambassador
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AmbassadorHighlight;
