import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

/* ─────────────────────────────────────────────
   Animated wave layer – pure SVG path animation
   Each wave uses offset timing for natural flow
───────────────────────────────────────────────*/
const WaveLayer = ({
  opacity,
  speed,
  delay,
  yOffset,
  color,
}: {
  opacity: number;
  speed: number;
  delay: number;
  yOffset: number;
  color: string;
}) => (
  <div
    className="absolute bottom-0 left-0 w-full overflow-hidden"
    style={{ height: 160, transform: `translateY(${yOffset}px)` }}
  >
    <svg
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "200%",
        height: "100%",
        opacity,
        animation: `waveScroll ${speed}s linear ${delay}s infinite`,
      }}
    >
      <path
        d="M0,80 C120,120 240,40 360,80 C480,120 600,40 720,80 C840,120 960,40 1080,80 C1200,120 1320,40 1440,80 L1440,160 L0,160 Z"
        fill={color}
      />
      <path
        d="M1440,80 C1320,120 1200,40 1080,80 C960,120 840,40 720,80 C600,120 480,40 360,80 C240,120 120,40 0,80 L0,160 L1440,160 Z"
        fill={color}
        opacity={0.5}
      />
    </svg>
  </div>
);

/* Floating ambient glow orb */
const FloatingOrb = ({
  size,
  cx,
  cy,
  duration,
  delay,
  color,
}: {
  size: number;
  cx: string;
  cy: string;
  duration: number;
  delay: number;
  color: string;
}) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: cx,
      top: cy,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: "blur(40px)",
      animation: `orbFloat ${duration}s ease-in-out ${delay}s infinite`,
      opacity: 0.35,
    }}
  />
);

