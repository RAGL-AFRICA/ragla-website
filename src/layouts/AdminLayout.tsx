import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Image as ImageIcon, LogOut, ChevronLeft, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Calendar, label: "Manage Events", path: "/admin/events" },
    { icon: ImageIcon, label: "Manage Gallery", path: "/admin/gallery" },
    { icon: Mail, label: "Messages", path: "/admin/messages" },
  ];

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-background border-r border-border flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">RAGLA Admin</h2>
          <p className="text-sm text-muted-foreground mt-1">Content Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "text-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3" 
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Website
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start gap-3" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
