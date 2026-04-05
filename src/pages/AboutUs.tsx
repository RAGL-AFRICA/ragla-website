import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Shield, Award, Users, BookOpen, Target, Handshake, GraduationCap, Star, Globe, Leaf } from "lucide-react";

const missionAreas = [
  {
    title: "Professional Excellence",
    description: "We are committed to fostering professional excellence, ethical integrity, and accountability in our service delivery.",
  },
  {
    title: "Capacity Building",
    description: "We are dedicated to developing the capacity of leaders through our courses and programmes, and CPD initiatives.",
  },
  {
    title: "Market Driven Research",
    description: "We are committed to building a platform to enhance market-driven research, dissemination, and sharing best practices in governance and leadership.",
  },
  {
    title: "Fostering Strong Partnership",
    description: "We desire to foster strong partnership with key stakeholders, including government institutions, CSOs, the private sector to reinforce international best practices for Africa's development.",
  },
  {
    title: "Nurturing the Next Generation of African Leaders",
    description: "It is our commitment to nurture and inspire the next generation of African leaders to champion principled, inclusive, and innovative social solutions.",
  },
];

const corporateValues = [
  {
    title: "Integrity",
    description: "Service with integrity is our clarion call to duty.",
    icon: Shield,
  },
  {
    title: "Professionalism",
    description: "We adhere strictly to the highest level of standards that define us as a professional body.",
    icon: Award,
  },
  {
    title: "Accountability",
    description: "Our sacred duty is to be responsible and hold fidelity to the core values of sincerity, honesty, and good ethical conduct in pursuit of professional excellence.",
    icon: Users,
  },
  {
    title: "Commitment",
    description: "We are driven by the highest level of enthusiasm to work towards the promotion of best governance practices.",
    icon: Target,
  },
];

const objectives = [
  { title: "Promote Best Governance Practices and Ethical Leadership", description: "Promote the fundamental principles of transparency, accountability, integrity, and responsibility across African public and private sectors.", icon: Shield },
  { title: "Develop Professional Standards and Competencies", description: "Set up and ensure the enforcement of codes of conduct, best practices, and high standards of professionalism in governance and leadership.", icon: Award },
  { title: "Capacity Building and Professional Development", description: "Organize training and development, capacity building, certification, and CPD opportunities to equip members with the requisite skills and knowledge.", icon: BookOpen },
  { title: "Research, Knowledge Creation, and Thought Leadership", description: "Conduct and disseminate market driven research on trendy issues in governance and leadership applicable to the African context.", icon: Target },
  { title: "Policy Advocacy and Advisory Role", description: "Build partnership with governments, private sector players, CSOs, and international partners to shape policies and discussions of governance and leadership.", icon: Handshake },
  { title: "Collaborative Networking", description: "Create platforms for professionals, institutions, and leaders to share experiences, exchange knowledge, and foster cross-border partnerships.", icon: Users },
  { title: "Youth and Emerging Leaders Development", description: "Provide mentorship and create leadership and professional development initiatives to build the capacities of the youth.", icon: GraduationCap },
  { title: "Recognition and Accreditation", description: "Identify and reward excellence in governance and leadership by nominating and elevating exceptional individuals in society.", icon: Star },
  { title: "Regional and Global Positioning", description: "Position Africa as a hub of governance innovation by aligning with global standards, while contextualizing solutions for African realities.", icon: Globe },
  { title: "Sustainability and Inclusive Leadership", description: "Promote leadership that integrates social responsibility, gender equity, environmental sustainability, and inclusive participation.", icon: Leaf },
];

const stats = [
  { value: "0K+", label: "Active Students" },
  { value: "0+", label: "Faculty Courses" },
  { value: "0K+", label: "Positive Reviews" },
  { value: "0+", label: "Awards Achieved" },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About RAGLA | Our Mission, Values, and Pan-African Vision</title>
        <meta name="description" content="Learn about RAGLA's mission to foster excellence in governance and leadership across Africa. Discover our corporate values and strategic objectives." />
        <link rel="canonical" href="https://ragl-africa.org/about-us" />
      </Helmet>
      <Header />

      {/* Page Header */}
      <section className="section-padding bg-secondary">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">About RAGLA</h1>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-padding">
        <div className="container-main">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">ABOUT US</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Who We Are</h2>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            The Royal Academy of Governance and Leadership Africa (RAGLA) serves as a top-notch Pan-African professional Academy which is dedicated to fostering the highest standards of excellence in governance and leadership in Africa. We are committed to creating a synergy, seeking to rally professionals from the public and private sectors, academia, civil society organizations, and the non-profit making sector to build governance and leadership capacity, reinforce institutions and make them more productive and accountable, and also enhance best ethical practices.
          </p>

          {/* Motto */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {["Servitium – Service", "Integritas – Integrity", "Phasellus – Professionalism"].map((motto) => (
              <div key={motto} className="bg-card rounded-xl p-6 text-center card-shadow">
                <p className="text-primary font-semibold italic text-lg">{motto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-secondary">
        <div className="container-main">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-10 max-w-3xl">
            Our Mission is built on five thematic areas: Professional Excellence, Capacity Building, Market Driven Research, Fostering Strong Partnership, and Nurturing the Next Generation of African Leaders.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missionAreas.map((area) => (
              <div key={area.title} className="bg-card rounded-xl p-6 card-shadow">
                <h3 className="text-primary font-semibold text-lg mb-3">{area.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-primary-foreground/80 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Values */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Corporate Values</h2>
          <p className="text-muted-foreground mb-10">RAGLA is driven by IPAC:</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {corporateValues.map((value) => (
              <div key={value.title} className="bg-card rounded-xl p-6 card-shadow text-center">
                <value.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-foreground font-semibold text-lg mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section-padding bg-secondary">
        <div className="container-main">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">Objectives</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((obj) => (
              <div key={obj.title} className="bg-card rounded-xl p-6 card-shadow flex gap-4">
                <obj.icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-foreground font-semibold mb-2">{obj.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{obj.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/membership-benefits" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:brightness-110 transition-all uppercase tracking-wider text-sm">
              Join Our Membership
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
