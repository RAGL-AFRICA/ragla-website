import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { externalSupabase } from "@/lib/external_supabase";
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
      if (!session) {
        setLoading(false);
        return;
      }
      const uid = session.user.id;
      setUserId(uid);
      setUserEmail(session.user.email || "");

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", uid)
        .single();

        if (data) {
          // A. Authoritative Identity Sync (from RAGLA Students Table)
          if (data.membership_number) {
            try {
              const { data: extStudent } = await externalSupabase
                .from("students")
                .select("full_name, photo_url")
                .eq("student_id", data.membership_number)
                .maybeSingle();
              
              if (extStudent) {
                data.full_name = extStudent.full_name || data.full_name;
                
                if (extStudent.photo_url) {
                   let finalPhoto = extStudent.photo_url;
                   if (!finalPhoto.startsWith('http') && !finalPhoto.startsWith('data:')) {
                     finalPhoto = `https://mgjqoyoparpxisabhzgi.supabase.co/storage/v1/object/public/students/${finalPhoto}`;
                   }
                   data.avatar_url = finalPhoto;
                }
                
                // Silent sync back to local
                supabase.from("user_profiles").update({ 
                  full_name: data.full_name,
                  avatar_url: data.avatar_url 
                }).eq("id", uid).then(() => {});
              }
            } catch (err) {
              console.warn("External student sync error:", err);
            }
          }

        // FETCH ALL CATEGORIES FROM PAYMENTS
        try {
          let allPayments = [];
          
          // 1. Try by ID
          if (data.membership_number) {
            const { data: idPayments } = await externalSupabase
              .from("payments")
              .select("status, fee_types(name), student_data")
              .filter("student_data->>student_id", "eq", data.membership_number)
              .eq("status", "success");
            if (idPayments) allPayments = idPayments;
          }

          // 2. Try by Email (Search both payer_email and student_data->>email)
          if (allPayments.length === 0 && session.user.email) {
            const { data: emailPayments } = await externalSupabase
              .from("payments")
              .select("status, fee_types(id, name), student_data, payer_email")
              .or(`payer_email.ilike.${session.user.email},student_data->>email.ilike.${session.user.email}`)
              .eq("status", "success");
            if (emailPayments) allPayments = emailPayments;
          }

          if (allPayments && allPayments.length > 0) {
            data.membership_status = "active";
            
            // Resolve Student ID if missing locally
            const resolvedSid = allPayments.find(p => (p.student_data as any)?.student_id)?.student_data?.student_id;
            if (resolvedSid && !data.membership_number) {
              data.membership_number = resolvedSid;
            }

            const categories = Array.from(new Set(
              allPayments.map(p => (p.fee_types as any)?.name).filter(n => !!n)
            ));
            if (categories.length > 0) {
              data.membership_category = categories.join(", ");
            }

            // Sync back to local profile
            supabase.from("user_profiles").update({ 
               membership_status: "active",
               membership_category: data.membership_category,
               membership_number: data.membership_number
            }).eq("id", uid).then(() => {});
          }
        } catch (err) {
          console.warn("Profile payment check error:", err);
        }
        setProfile(data);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      toast.error("You must be signed in to update your profile");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        full_name: profile.full_name?.trim() || null,
      };

      const { data, error } = await supabase
        .from("user_profiles")
        .update(payload)
        .eq("id", userId)
        .select("id");

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error("Profile record not found. Please contact admin to initialize your profile.");
        return;
      }

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
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-black text-4xl">
                {(profile.full_name || userEmail)?.[0]?.toUpperCase() || "M"}
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="font-bold text-xl text-foreground">{profile.full_name || "No name set"}</p>
          <p className="text-sm text-muted-foreground mb-2">{userEmail}</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              {profile.membership_status || "Pending"}
            </span>
            {profile.membership_number && (
              <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border uppercase tracking-wider font-mono">
                ID: {profile.membership_number}
              </span>
            )}
          </div>
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