/* ─────────────────────────────────────────────
   Wavy Motto – SVG textPath following a wave
   Matches the hand-drawn concept
───────────────────────────────────────────────*/
const WavyMotto = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="relative h-24 w-[320px] sm:w-[420px] mb-6"
  >
    <svg viewBox="0 0 600 130" className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]">
      <defs>
        <linearGradient id="mottoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(45,93%,65%)">
            <animate attributeName="stop-color" values="hsl(45,93%,65%); hsl(45,93%,45%); hsl(45,93%,65%)" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="hsl(45,93%,45%)">
            <animate attributeName="stop-color" values="hsl(45,93%,45%); hsl(45,93%,75%); hsl(45,93%,45%)" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="hsl(45,93%,75%)">
            <animate attributeName="stop-color" values="hsl(45,93%,75%); hsl(45,93%,55%); hsl(45,93%,75%)" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        
        {/* The Wave Path: Hump -> Valley -> Hump */}
        <path
          id="mottoPath"
          d="M 20,65 C 70,15 150,15 200,65 C 250,115 330,115 380,65 C 430,15 510,15 560,65"
          fill="transparent"
        />
      </defs>

      {/* Decorative faint shadow path */}
      <path
        d="M 22,67 C 72,17 152,17 202,67 C 252,117 332,117 382,67 C 432,17 512,17 562,67"
        fill="transparent"
        stroke="black"
        strokeWidth="4"
        opacity="0.3"
        filter="blur(4px)"
      />

      {/* The main wavy line from the drawing */}
      <motion.path
        d="M 20,65 C 70,15 150,15 200,65 C 250,115 330,115 380,65 C 430,15 510,15 560,65"
        fill="transparent"
        stroke="url(#mottoGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      <text 
        className="font-black uppercase tracking-[0.05em]" 
        textAnchor="middle"
        style={{ fontSize: '24px', fontFamily: "'Inter', sans-serif" }}
      >
        <textPath href="#mottoPath" startOffset="50%">
          <tspan fill="url(#mottoGradient)">Servitium</tspan>
          <tspan dx="30" fill="url(#mottoGradient)">Integritas</tspan>
          <tspan dx="30" fill="url(#mottoGradient)">Phasellus</tspan>
        </textPath>
      </text>
    </svg>
    
    {/* Ambient sparkle element */}
    <motion.div 
      className="absolute -top-2 left-1/4 w-1 h-1 bg-yellow-400 rounded-full"
      animate={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
    />
    <motion.div 
      className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full"
      animate={{ scale: [0, 1.2, 0], opacity: [0, 0.6, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay: 2.5 }}
    />
  </motion.div>
);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <>
      {/* Inject wave keyframes once */}
      <style>{`
        @keyframes waveScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(18px, -24px) scale(1.08); }
          66%       { transform: translate(-14px, 14px) scale(0.94); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden"
      >
        {/* ── Parallax background image ── */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
          <img
            src={heroBg}
            alt="RAGLA Leadership"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* ── Dark gradient overlay ── */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/65 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* ── Floating ambient orbs ── */}
        <FloatingOrb size={520} cx="8%"  cy="10%" duration={12} delay={0}   color="hsl(45,93%,47%)" />
        <FloatingOrb size={360} cx="60%" cy="55%" duration={16} delay={3}   color="hsl(200,80%,50%)" />
        <FloatingOrb size={280} cx="78%" cy="5%"  duration={10} delay={1.5} color="hsl(45,93%,47%)" />
        <FloatingOrb size={200} cx="40%" cy="70%" duration={14} delay={5}   color="hsl(160,70%,40%)" />

        {/* ── Content ── */}
        <div className="container-main relative z-10 grid md:grid-cols-2 gap-6 md:gap-12 items-center py-10 sm:py-14 md:py-28">

          {/* Left: headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Wavy motto replaces flat badge */}
            <WavyMotto />

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[4rem] font-black text-white leading-[1.12] tracking-tight">
              Topnotch Pan-Africa{" "}
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-500">
                Governance and Leadership
              </span>{" "}
              Academy.
            </h1>
          </motion.div>

          {/* Right: description + CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-6 md:gap-8 md:pl-10 lg:pl-16 md:border-l border-white/10"
          >
            <p className="text-white/75 text-base sm:text-lg md:text-xl leading-relaxed font-medium">
              The{" "}
              <strong className="text-white">
                Royal Academy of Governance and Leadership Africa (RAGLA)
              </strong>{" "}
              is dedicated to fostering the highest standards of excellence
              across the continent.
            </p>

            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/apply"
                className="relative overflow-hidden group bg-primary text-primary-foreground text-center py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-primary/40 transition-all duration-300 uppercase tracking-wider text-xs sm:text-sm flex-1"
              >
                <span className="relative z-10">Apply for Membership</span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                to="/about-us"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 text-center py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-bold hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider text-xs sm:text-sm flex-1"
              >
                Discover RAGLA
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── Animated water waves at the bottom ── */}
        {/* Wave 4 – darkest base, slowest */}
        <WaveLayer
          color="hsl(0,0%,5%)"
          opacity={1}
          speed={18}
          delay={0}
          yOffset={12}
        />
        {/* Wave 3 */}
        <WaveLayer
          color="hsl(0,0%,7%)"
          opacity={0.85}
          speed={14}
          delay={-4}
          yOffset={4}
        />
        {/* Wave 2 – mid gold tint */}
        <WaveLayer
          color="hsl(45,93%,10%)"
          opacity={0.7}
          speed={10}
          delay={-2}
          yOffset={-10}
        />
        {/* Wave 1 – lightest, fastest (front) */}
        <WaveLayer
          color="hsl(45,50%,14%)"
          opacity={0.55}
          speed={7}
          delay={-1}
          yOffset={-22}
        />

        {/* Fine ripple line on top of waves */}
        <div
          className="absolute bottom-0 left-0 w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(45,93%,47%) 30%, hsl(45,93%,60%) 50%, hsl(45,93%,47%) 70%, transparent 100%)",
            opacity: 0.4,
          }}
        />
      </section>
    </>
  );
};

export default HeroSection;
