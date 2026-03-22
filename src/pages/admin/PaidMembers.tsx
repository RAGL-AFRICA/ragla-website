import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Users, Search, CheckCircle, ShieldCheck, Mail, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PaidMember = {
  id: string;
  full_name: string;
  membership_number: string;
  membership_category: string;
  membership_status: string;
  avatar_url: string;
  created_at: string;
};

const PaidMembers = () => {
  const [members, setMembers] = useState<PaidMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("membership_status", "active")
        .order("full_name", { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (err: any) {
      toast.error("Failed to fetch verified members: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.membership_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.membership_category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Verified Paid Members</h1>
          <p className="text-muted-foreground mt-1">Directory of students with active, verified memberships.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search name, ID or type..." 
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(n => <div key={n} className="h-48 bg-muted rounded-3xl border border-border"></div>)}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground">No verified members found</h3>
          <p className="text-muted-foreground">Try adjusting your search or check again later.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMembers.map((member) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={member.id}
                className="group relative bg-card border border-border rounded-3xl p-6 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border-2 border-primary/20 overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/20">
                        <span className="text-primary font-black text-xl">{member.full_name?.[0]?.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-black text-lg text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">{member.full_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-mono text-muted-foreground">{member.membership_number}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex flex-wrap gap-2">
                       {member.membership_category?.split(',').map((cat, i) => (
                         <span key={i} className="px-2.5 py-1 rounded-lg bg-secondary text-foreground text-[10px] font-bold border border-border group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                           {cat.trim()}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PaidMembers;
