import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { externalSupabase } from "@/lib/external_supabase";
import { motion } from "framer-motion";
import {
  CreditCard, BookOpen, GraduationCap, Bell, User,
  CheckCircle, Clock, AlertCircle, ArrowRight
} from "lucide-react";

type UserProfile = {
  full_name: string | null;
  membership_category: string | null;
  membership_status: string | null;
  membership_number: string | null;
  avatar_url: string | null;
};

const actionCards = [
  {
    id: "fees",
    icon: CreditCard,
    label: "Pay Fees",
    description: "View your fee balance and make payments",
    href: "https://student.ragl-africa.org/portal/ea314d20-92cc-4ddf-aa3a-e689138881cd",
    isExternal: true,
    gradient: "from-blue-600 to-blue-700",
    glow: "group-hover:shadow-blue-500/30",
    badge: null,
  },
  {
    id: "library",
    icon: BookOpen,
    label: "Library",
    description: "Access digital resources, journals & publications",
    href: "https://student.ragl-africa.org/library",
    isExternal: true,
    gradient: "from-violet-600 to-purple-700",
    glow: "group-hover:shadow-violet-500/30",
    badge: null,
  },
  {
    id: "courses",
    icon: GraduationCap,
    label: "My Courses",
    description: "View your enrolled programmes & learning materials",
    href: "/student/courses",
    gradient: "from-emerald-600 to-green-700",
    glow: "group-hover:shadow-emerald-500/30",
    badge: null,
  },
  {
    id: "announcements",
    icon: Bell,
    label: "Announcements",
    description: "Stay up to date with RAGLA news & updates",
    href: "/student/announcements",
    gradient: "from-amber-500 to-orange-600",
    glow: "group-hover:shadow-amber-500/30",
    badge: "New",
  },
  {
    id: "profile",
    icon: User,
    label: "My Profile",
    description: "Update your personal details and information",
    href: "/student/profile",
    gradient: "from-rose-600 to-pink-700",
    glow: "group-hover:shadow-rose-500/30",
    badge: null,
  },
];

const StudentDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [metaFullName, setMetaFullName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      setUserEmail(session.user.email || "");
      setMetaFullName((session.user.user_metadata?.full_name as string) || "");

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        // If avatar_url is missing in local profile, fetch from master record
        if (!data.avatar_url && data.membership_number) {
          const { data: extData } = await externalSupabase
            .from("students")
            .select("photo_url")
            .eq("student_id", data.membership_number)
            .maybeSingle();
          
          if (extData?.photo_url) {
            data.avatar_url = extData.photo_url;
            // Optionally update local cache for faster next load
            supabase.from("user_profiles").update({ avatar_url: extData.photo_url }).eq("id", session.user.id).then(() => {});
          }
        }
        setProfile(data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const displayName = profile?.full_name?.trim() || metaFullName.trim() || "Student";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const StatusIcon = {
    active: CheckCircle,
    pending: Clock,
    expired: AlertCircle,
  }[profile?.membership_status || "pending"] ?? Clock;

  const statusColor = {
    active:  "text-green-400",
    pending: "text-yellow-400",
    expired: "text-red-400",
  }[profile?.membership_status || "pending"] ?? "text-yellow-400";

  const statusBg = {
    active:  "bg-green-500/10 border-green-500/20",
    pending: "bg-yellow-500/10 border-yellow-500/20",
    expired: "bg-red-500/10 border-red-500/20",
  }[profile?.membership_status || "pending"] ?? "bg-yellow-500/10 border-yellow-500/20";

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex-1">
          <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            {greeting}, <br className="md:hidden" />
            <span className="text-primary capitalize">{displayName}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-3 text-base max-w-xl">
            Welcome to your RAGLA Student Portal. Here you can manage everything in one place.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-card border-2 border-border/50 flex items-center justify-center overflow-hidden shadow-2xl">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-black text-3xl md:text-4xl">
                    {displayName[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {profile?.membership_status === "active" && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-background shadow-lg">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Membership Status Banner */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border ${statusBg}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-current/10 ${statusColor}`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <p className={`font-bold text-base ${statusColor}`}>
                Membership {profile?.membership_status ? profile.membership_status.charAt(0).toUpperCase() + profile.membership_status.slice(1) : "Pending"}
              </p>
              <p className="text-muted-foreground text-sm mt-0.5">
                {profile?.membership_category || "No category assigned"} 
                {profile?.membership_number && <span className="ml-2 font-mono text-xs">• #{profile.membership_number}</span>}
              </p>
            </div>
          </div>
          {(profile?.membership_status === "pending" || !profile?.membership_status) && (
            <a
              href="https://student.ragl-africa.org/portal/ea314d20-92cc-4ddf-aa3a-e689138881cd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all whitespace-nowrap shadow-lg shadow-primary/20"
            >
              Complete Payment <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </motion.div>
      )}

      {/* Feature Cards Grid */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-5">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {actionCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              >
                {card.isExternal ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative flex flex-col p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${card.glow} overflow-hidden h-full`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-br ${card.gradient} opacity-[0.06] group-hover:opacity-10 transition-opacity`} />
                    {card.badge && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground uppercase tracking-wider">
                        {card.badge}
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-foreground font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {card.label}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {card.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                ) : (
                  <Link
                    to={card.href}
                    className={`group relative flex flex-col p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${card.glow} overflow-hidden h-full`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-br ${card.gradient} opacity-[0.06] group-hover:opacity-10 transition-opacity`} />
                    {card.badge && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground uppercase tracking-wider">
                        {card.badge}
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-foreground font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {card.label}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {card.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;
