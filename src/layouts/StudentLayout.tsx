import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, BookOpen, CreditCard, Bell, 
  User, GraduationCap, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import logo from "@/assets/ragla logo.png";
import { motion, AnimatePresence } from "framer-motion";

type UserProfile = {
  full_name: string | null;
  membership_category: string | null;
  membership_status: string | null;
  membership_number: string | null;
};

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard",     path: "/student" },
  { icon: GraduationCap,   label: "My Courses",    path: "/student/courses" },
  { icon: BookOpen,        label: "Library",        path: "/student/library" },
  { icon: CreditCard,      label: "Pay Fees",       path: "/student/fees" },
  { icon: Bell,            label: "Announcements",  path: "/student/announcements" },
  { icon: User,            label: "My Profile",     path: "/student/profile" },
];

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserEmail(session.user.email || "");

      const { data } = await supabase
        .from("user_profiles")
        .select("full_name, membership_category, membership_status, membership_number")
        .eq("id", session.user.id)
        .single();

      setProfile(data);
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/sign-in");
  };

  const isActive = (path: string) => {
    if (path === "/student") return location.pathname === "/student";
    return location.pathname.startsWith(path);
  };

  const statusColor = {
    active:  "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    expired: "bg-red-500/20 text-red-400 border-red-500/30",
  }[profile?.membership_status || "pending"] ?? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="RAGLA" className="h-10 w-auto bg-white p-1 rounded-lg" />
          <div>
            <p className="text-foreground font-black text-base leading-tight">RAGLA</p>
            <p className="text-primary text-[9px] font-bold uppercase tracking-widest">Student Portal</p>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="p-5 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-black text-lg">
              {(profile?.full_name || userEmail)?.[0]?.toUpperCase() || "M"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-foreground font-bold text-sm truncate">
              {profile?.full_name || userEmail.split("@")[0]}
            </p>
            <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusColor}`}>
              {profile?.membership_status || "pending"}
            </span>
          </div>
        </div>
        {profile?.membership_category && (
          <p className="mt-3 text-xs text-muted-foreground font-medium line-clamp-1">
            {profile.membership_category}
          </p>
        )}
        {profile?.membership_number && (
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
            #{profile.membership_number}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                ${active 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 h-screen w-72 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="md:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-secondary text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="RAGLA" className="h-8 w-auto bg-white p-1 rounded" />
            <span className="font-black text-sm">Student Portal</span>
          </div>
          <div className="w-9" /> {/* spacer */}
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
