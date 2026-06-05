import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  Globe,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "courses", label: "Courses", icon: GraduationCap },
  { id: "cpd", label: "CPD Programmes", icon: TrendingUp },
  { id: "executive", label: "Executive Education", icon: Briefcase },
  { id: "online", label: "Online Learning", icon: Globe },
];

const activeCourse = {
  code: "RPCSGL",
  title: "Royal Professional Certificate in Strategic Governance & Leadership",
  level: "Professional Certificate",
  duration: "8 Weeks",
  mode: "Weekends / Online / Executive In-Person (Intense)",
  description:
    "A highly demanding, pragmatic, experiential, and internationally competitive Curated Executive Education Programme intended to equip participants with the right concepts, knowledge, tools, and practical leadership insights needed to achieve sustained excellence in leadership and governance responsibilities.",
  topics: [
    "Governance Principles & Institutional Leadership",
    "Strategic Leadership & Organizational Performance",
    "Ethical Decision-Making & Compliance",
    "Team Leadership & Stakeholder Management",
    "Digital-Age Leadership & Innovation",
    "Executive Capstone Project",
  ],
};

const comingSoonCourses = [
  { title: "Course 2" },
  { title: "Course 3" },
  { title: "Course 4" },
  { title: "Course 5" },
];

const cpdProgrammes = [
  {
    icon: Star,
    title: "Annual CPD Seminar Series",
    description:
      "A curated calendar of monthly evening seminars and webinars featuring expert guest speakers from government, business, and academia.",
    hours: "40 CPD hrs / year",
    format: "Virtual & Physical",
  },
  {
    icon: Shield,
    title: "Ethics & Compliance Masterclass",
    description:
      "Intensive one-day workshops on professional ethics, regulatory compliance, and maintaining integrity in leadership roles.",
    hours: "8 CPD hrs per session",
    format: "In-Person Workshop",
  },
  {
    icon: Globe,
    title: "Pan-African Governance Forum",
    description:
      "An annual flagship conference bringing together governance thought leaders, policymakers, and practitioners across the continent.",
    hours: "16 CPD hrs",
    format: "Annual Conference",
  },
  {
    icon: BookOpen,
    title: "Digital Transformation in Leadership",
    description:
      "A focused short course on leveraging technology, data analytics, and AI for informed governance and leadership decision-making.",
    hours: "12 CPD hrs",
    format: "Online Course",
  },
];

const executivePrograms = [
  {
    title: "Executive Leadership Retreat",
    subtitle: "For C-Suite & Board Members",
    duration: "3 Days",
    location: "Accra, Ghana | Nairobi, Kenya | Abuja, Nigeria",
    description:
      "An immersive residential retreat designed for top executives seeking strategic clarity, peer exchange, and renewal of leadership purpose in an exclusive setting.",
    highlights: [
      "Peer learning circles with top executives",
      "Expert-facilitated strategy sessions",
      "Exclusive networking dinners",
      "Personalised leadership coaching",
    ],
  },
  {
    title: "Board Governance Intensive",
    subtitle: "For Board Directors & Company Secretaries",
    duration: "2 Days",
    location: "Available across ECOWAS & East Africa",
    description:
      "A highly practical, case-study-driven intensive for serving board members, covering fiduciary duties, board dynamics, and current regulatory requirements.",
    highlights: [
      "Real-world case studies",
      "Regulatory compliance deep-dive",
      "Board performance evaluation tools",
      "Post-programme mentoring",
    ],
  },
  {
    title: "Senior Public Sector Leadership Programme",
    subtitle: "For Directors-General & Permanent Secretaries",
    duration: "5 Days",
    location: "Pan-African Locations",
    description:
      "A structured executive programme blending academic rigour with practical statecraft, designed for those at the apex of public administration.",
    highlights: [
      "Policy design & implementation",
      "Public financial management",
      "Intergovernmental relations",
      "Leadership legacy planning",
    ],
  },
];

