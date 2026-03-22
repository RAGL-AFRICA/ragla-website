import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { externalSupabase } from "@/lib/external_supabase";
import { toast } from "sonner";
import { 
  CreditCard, 
  History, 
  CheckCircle, 
  Clock, 
  Receipt, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Payment = {
  id: string;
  amount: number;
  category: string;
  status: string;
  receipt_url: string;
  transaction_id: string;
  created_at: string;
};

const StudentPaymentWidget = ({ studentId, onPaymentVerified }: { studentId: string, onPaymentVerified: (data: any) => void }) => {
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      // Security: In production, verify event.origin === "https://student.ragl-africa.org"
      if (event.origin === "https://student.ragl-africa.org" && event.data?.type === 'PAYMENT_COMPLETE' && event.data?.status === 'success') {
        console.log("Payment Confirmed!", event.data);
        onPaymentVerified(event.data);
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [onPaymentVerified]);

  return (
    <div className="w-full h-[650px] border border-border rounded-2xl overflow-hidden shadow-2xl bg-card relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-primary animate-gradient-x z-20" />
      <iframe 
        src={`https://student.ragl-africa.org/student-payment-widget?student_id=${encodeURIComponent(studentId)}`} 
        className="w-full h-full border-none"
        title="Student Fee Payment"
      />
    </div>
  );
};


const Payments = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [profile, setProfile] = useState<any>(null); // Track local profile for status updates
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const loadData = async () => {
      // QUICK CHECK: If student_id is in URL and NOT empty, set it immediately
      const urlStudentId = searchParams.get("student_id");
      if (urlStudentId && urlStudentId.trim().length > 2) {
        setStudentId(urlStudentId.trim());
        setLoading(false);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      
      const user = session.user;
      const email = user.email;
      const fullName = user.user_metadata?.full_name;
      setUserId(user.id);

      let sid = (urlStudentId && urlStudentId.trim().length > 2) ? urlStudentId.trim() : null;

      // SOURCE 1: Local Profile
      const { data: localProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      if (localProfile) setProfile(localProfile);

      if (!sid) {
        sid = localProfile?.membership_number;
      }

      // SOURCE 2: Auth Metadata
      if (!sid && user.user_metadata?.student_id) {
        sid = user.user_metadata.student_id;
      }

      // SOURCE 3: External Search (Final attempt by Email OR Full Name)
      if (!sid) {
        if (email) {
          // A. Try main student table
          const { data: masterByEmail } = await externalSupabase
            .from("students")
            .select("student_id")
            .eq("email", email)
            .maybeSingle();
          if (masterByEmail?.student_id) sid = masterByEmail.student_id;

          // B. Try payments student_data JSON (Self-healing if they paid with email)
          if (!sid) {
            const { data: payByEmail } = await externalSupabase
              .from("payments")
              .select("student_data")
              .filter("student_data->>email", "eq", email)
              .eq("status", "success")
              .limit(1)
              .maybeSingle();
            const foundSid = (payByEmail?.student_data as any)?.student_id;
            if (foundSid) sid = foundSid;
          }
        }

        if (!sid && fullName) {
          const { data: masterByName } = await externalSupabase
            .from("students")
            .select("student_id")
            .eq("full_name", fullName)
            .maybeSingle();
          if (masterByName?.student_id) sid = masterByName.student_id;
        }
      }

      // SYNC BACK & FINALIZE: If we found it, show it immediately
      if (sid) {
        setStudentId(sid);
        setLoading(false); // Render NOW
        
        if (!localProfile?.membership_number) {
          console.log("Repairing profile with found ID:", sid);
          await supabase.from("user_profiles").update({ membership_number: sid }).eq("id", user.id);
          setProfile(prev => ({ ...prev, membership_number: sid }));
        }

        // Fetch history from EXTERNAL RAGLA DATABASE
        try {
          const { data: extPayments } = await externalSupabase
            .from("payments")
            .select("*, fee_types(name)")
            .filter("student_data->>student_id", "eq", sid)
            .order("created_at", { ascending: false });
          
          if (extPayments) {
            const mappedHistory = extPayments.map(p => ({
              id: p.id,
              amount: p.amount,
              category: (p.fee_types as any)?.name || "Member Fee",
              status: p.status,
              receipt_url: p.paystack_reference ? `https://checkout.paystack.com/${p.paystack_reference}` : "",
              transaction_id: p.paystack_transaction_id || p.id,
              created_at: p.paid_at || p.created_at
            }));
            setPayments(mappedHistory);
          }
        } catch (err) {
          console.warn("External payments history check:", err);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [searchParams]);

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsProcessing(true);
    toast.info("Payment confirmed! Syncing your records...");

    const paymentCategory = paymentData.category || "Tuition/Membership Fees";
    const paymentAmount = paymentData.amount || 0;

    try {
      // 1. Fetch latest details from external DB
      const { data: extStudent } = await externalSupabase
        .from("students")
        .select("membership_status, membership_category")
        .eq("student_id", studentId)
        .maybeSingle();

      // 2. Prepare local update (Ensuring local status is active)
      const updates: any = {
        membership_status: extStudent?.membership_status || 'active',
        membership_category: extStudent?.membership_category || profile?.membership_category
      };

      // 3. Update local profile
      await supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", userId);
      
      setProfile(prev => ({ ...prev, ...updates }));

      // 4. Note: We no longer insert locally as the external DB is the master source
      // The widget handles inserting into the external RAGLA database.


      toast.success("Account activated and receipt saved!");
    } catch (err: any) {
      toast.error("Payment successful, but local sync failed. Your account will update shortly.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading Secure Checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-sm">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">Secure Fee Payment</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <p className="text-muted-foreground text-sm font-medium">Verified ID: <span className="text-foreground font-mono bg-secondary px-2 py-0.5 rounded">{studentId}</span></p>
              {profile?.membership_status && (
                <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                  profile.membership_status === 'active' 
                    ? "bg-green-500/10 border-green-500/20 text-green-500" 
                    : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${profile.membership_status === 'active' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                  {profile.membership_status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Payment Form */}
        <div className="lg:col-span-8 min-h-[650px] flex items-center justify-center">
          {studentId ? (
            <StudentPaymentWidget 
              studentId={studentId} 
              onPaymentVerified={handlePaymentSuccess} 
            />
          ) : (
            <div className="w-full h-auto p-8 md:p-12 text-center rounded-3xl border border-dashed border-border bg-card flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight">Student Identity Required</h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  We couldn't automatically link your account. Please enter your Student ID below to enable secure payments.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <input 
                  type="text" 
                  placeholder="e.g. RAGLA/2026/001" 
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                />
                <button 
                  onClick={() => {
                    if (studentId.length > 5) {
                      setLoading(true);
                      setTimeout(() => setLoading(false), 500); // Trigger re-render with the manually set ID
                    } else {
                      toast.error("Please enter a valid Student ID");
                    }
                  }}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
                >
                  Link Account
                </button>
              </div>
              
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Need help? Contact support@ragl-africa.org
              </p>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-foreground tracking-tight text-lg">Secure Gateway</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your credentials are pre-verified via your <strong className="text-foreground">Student ID</strong>. 
                Complete your payment below to instantly unlock all academy features.
              </p>
              <div className="space-y-3">
                {['Instant Sync', 'Automatic Receipts', 'Global Support'].map((txt) => (
                  <div key={txt} className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {txt}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-3xl border border-border bg-card/50 backdrop-blur-sm">
             <div className="flex items-center justify-between mb-4">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recent Activity</p>
               <History className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
             </div>
             {payments.slice(0, 1).map(p => (
               <div key={p.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{p.category}</p>
                    <p className="text-[10px] text-muted-foreground">Successful • {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
               </div>
             ))}
             {payments.length === 0 && <p className="text-xs text-muted-foreground italic">No recent transactions.</p>}
          </div>
        </div>
      </div>

      {/* Payment History Section (Moved to Bottom) */}
      {payments.length > 0 && (
        <div className="pt-12 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Payment History
            </h2>
            <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">{payments.length} Transactions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payments.map((payment) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={payment.id}
                className="p-5 rounded-2xl border border-border bg-card flex items-center justify-between gap-4 group hover:border-primary/30 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-foreground truncate">{payment.category}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{new Date(payment.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                   <p className="text-lg font-black text-foreground">${typeof payment.amount === 'number' ? payment.amount.toFixed(2) : payment.amount}</p>
                   {payment.receipt_url && (
                     <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                       <Receipt className="w-5 h-5" />
                     </a>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Syncing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center text-center"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">Updating Enrollment...</h3>
            <p className="text-muted-foreground max-w-xs mt-2 px-6">We're syncing your academic records and generating your receipt.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
