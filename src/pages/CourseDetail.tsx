import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Clock,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Award,
  Shield,
  Globe,
  Briefcase,
  Target,
  ChevronDown,
  Scale,
  Compass,
  Landmark,
  UserRound,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  TrendingUp,
  MonitorPlay,
  Lightbulb,
  FolderOpen,
  Network,
  Mic2,
  UserCheck
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// ─── Curriculum Data ──────────────────────────────────────────────────────────

const curriculum = [
  {
    week: "Week 1",
    title: "Foundations of Governance and Leadership",
    topics: [
      "Introduction to Governance",
      "Leadership vs Management",
      "Principles of Corporate and Institutional Governance",
      "Structures of Governance and Accountability",
      "Theories and Styles of Leadership",
      "Board–Management Relationships",
      "Institutional Integrity and Trust",
    ],
    activities: [
      "Leadership Self-Assessment",
      "Governance Diagnostic Exercise",
      "Leadership Reflection Journal",
    ],
    caseStudy: {
      title: "The Collapse of Institutional Trust",
      desc: "This case analyses failures of governance in organizations and draws useful lessons to guide managers in navigating the contours of organizational governance and leadership.",
    },
  },
  {
    week: "Week 2",
    title: "Strategic Leadership and Organizational Performance",
    topics: [
      "Strategic Thinking for Managers",
      "Setting Vision and Strategic Direction",
      "Organizational Culture and Performance",
      "Models of Decision-Making",
      "Navigating through Complexity and Uncertainty",
      "Performance Management Systems",
      "Leadership for Results",
    ],
    activities: [
      "Strategic Mapping Exercise",
      "Organizational Performance Simulation",
      "Decision-Making Workshop",
    ],
    caseStudy: {
      title: "Transforming a Declining Institution",
      desc: "Case examines intervention put in place by leadership which resuscitated organizational performance.",
    },
  },
  {
    week: "Week 3",
    title: "Ethical Leadership, Compliance, and Professional Responsibility",
    topics: [
      "Ethics and Executive Responsibility",
      "Governance Failures and Organizational Risks",
      "Frameworks for Ethical Decision-Making",
      "Anti-Corruption and Accountability Systems",
      "Compliance Management",
      "Professional Integrity Under Pressure",
      "Principled/Responsible Leadership",
    ],
    activities: [
      "Ethical Dilemma Simulations",
      "Governance Risk Assessment",
      "Compliance Framework Exercise",
    ],
    caseStudy: {
      title: "Leadership Under Boardroom Pressure",
      desc: "Experiential lessons from executive ethical crises.",
    },
  },
  {
    week: "Week 4",
    title: "People Leadership, Communication, and Team Effectiveness",
    topics: [
      "Emotional Intelligence",
      "Team Leadership and Motivation",
      "Workplace Communication",
      "Conflict Resolution and Negotiation",
      "Stakeholder Engagement",
      "Diversity and Inclusion Leadership",
      "Coaching and Mentoring",
    ],
    activities: [
      "Negotiation Role Plays",
      "Emotional Intelligence Assessment",
      "Team Communication Labs",
    ],
    caseStudy: {
      title: "The High-Performing Team",
      desc: "Examining leadership behaviors that drive collaboration and performance.",
    },
  },
  {
    week: "Week 5",
    title: "Change Management, Digital Leadership, and Innovation",
    topics: [
      "Leading Organizational Change",
      "Change Resistance Management",
      "Innovation Leadership",
      "Digital Transformation and Governance",
      "Technology and Decision Systems",
      "Adaptive Leadership",
      "Crisis Leadership",
    ],
    activities: [
      "Change Leadership Simulation",
      "Innovation Design Challenge",
      "Crisis Management Exercise",
    ],
    caseStudy: {
      title: "Leading Through Disruption",
      desc: "How organizations survive technological and operational transformation.",
    },
  },
  {
    week: "Week 6",
    title: "Executive Leadership Capstone",
    topics: [
      "Executive Presence and Influence",
      "Strategic Stakeholder Management",
      "Public Leadership and Institutional Reputation",
      "Leadership Legacy and Sustainability",
      "Governance Improvement Planning",
      "Personal Leadership Development",
    ],
    activities: [
      "Executive Presentation",
      "Governance Improvement Proposal",
      "Leadership Action Plan",
    ],
    caseStudy: {
      title: "The Future-Ready Leader",
      desc: "Building resilient leadership systems for sustainable institutions.",
    },
  },
];