const levelColors: Record<string, string> = {
  Certificate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Professional Certificate": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Advanced Certificate": "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "Postgraduate Diploma": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Chartered: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const OverviewSection = () => (
  <div className="space-y-16">
    {/* Intro */}
    <div className="text-center max-w-3xl mx-auto">
      <p className="text-muted-foreground text-lg leading-relaxed">
        RAGLA's Programmes division delivers world-class governance and leadership education across Africa.
        From foundational certificates to chartered professional qualifications, our offerings are designed
        to meet professionals at every stage of their career.
      </p>
    </div>

    {/* Featured Programme */}
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-card card-shadow rounded-3xl p-8 md:p-12 border border-border/50">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6 inline-block">
              FEATURED PROGRAMME
            </span>
            <h2 className="text-3xl font-black text-foreground mb-4 leading-tight">
              Royal Professional Certificate in Strategic Governance & Leadership
            </h2>
            <p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
              Equip yourself with the tools, knowledge, and practical insights needed to achieve sustained excellence in leadership and governance responsibilities across Africa.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground bg-secondary px-3 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-primary" /> 8 Weeks
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground bg-secondary px-3 py-2 rounded-xl">
                <Globe className="w-4 h-4 text-primary" /> Hybrid Delivery
              </div>
            </div>
            <Link
              to="/programmes/rpcsgl"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:brightness-110 transition-all text-sm group"
            >
              Learn More About RPCSGL <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-secondary/50 overflow-hidden flex items-center justify-center">
               <GraduationCap className="w-24 h-24 text-primary/20" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background card-shadow rounded-2xl p-6 hidden md:block border border-border/50">
              <p className="text-2xl font-black text-primary">Now</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Enrolling</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { value: "6+", label: "Courses Offered" },
        { value: "3", label: "Executive Programmes" },
        { value: "40+", label: "CPD Hours / Year" },
        { value: "5", label: "African Countries" },
      ].map((stat) => (
        <div key={stat.label} className="bg-card card-shadow rounded-2xl p-6 text-center">
          <p className="text-4xl font-black text-primary">{stat.value}</p>
          <p className="text-muted-foreground text-sm mt-1 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Why RAGLA */}
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
        Why Choose RAGLA Programmes?
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Award,
            title: "Accredited Qualifications",
            desc: "Our certificates and diplomas are recognised by leading professional bodies across Africa.",
          },
          {
            icon: Users,
            title: "Expert Faculty",
            desc: "Learn from practitioners — senior executives, former ministers, and renowned academics.",
          },
          {
            icon: Globe,
            title: "Pan-African Network",
            desc: "Connect with a diverse cohort of professionals from across the continent.",
          },
          {
            icon: Clock,
            title: "Flexible Delivery",
            desc: "All programmes are available weekends, online, or Executive In-Person (Intense) format to suit your schedule.",
          },
          {
            icon: TrendingUp,
            title: "Career Impact",
            desc: "Graduates report measurable advancement in their governance and leadership roles.",
          },
          {
            icon: Shield,
            title: "Ethical Foundation",
            desc: "Every programme is grounded in RAGLA's Code of Ethics and Professional Standards.",
          },
        ].map((item) => (
          <div key={item.title} className="bg-card card-shadow rounded-2xl p-6 flex gap-4">
            <div className="bg-primary/10 p-3 rounded-xl h-fit">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CoursesSection = () => (
  <div className="space-y-8">
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Our Courses</h2>
      <p className="text-muted-foreground">
        Structured professional programmes from introductory certificates to our prestigious Chartered qualification.
      </p>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      {/* Active Course */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card card-shadow rounded-2xl p-6 flex flex-col relative overflow-hidden"
      >
        <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
          Available Now
        </span>
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-primary/10 p-2.5 rounded-xl flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-primary font-bold text-xs tracking-wider">{activeCourse.code}</p>
            <h3 className="text-foreground font-bold text-lg leading-tight mt-0.5">{activeCourse.title}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColors[activeCourse.level] || "bg-secondary text-foreground"}`}>
            {activeCourse.level}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {activeCourse.duration}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-foreground">
            {activeCourse.mode}
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{activeCourse.description}</p>

        <div className="mb-5 flex-1">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Key Topics</p>
          <ul className="space-y-1.5">
            {activeCourse.topics.map((t) => (
              <li key={t} className="flex items-start gap-2 text-muted-foreground text-sm">
                <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/programmes/rpcsgl"
          className="mt-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
        >
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Coming Soon Cards */}
      {comingSoonCourses.map((course, idx) => (
        <motion.div
          key={course.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (idx + 1) * 0.06 }}
          className="bg-card card-shadow rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[280px] border border-dashed border-border"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-secondary/10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-muted p-3 rounded-2xl mb-4">
              <GraduationCap className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <h3 className="text-foreground/70 font-bold text-lg mb-2 max-w-[220px] leading-tight">
              {course.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full">
              <Clock className="w-3 h-3" />
              Coming Soon
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ComingSoonPlaceholder = ({ category }: { category: string }) => (
  <div className="py-20 flex flex-col items-center justify-center text-center">
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
      <BookOpen className="w-10 h-10 text-primary" />
    </div>
    <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Coming Soon</h3>
    <p className="text-muted-foreground max-w-lg">
      We are currently curating specialized {category} programmes to meet the highest standards of governance and leadership excellence across Africa.
    </p>
    <div className="mt-8 flex gap-4">
       <div className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-lg shadow-primary/40" style={{ animationDelay: '0ms' }} />
       <div className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-lg shadow-primary/40" style={{ animationDelay: '150ms' }} />
       <div className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-lg shadow-primary/40" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

const CPDSection = () => <ComingSoonPlaceholder category="CPD" />;
const ExecutiveSection = () => <ComingSoonPlaceholder category="Executive Education" />;
const OnlineSection = () => <ComingSoonPlaceholder category="Online Learning" />;

// ─── Main Page ────────────────────────────────────────────────────────────────

const Programmes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const setTab = (id: string) => {
    setSearchParams({ tab: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "courses":
        return <CoursesSection />;
      case "cpd":
        return <CPDSection />;
      case "executive":
        return <ExecutiveSection />;
      case "online":
        return <OnlineSection />;
      default:
        return <OverviewSection />;
    }
  };

  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || BookOpen;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Programmes | RAGLA – Royal Academy of Governance & Leadership Africa</title>
        <meta
          name="description"
          content="Explore RAGLA's programmes: certified courses, CPD seminars, executive education retreats, and online learning — all focused on governance and leadership excellence in Africa."
        />
        <link rel="canonical" href="https://ragl-africa.org/programmes" />
      </Helmet>
      <Header />

      {/* Hero */}
      <section className="section-padding bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="container-main text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">RAGLA PROGRAMMES</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 leading-[1.1] uppercase tracking-tighter">
              EXECUTIVE EDUCATION & <br className="hidden md:block" />
              <span className="text-primary">CAPACITY BUILDING</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional development designed to shape Africa's most capable and principled leaders —
              at every stage of your career journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-[60px] lg:top-[72px] z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container-main">
          <div className="flex overflow-x-auto scrollbar-hide gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`programmes-tab-${tab.id}`}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0
                  ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <section className="section-padding">
        <div className="container-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-padding bg-primary">
        <div className="container-main text-center text-primary-foreground">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Advance Your Career?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-sm">
            Apply to a RAGLA programme today and join hundreds of governance and leadership professionals
            across Africa pursuing excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/programmes/apply-rpcsgl"
              className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all text-sm"
            >
              Apply Now
            </Link>
            <Link
              to="/contact-us"
              className="border-2 border-white/50 text-white px-8 py-3 rounded-full font-bold hover:border-white hover:bg-white/10 transition-all text-sm"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programmes;
