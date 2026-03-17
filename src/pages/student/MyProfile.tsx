import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User, Save } from "lucide-react";

type Profile = {
  full_name: string;
  membership_category: string;
  membership_status: string;
  membership_number: string;
  avatar_url: string;
};

const MyProfile = () => {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const uid = session.user.id;
      setUserId(uid);
      setUserEmail(session.user.email || "");

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .upsert({ id: userId, ...profile });

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">

      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-rose-500/10">
            <User className="w-6 h-6 text-rose-400" />
          </div>
          <h1 className="text-3xl font-black text-foreground">My Profile</h1>
        </div>
        <p className="text-muted-foreground">Manage your personal information and membership details.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-black text-3xl">
            {(profile.full_name || userEmail)?.[0]?.toUpperCase() || "M"}
          </span>
        </div>
        <div>
          <p className="font-bold text-lg text-foreground">{profile.full_name || "No name set"}</p>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
          <span className="mt-1.5 inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
            {profile.membership_status || "Pending"}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 className="font-bold text-foreground mb-2">Personal Information</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Full Name</label>
          <input
            type="text"
            value={profile.full_name || ""}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            placeholder="Your full name"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email Address</label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-muted-foreground cursor-not-allowed"
          />
          <p className="text-[11px] text-muted-foreground mt-1">Email is managed through your login credentials.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Membership Category</label>
            <input
              type="text"
              value={profile.membership_category || ""}
              disabled
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Membership Number</label>
            <input
              type="text"
              value={profile.membership_number || ""}
              disabled
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-muted-foreground cursor-not-allowed font-mono"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Membership category and number are assigned by RAGLA administrators.</p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-70 shadow-lg shadow-primary/20"
      >
        <Save className="w-5 h-5" />
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
};

export default MyProfile;