// ─── Accordion Component ──────────────────────────────────────────────────────

const WeekAccordion = ({ item, index }: { item: typeof curriculum[0]; index: number }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-[#001a3d] rounded-2xl overflow-hidden border border-primary/20 mb-3"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 md:p-7 text-left hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="bg-primary text-[#00122e] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
            {item.week}
          </span>
          <h3 className="text-white font-black text-sm md:text-lg uppercase tracking-tight">{item.title}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 ml-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-5 md:px-8 pb-8 border-t border-white/5"
        >
          <div className="grid md:grid-cols-3 gap-8 pt-6">
            {/* Topics */}
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Core Modules</p>
              <ul className="space-y-2.5">
                {item.topics.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-white/70 text-xs font-semibold leading-relaxed">
                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities */}
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Executive Labs</p>
              <ul className="space-y-2.5">
                {item.activities.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-white/70 text-xs font-semibold leading-relaxed">
                    <Target className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Case Study */}
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Case Analysis</p>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-primary font-black text-xs uppercase mb-2">"{item.caseStudy.title}"</p>
                <p className="text-white/60 text-xs leading-relaxed italic font-medium">{item.caseStudy.desc}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const CourseDetail = () => {
  return (
    <div className="min-h-screen bg-[#00122e] text-white selection:bg-primary selection:text-[#00122e]">
      <Helmet>
        <title>RPCSGL Executive Programme | Strategic Governance & Leadership – RAGLA</title>
        <meta
          name="description"
          content="The Royal Professional Certificate in Strategic Governance and Leadership (RPCSGL) is our flagship executive education programme for senior leaders across Africa."
        />
        <link rel="canonical" href="https://ragl-africa.org/programmes/rpcsgl" />
      </Helmet>
      <Header />

      <main className="pb-20">
        <div className="container-main pt-32">
           <Link to="/programmes" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white transition-colors mb-12">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Academy Programmes
           </Link>
        </div>

        <div className="container-main max-w-6xl mx-auto">
           <div className="relative group">
              {/* --- HERO HEADER: EXECUTIVE SUMMARY STYLE --- */}
              <div className="relative bg-[#001a3d] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)] border border-primary/20">
                {/* Background Decorations */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10 p-8 md:p-20">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6 max-w-2xl"
                    >
                      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-primary leading-none">
                        EXECUTIVE <br /> <span className="text-white">SUMMARY</span>
                      </h1>
                      <div className="flex items-center gap-3">
                         <div className="h-0.5 w-12 bg-primary" />
                         <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Curated Programme</p>
                      </div>
                      <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold leading-tight text-white italic drop-shadow-lg pr-4">
                        "Royal Professional Certificate in Strategic Governance & Leadership"
                      </h2>
                      <p className="text-lg md:text-xl font-bold tracking-tight text-white/50 border-l-4 border-primary pl-6 py-2">
                         Accredited Executive Education (ISO 21001:2018)
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] flex flex-col gap-8 w-full md:max-w-[340px] shadow-2xl relative"
                    >
                       <div className="flex flex-col items-center text-center space-y-4">
                          <div className="relative group">
                             <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-colors" />
                             <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.3)] relative z-10">
                                <Award className="w-12 h-12 text-[#00122e]" />
                             </div>
                          </div>
                          <div>
                             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Royal Academy of</h4>
                             <p className="text-xs font-black uppercase tracking-[0.1em] text-white">Governance & Leadership Africa</p>
                          </div>
                       </div>

                       <div className="space-y-5 pt-8 border-t border-white/10">
                          <div className="flex items-center gap-5 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/30">
                              <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-primary/70">Duration</p>
                              <p className="text-base font-bold text-white">8-Week Professional Journey</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-5 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/30">
                              <Globe className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-primary/70">Recognition</p>
                              <p className="text-base font-bold text-white">International Accreditation</p>
                            </div>
                          </div>
                          <Button asChild className="w-full h-14 bg-primary text-[#00122e] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 shadow-xl shadow-primary/20">
                             <Link to="/programmes/apply-rpcsgl">Apply for Admission</Link>
                          </Button>
                       </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* --- MAIN CONTENT SECTIONS --- */}
              <div className="py-20 md:py-32 space-y-32">
                
                {/* 1. REALITY & CONTEXT */}
                <div className="grid md:grid-cols-2 gap-16">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex gap-8"
                  >
                    <div className="shrink-0 w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center shadow-2xl">
                       <Users className="w-10 h-10 text-[#00122e]" />
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-2xl font-black uppercase tracking-wider text-primary">The Executive Reality</h3>
                      <p className="text-base leading-relaxed text-white/70 font-medium italic">
                        "Today's corporate environment places peremptory demands on organizational leadership: ethical-centeredness, strategic agility, organizational savviness, and systematic cognizance fuelled by the capability to manage complex issues in dynamic environments."
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex gap-8"
                  >
                    <div className="shrink-0 w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center shadow-2xl">
                       <Target className="w-10 h-10 text-[#00122e]" />
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-2xl font-black uppercase tracking-wider text-primary">Mission Critical</h3>
                      <p className="text-base leading-relaxed text-white/70 font-medium">
                        Public, private, and international sector organizations require leaders with the capacity for <span className="text-white font-bold">adaptive transitioning</span> from operational-focused competence to effective strategic leadership and governance excellence.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* 2. THE TOOLS (ICON GRID) */}
                <div className="relative pt-16 border-t border-white/5">
                   <div className="text-center space-y-12">
                      <div className="inline-block px-10 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
                         <h3 className="text-xl md:text-2xl font-black uppercase tracking-[0.4em] text-primary">
                            Strategic Competency Framework
                         </h3>
                      </div>
                      
                      <p className="text-lg text-white/40 max-w-4xl mx-auto font-black uppercase tracking-tighter leading-tight">
                        THE RPCSGL PROGRAMME IS INFUSED WITH THE HIGHEST STANDARDS OF GOVERNANCE RESEARCH AND PRACTICAL FIELD INSIGHTS
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12">
                         {[
                           { icon: Scale, title: "Governance", desc: "Foundational principles of institutional accountability" },
                           { icon: Compass, title: "Agility", desc: "Strategic response tools for fast-paced markets" },
                           { icon: Landmark, title: "Fidelity", desc: "Maintaining integrity under severe pressure" },
                           { icon: ShieldCheck, title: "Resilience", desc: "Building sustainable institutional frameworks" }
                         ].map((item, i) => (
                           <div key={i} className="space-y-4 group">
                              <div className="w-24 h-24 mx-auto rounded-full border-2 border-primary/20 flex items-center justify-center bg-[#001a3d] group-hover:border-primary group-hover:shadow-[0_0_40px_rgba(var(--primary),0.2)] transition-all duration-500">
                                <item.icon className="w-10 h-10 text-primary" />
                              </div>
                              <h4 className="text-sm font-black uppercase tracking-widest text-primary">{item.title}</h4>
                              <p className="text-[10px] uppercase font-bold text-white/40 leading-tight px-4">{item.desc}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* 3. THE CURRICULUM */}
                <div className="space-y-12">
                   <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                      <div className="space-y-2">
                        <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Academic Rigour</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">8-WEEK <span className="text-primary">JOURNEY</span></h2>
                      </div>
                      <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-xs text-right">
                         6 Modules of Intensive Professional Training and Case Study Analysis.
                      </p>
                   </div>
                   
                   <div className="space-y-4">
                      {curriculum.map((item, i) => (
                        <WeekAccordion key={item.week} item={item} index={i} />
                      ))}
                      
                      <div className="bg-primary p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 mt-12 text-[#00122e]">
                         <div className="shrink-0 w-24 h-24 rounded-full bg-[#00122e] flex items-center justify-center shadow-2xl">
                            <Zap className="w-10 h-10 text-primary" />
                         </div>
                         <div className="flex-1 space-y-4 text-center md:text-left">
                           <h4 className="text-3xl font-black uppercase tracking-tighter leading-none">The Executive Capstone</h4>
                           <p className="text-base font-bold leading-relaxed opacity-80">
                             Weeks 7 & 8 are dedicated to the <span className="underline decoration-2">Governance Improvement Plan (GIP)</span>. Participants defend their strategies to address real-world institutional challenges.
                           </p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 4. WHO SHOULD ATTEND */}
                <div className="bg-white/5 rounded-[3rem] p-10 md:p-20 border border-white/10 text-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-20" />
                   <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-16 relative z-10 uppercase">
                     Target <span className="text-primary">Profiles</span>
                   </h2>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10 text-left">
                      {[
                        "C-Suite Executives", "Board Members", "Public Sector Leaders", "International NGO Directors",
                        "Hi-Pos (High Potentials)", "Governance Officers", "Strategic Managers", "Policy Advisors",
                        "Middle-Level Managers", "Entrepreneurs", "Administrative Leads", "Emerging Leaders"
                      ].map(p => (
                        <div key={p} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-primary transition-all">
                           <UserCheck className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                           <span className="text-xs font-bold uppercase tracking-wide text-white/80">{p}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* 5. FINAL CTAS */}
                <div className="grid md:grid-cols-3 gap-8">
                   {[
                     { icon: LayoutDashboard, tag: "#AUTHORITY", text: "Uphold integrity and institutional excellence at the highest level." },
                     { icon: TrendingUp, tag: "#STRATEGY", text: "Transition from operational competence to visionary strategic leadership." },
                     { icon: ShieldCheck, tag: "#LEGACY", text: "Build a lasting institutional footprint focused on sustainable success." }
                   ].map((item, i) => (
                     <div key={i} className="p-10 rounded-[2.5rem] bg-[#001a3d] border border-primary/20 hover:border-primary transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
                           <item.icon className="w-8 h-8 text-[#00122e]" />
                        </div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">{item.tag}</h5>
                        <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-tight">{item.text}</p>
                     </div>
                   ))}
                </div>

              </div>
           </div>
        </div>

        {/* --- BOTTOM ADMISSIONS STRIP --- */}
        <div className="bg-primary p-12 md:p-24 mt-20 text-[#00122e]">
           <div className="container-main max-w-6xl flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="space-y-6 text-center md:text-left">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Program Enrollment 2026/2027</h4>
                 <p className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">Apply for Admission</p>
                 <p className="text-lg font-bold opacity-80 max-w-xl">
                   Join the next cohort of transformative leaders across the African continent. Admission is by competitive selection.
                 </p>
                 <div className="pt-6">
                    <Button asChild className="h-20 px-16 bg-[#00122e] text-primary hover:bg-[#00122e]/90 font-black uppercase tracking-[0.2em] rounded-[2rem] text-xl shadow-2xl transition-all border border-primary/20">
                       <Link to="/programmes/apply-rpcsgl">
                          Start Registration <ArrowRight className="w-8 h-8 ml-4" />
                       </Link>
                    </Button>
                 </div>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-6">
                 <div className="w-40 h-40 bg-white p-4 rounded-[2rem] shadow-2xl rotate-3">
                    <div className="w-full h-full border-4 border-[#00122e] rounded-2xl flex items-center justify-center">
                       <MonitorPlay className="w-16 h-16 text-[#00122e]" />
                    </div>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#00122e] opacity-60">Pan-African Academy</p>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
