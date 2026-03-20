import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Eye, EyeOff, User, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { externalSupabase } from "@/lib/external_supabase";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "login" | "register" | "recover";

const SignIn = () => {
  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "", remember: false });
  // Register form
  const [registerForm, setRegisterForm] = useState({ 
    fullName: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    studentId: "",
    agreePrivacy: false, 
    agreeTerms: false 
  });
  // Recover form
  const [recoverEmail, setRecoverEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/student";

  useEffect(() => {
    // If user is already logged in, redirect them to the right place
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const destination = session.user?.email === "admin@ragl-africa.org" ? "/admin" : "/student";
        navigate(destination, { replace: true });
      }
    };
    checkSession();
  }, [navigate, from]);


  // Login ID resolution state
  const [loginPreview, setLoginPreview] = useState<{ 
    name: string; 
    photo: string | null; 
    email: string | null; 
    studentId: string | null;
    error?: string 
  } | null>(null);
  const [isResolvingLogin, setIsResolvingLogin] = useState(false);
  const [idError, setIdError] = useState<string | null>(null);

  // Resolve login ID when it changes
  useEffect(() => {
    const identifier = loginForm.email.trim();
    
    // Clear preview and error if it doesn't match the currently typed identifier
    if (loginPreview && identifier !== loginPreview.studentId && identifier !== loginPreview.email) {
       setLoginPreview(null);
    }
    
    // Always clear ID error when they start typing again or if it looks like an email
    setIdError(null);

    if (!identifier || identifier.includes("@") || identifier.length < 4) {
      return;
    }

    const resolveId = async () => {
      // Re-check before starting
      if (loginForm.email.includes("@")) return;

      setIsResolvingLogin(true);
      try {
        if (loginForm.email.includes("@")) return;

        // 1. IDENTITY SOURCE OF TRUTH: Fetch ONLY from external 'students' table
        const { data: extData } = await externalSupabase
          .from("students")
          .select("full_name, photo_url, student_id")
          .eq("student_id", identifier)
          .maybeSingle();

        if (loginForm.email.includes("@")) {
          setLoginPreview(null);
          return;
        }

        // If NOT found in master records, just quietely return
        // This keeps the CARD from appearing, allowing admins to use email
        if (!extData) {
          setLoginPreview(null);
          setIdError("Student ID not found in master records.");
          return;
        }

        // We found them in master records! Set the base preview immediately
        const basePreview = {
          name: extData.full_name,
          photo: extData.photo_url,
          studentId: extData.student_id,
          email: null as string | null
        };
        setLoginPreview(basePreview);

        // 2. EMAIL RESOLUTION: Now find the local account email
        // First try direct local lookup (fast)
        const { data: localProfile } = await supabase
          .from("user_profiles")
          .select("email")
          .eq("membership_number", identifier)
          .maybeSingle();

        if (localProfile?.email) {
          setLoginPreview({ ...basePreview, email: localProfile.email });
          return;
        }

        // Fallback: Edge function for secure email resolution
        const { data: funcData } = await supabase.functions.invoke('resolve-student', {
          body: { studentId: identifier }
        });

        if (loginForm.email.includes("@")) {
          setLoginPreview(null);
          return;
        }

        if (funcData && funcData.success && funcData.user?.email) {
          setLoginPreview({ ...basePreview, email: funcData.user.email });
        } else {
          // Keep the profile card visible but show that they need to register
          setLoginPreview({ 
            ...basePreview, 
            error: "Student found but not registered on this website yet." 
          });
        }
      } catch (err) {
        console.error("Error resolving login ID:", err);
      } finally {
        setIsResolvingLogin(false);
      }
    };

    const timer = setTimeout(resolveId, 800);
    return () => clearTimeout(timer);
  }, [loginForm.email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let loginIdentifier = loginForm.email.trim();
    
    try {
      // If we have a resolved email from the preview, use it
      if (loginPreview?.email) {
        loginIdentifier = loginPreview.email;
      } else if (!loginIdentifier.includes("@")) {
        // Fallback for when preview hasn't finished or failed
        const { data, error } = await supabase.functions.invoke('resolve-student', {
          body: { studentId: loginIdentifier }
        });

        if (error || !data.success || !data.user?.email) {
          throw new Error(data?.message || "Could not resolve Student ID to an account.");
        }
        loginIdentifier = data.user.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginIdentifier,
        password: loginForm.password,
      });

      if (error) throw error;
      
      toast.success("Logged in successfully");
      const destination = data.user?.email === "admin@ragl-africa.org" ? "/admin" : "/student";
      navigate(destination, { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  // Student preview state for registration
  const [studentPreview, setStudentPreview] = useState<{ name: string; photo: string | null } | null>(null);
  const [isValidatingId, setIsValidatingId] = useState(false);

  // Fetch student data when ID is entered (Registration)
  useEffect(() => {
    const fetchStudent = async () => {
      const sid = registerForm.studentId.trim();
      if (sid.length < 3) {
        setStudentPreview(null);
        return;
      }

      setIsValidatingId(true);
      try {
        const { data, error } = await externalSupabase
          .from("students")
          .select("full_name, photo_url")
          .eq("student_id", sid)
          .maybeSingle();

        if (data) {
          setStudentPreview({
            name: data.full_name,
            photo: data.photo_url
          });
        } else {
          setStudentPreview(null);
        }
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setIsValidatingId(false);
      }
    };

    const timer = setTimeout(fetchStudent, 500);
    return () => clearTimeout(timer);
  }, [registerForm.studentId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!studentPreview && !isValidatingId) {
      toast.error("Valid Student ID is required to register.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Validate Student ID using the external supabase
      const { data: externalStudent, error: checkError } = await externalSupabase
        .from("students")
        .select("student_id, full_name, photo_url")
        .eq("student_id", registerForm.studentId)
        .single();
      
      if (checkError || !externalStudent) {
        throw new Error("Student ID not found in the master records.");
      }

      const masterStudentName = externalStudent.full_name;

      // Check if this student ID is already linked to a local account
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("membership_number", registerForm.studentId)
        .maybeSingle();
      
      if (existingProfile) {
        throw new Error("This Student ID is already registered.");
      }

      // 2. Perform Supabase Auth Signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            full_name: registerForm.fullName || masterStudentName || "",
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed.");

      // 3. Update local profile with student data
      const sid = registerForm.studentId.trim();
      const { error: upsertError } = await supabase
        .from("user_profiles")
        .upsert({ 
          id: authData.user.id,
          email: registerForm.email.trim(), 
          membership_number: sid,
          full_name: registerForm.fullName || masterStudentName || "New Member",
          avatar_url: externalStudent.photo_url,
          membership_status: "active" 
        });

      if (upsertError) {
        console.error("Profile upsert error:", upsertError);
        // We don't throw here to avoid blocking registration if profile creation has a minor issue, 
        // but we should probably know about it.
      }

      toast.success("Registration successful! Check your email to verify.");
      setTab("login");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoverEmail);
      
      if (error) throw error;
      
      toast.success("Password recovery email sent!");
      setTab("login");
    } catch (error: any) {
      toast.error(error.message || "Failed to send recovery email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-padding">
        <div className="container-main max-w-md mx-auto">
          <div className="bg-card rounded-2xl p-8 card-shadow">
            {/* Login */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Welcome Back</h2>
                  <p className="text-muted-foreground text-sm mt-1">Access your student portal</p>
                </div>

                <AnimatePresence mode="wait">
                  {!loginPreview ? (
                    <motion.div
                      key="id-input"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Student ID or Email Address"
                          required
                          value={loginForm.email}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, email: e.target.value });
                            // Clear preview if they start typing an email
                            if (e.target.value.includes("@")) setLoginPreview(null);
                          }}
                          className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                        />
                        {isResolvingLogin && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                          </div>
                        )}
                      </div>
                      {idError && (
                        <p className="mt-2 text-xs font-bold text-red-500 px-1 animate-pulse">
                         {idError}
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="profile-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-4"
                    >
                      {/* Premium Profile Card */}
                      <div className="relative overflow-hidden group p-4 rounded-2xl border border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-sm">
                              {loginPreview.photo ? (
                                <img src={loginPreview.photo} alt={loginPreview.name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-8 h-8 text-primary" />
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 shadow-lg border-2 border-card">
                              <CheckCircle className="w-3 h-3" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Student Verified</p>
                            <h3 className="text-xl font-black text-foreground truncate">{loginPreview.name || "Student"}</h3>
                            <button 
                              type="button" 
                              onClick={() => {
                                setLoginForm({ ...loginForm, email: "" });
                                setLoginPreview(null);
                              }}
                              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-1"
                            >
                              Not you? <span className="underline decoration-primary/30">Switch ID</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Resolved/Manual Email Field */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Verify Email</p>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Registered Email"
                            required
                            value={loginPreview.email || ""}
                            onChange={(e) => setLoginPreview({ ...loginPreview, email: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          />
                          {!loginPreview.email && (
                            <p className="text-[10px] text-yellow-500 font-bold mt-1 px-1">
                              * Enter your registered email to continue
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Eye className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl pl-12 pr-12 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2.5 text-sm text-foreground font-semibold cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={loginForm.remember} 
                        onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })} 
                        className="accent-primary w-4 h-4" 
                      />
                      Remember login
                    </label>
                    <button type="button" onClick={() => setTab("recover")} className="text-primary text-sm font-bold hover:underline">
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 shadow-[0_8px_30px_rgb(var(--primary-rgb),0.2)]"
                >
                  {isLoading ? "Logging in..." : "Continue to Dashboard"}
                </button>
                <p className="text-center text-muted-foreground text-sm">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setTab("register")} className="text-primary font-semibold hover:underline">
                    Register
                  </button>
                </p>
              </form>
            )}

            {/* Register */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground text-center mb-6">Register</h2>
                <input type="text" placeholder="Full Name *" required value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <div className="relative">
                  <input type="text" placeholder="Student ID *" required value={registerForm.studentId} onChange={(e) => setRegisterForm({ ...registerForm, studentId: e.target.value })} className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground placeholder:text-primary focus:outline-none focus:ring-2 focus:ring-ring ${studentPreview ? 'border-primary' : 'border-border'}`} />
                  {isValidatingId && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />}
                </div>

                {/* Student Preview */}
                {studentPreview && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 shadow-sm"
                  >
                    <div className="w-16 h-16 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                      {studentPreview.photo ? (
                        <img src={studentPreview.photo} alt={studentPreview.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1.5 opacity-80">Student Found</p>
                      <p className="text-xl font-black text-foreground truncate leading-tight">{studentPreview.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Verified Record</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!studentPreview && registerForm.studentId.length >= 3 && !isValidatingId && (
                  <p className="text-[11px] text-red-400 font-medium px-1 italic">Student ID not found in master records.</p>
                )}
                <input type="email" placeholder="Email *" required value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Password *" required value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Confirm Password *" required value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10" />
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" required checked={registerForm.agreePrivacy} onChange={(e) => setRegisterForm({ ...registerForm, agreePrivacy: e.target.checked })} className="accent-primary" />
                  I agree to the Privacy & Policy *
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" required checked={registerForm.agreeTerms} onChange={(e) => setRegisterForm({ ...registerForm, agreeTerms: e.target.checked })} className="accent-primary" />
                  I agree with all terms & conditions *
                </label>
                <button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:brightness-110 transition-all disabled:opacity-70">
                  {isLoading ? "Registering..." : "Register"}
                </button>
                <p className="text-center text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-primary font-semibold hover:underline">
                    Login
                  </button>
                </p>
              </form>
            )}

            {/* Recover Password */}
            {tab === "recover" && (
              <form onSubmit={handleRecover} className="space-y-5">
                <h2 className="text-2xl font-bold text-foreground text-center mb-4">Recover Password</h2>
                <p className="text-muted-foreground text-sm text-center">Please enter your email address. You will receive a link to create a new password via email.</p>
                <input type="email" placeholder="E-mail" required value={recoverEmail} onChange={(e) => setRecoverEmail(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:brightness-110 transition-all disabled:opacity-70">
                  {isLoading ? "Sending..." : "Get New Password"}
                </button>
                <button type="button" onClick={() => setTab("login")} className="text-primary text-sm hover:underline block mx-auto">
                  Back to Login
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SignIn;
