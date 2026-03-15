import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Tab = "login" | "register" | "recover";

const SignIn = () => {
  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "", remember: false });
  // Register form
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "", firstName: "", lastName: "", agreePrivacy: false, agreeTerms: false });
  // Recover form
  const [recoverEmail, setRecoverEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Ready for Supabase auth
    console.log("Login:", loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Ready for Supabase auth
    console.log("Register:", registerForm);
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    // Ready for Supabase auth
    console.log("Recover:", recoverEmail);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-padding">
        <div className="container-main max-w-md mx-auto">
          <div className="bg-card rounded-2xl p-8 card-shadow">
            {/* Login */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <h2 className="text-2xl font-bold text-foreground text-center mb-6">Login</h2>
                <input
                  type="text"
                  placeholder="Username or Email Address"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={loginForm.remember} onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })} className="accent-primary" />
                  Remember Me
                </label>
                <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:brightness-110 transition-all">
                  Log In
                </button>
                <button type="button" onClick={() => setTab("recover")} className="text-primary text-sm hover:underline block mx-auto">
                  Recover Password
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
                <input type="text" placeholder="Username *" required value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input type="email" placeholder="Email *" required value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Password *" required value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <input type="text" placeholder="First Name" value={registerForm.firstName} onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input type="text" placeholder="Last Name" value={registerForm.lastName} onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" required checked={registerForm.agreePrivacy} onChange={(e) => setRegisterForm({ ...registerForm, agreePrivacy: e.target.checked })} className="accent-primary" />
                  I agree to the Privacy & Policy *
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" required checked={registerForm.agreeTerms} onChange={(e) => setRegisterForm({ ...registerForm, agreeTerms: e.target.checked })} className="accent-primary" />
                  I agree with all terms & conditions *
                </label>
                <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:brightness-110 transition-all">
                  Register
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
                <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:brightness-110 transition-all">
                  Get New Password
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
