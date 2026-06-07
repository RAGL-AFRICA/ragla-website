import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Info, 
  Send,
  User,
  Briefcase,
  GraduationCap,
  Target,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import raglaLogo from "@/assets/ragla logo.png";
import isoBadge from "@/assets/iso-badge.png";

// --- VALIDATION SCHEMA ---
const applicationSchema = zod.object({
  personalInfo: zod.object({
    surname: zod.string().min(1, "Surname is required"),
    firstName: zod.string().min(1, "First name is required"),
    otherNames: zod.string().optional(),
    fullName: zod.string().optional(),
    gender: zod.string().min(1, "Gender is required"),
    dob: zod.string().min(1, "Date of birth is required"),
    nationality: zod.string().min(2, "Nationality is required"),
    mobile: zod.string().min(10, "Mobile number is required"),
    email: zod.string().email("Invalid email address"),
    residentialAddress: zod.string().min(5, "Residential address is required"),
  }),
  professionalInfo: zod.object({
    jobTitle: zod.string().min(2, "Job title is required"),
    organization: zod.string().min(2, "Organization is required"),
    industry: zod.string().min(2, "Industry is required"),
    yearsExperience: zod.string().min(1, "Years of experience is required"),
    workAddress: zod.string().min(5, "Work address is required"),
    businessPhone: zod.string().optional(),
    positionLevel: zod.array(zod.string()).min(1, "Please select at least one level"),
  }),
  education: zod.array(zod.object({
    qualification: zod.string().min(2, "Qualification is required"),
    institution: zod.string().min(2, "Institution is required"),
    country: zod.string().min(2, "Country is required"),
    year: zod.string().min(4, "Year is required"),
  })),
  programObjective: zod.string().min(20, "Please provide more details about your objective"),
  sponsorship: zod.object({
    type: zod.enum(["Self-Sponsored", "Employer-Sponsored"]),
    organizationName: zod.string().optional(),
    contactPerson: zod.string().optional(),
    designation: zod.string().optional(),
    emailPhone: zod.string().optional(),
  }),
  declaration: zod.boolean().refine(val => val === true, "You must accept the declaration"),
  signature: zod.string().min(2, "Digital signature is required"),
  date: zod.string().min(1, "Date is required"),
});

type ApplicationData = zod.infer<typeof applicationSchema>;

const Apply = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      personalInfo: { gender: "Male", surname: "", firstName: "", otherNames: "", dobDay: "", dobMonth: "", dobYear: "" },
      professionalInfo: { positionLevel: [] },
      education: [{ qualification: "", institution: "", country: "", year: "" }],
      sponsorship: { type: "Self-Sponsored" },
      declaration: false,
      date: new Date().toISOString().split('T')[0]
    }
  });

  // Compose `personalInfo.fullName` from the split name fields
  const surname = watch("personalInfo.surname");
  const firstName = watch("personalInfo.firstName");
  const otherNames = watch("personalInfo.otherNames");
  const dobDay = watch("personalInfo.dobDay");
  const dobMonth = watch("personalInfo.dobMonth");
  const dobYear = watch("personalInfo.dobYear");

  useEffect(() => {
    const s = (surname || "").trim();
    const f = (firstName || "").trim();
    const o = (otherNames || "").trim();
    if (s || f || o) {
      const composed = `${s}${f ? ", " + f : ""}${o ? " " + o : ""}`;
      setValue("personalInfo.fullName", composed, { shouldDirty: true });
    } else {
      setValue("personalInfo.fullName", "", { shouldDirty: true });
    }
  }, [surname, firstName, otherNames, setValue]);

  // Compose DOB from selects as ISO YYYY-MM-DD for backend
  useEffect(() => {
    if (dobYear && dobMonth && dobDay) {
      const mm = String(dobMonth).padStart(2, '0');
      const dd = String(dobDay).padStart(2, '0');
      const iso = `${dobYear}-${mm}-${dd}`;
      setValue("personalInfo.dob", iso, { shouldDirty: true });
    } else {
      setValue("personalInfo.dob", "", { shouldDirty: true });
    }
  }, [dobDay, dobMonth, dobYear, setValue]);

  // helper arrays for DOB selects
  const currentYear = new Date().getFullYear();
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => String(currentYear - i));

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education"
  });

  const onSubmit = async (data: ApplicationData) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("programme_applications")
        .insert([{
          data,
          status: 'pending',
          submitted_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast.error("Submission failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="py-32 px-6">
          <div className="container-main max-w-xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card card-shadow rounded-3xl p-12 border border-border"
            >
              <div className="h-20 w-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black mb-4">Application Submitted</h2>
              <p className="text-muted-foreground mb-8">
                Your official RPCSGL application has been recorded. Our admissions committee will review your documents and get back to you within 3-5 working days.
              </p>
              <Button 
                size="lg" 
                className="w-full h-14 rounded-xl font-bold bg-primary text-primary-foreground hover:brightness-110" 
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </Button>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Helmet>
        <title>Apply Now | RPCSGL Programme - RAGLA</title>
        <meta name="description" content="Official RPCSGL Application Form. Joint the Royal Academy of Governance & Leadership Africa." />
      </Helmet>
      <Header />

      <section className="pt-24 pb-20">
        <div className="container-main max-w-5xl mx-auto">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 shadow-2xl rounded-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden print:shadow-none print:border-none">
              
              {/* --- FORM HEADER (Matching Paper Style) --- */}
              <div className="p-8 md:p-12 border-b-2 border-primary/20 bg-slate-50/50 dark:bg-zinc-900/50">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <img src={raglaLogo} alt="RAGLA Logo" className="h-24 md:h-32 object-contain" />
                  </div>
                  <div className="text-center md:text-right max-w-sm lg:max-w-lg">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-zinc-100 tracking-tight leading-tight">
                      ROYAL ACADEMY OF <br/>
                      <span className="text-primary">GOVERNANCE & LEADERSHIP AFRICA</span>
                    </h1>
                    <div className="w-16 h-1 bg-primary ml-auto mt-2 mb-2 hidden md:block" />
                    <p className="text-xs italic text-amber-600 font-serif font-semibold">Servitum Integritas Phasellus</p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src={isoBadge} alt="ISO Certification" className="w-28 h-28 object-contain relative z-10" />
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                    APPLICATION FORM
                  </h2>
                  <p className="text-amber-700 dark:text-amber-500 font-bold text-sm md:text-base tracking-wide">
                    ROYAL PROFESSIONAL CERTIFICATE IN STRATEGIC GOVERNANCE AND LEADERSHIP (RPCSGL)
                  </p>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mt-4">
                    Please complete this form in <span className="text-slate-900 dark:text-slate-100 font-bold">BLOCK LETTERS</span> and attach all required documents.
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-14 space-y-12">
                
                {/* --- 1. PERSONAL INFORMATION --- */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 w-8 h-8 flex items-center justify-center font-black rounded-xs">1</div>
                    <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white">Personal Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="space-y-2 col-span-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Full Name (Surname, First Name, Other Names)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Input {...register("personalInfo.surname")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg font-medium" placeholder="DOE" />
                          {errors.personalInfo?.surname && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.personalInfo.surname.message}</p>}
                        </div>
                        <div className="space-y-1">
                          <Input {...register("personalInfo.firstName")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg font-medium" placeholder="JOHN" />
                          {errors.personalInfo?.firstName && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.personalInfo.firstName.message}</p>}
                        </div>
                        <div className="space-y-1">
                          <Input {...register("personalInfo.otherNames")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg font-medium" placeholder="SMITH (OPTIONAL)" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Gender</Label>
                      <Input {...register("personalInfo.gender")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" placeholder="E.G. MALE, FEMALE, ETC." />
                      {errors.personalInfo?.gender && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.personalInfo.gender.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Date of Birth (DD/MM/YYYY)</Label>
                      <div className="flex gap-2">
                        <select {...register("personalInfo.dobDay")} className="w-1/3 border-0 border-b-2 border-slate-200 dark:border-zinc-800 bg-transparent px-3 py-2 focus-visible:ring-0 focus-visible:border-primary">
                          <option value="">Day</option>
                          {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select {...register("personalInfo.dobMonth")} className="w-1/3 border-0 border-b-2 border-slate-200 dark:border-zinc-800 bg-transparent px-3 py-2 focus-visible:ring-0 focus-visible:border-primary">
                          <option value="">Month</option>
                          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                        <select {...register("personalInfo.dobYear")} className="w-1/3 border-0 border-b-2 border-slate-200 dark:border-zinc-800 bg-transparent px-3 py-2 focus-visible:ring-0 focus-visible:border-primary">
                          <option value="">Year</option>
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      {errors.personalInfo?.dob && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.personalInfo.dob.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Nationality</Label>
                      <Input {...register("personalInfo.nationality")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" placeholder="COUNTRY" />
                    </div>

                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Mobile Number</Label>
                      <Input type="tel" {...register("personalInfo.mobile")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" placeholder="+XXX" />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Email Address</Label>
                      <Input type="email" {...register("personalInfo.email")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" placeholder="EMAIL@EXAMPLE.COM" />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Residential Address</Label>
                      <Textarea {...register("personalInfo.residentialAddress")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors min-h-[80px] resize-none font-medium" placeholder="STREET, CITY, STATE" />
                    </div>
                  </div>
                </div>

                {/* --- 2. PROFESSIONAL INFORMATION --- */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 w-8 h-8 flex items-center justify-center font-black rounded-xs">2</div>
                    <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white">Professional Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Current Job Title</Label>
                      <Input {...register("professionalInfo.jobTitle")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Organization / Institution</Label>
                      <Input {...register("professionalInfo.organization")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Industry / Sector</Label>
                      <Input {...register("professionalInfo.industry")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Years of Professional Experience</Label>
                      <Input type="number" {...register("professionalInfo.yearsExperience")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Work Address</Label>
                      <Input {...register("professionalInfo.workAddress")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Business Telephone</Label>
                      <Input type="tel" {...register("professionalInfo.businessPhone")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                    </div>

                    <div className="space-y-3 col-span-2">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Position Level</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                        {["Executive", "Senior Management", "Middle Management", "Other"].map(level => (
                          <div key={level} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`level-${level}`} 
                              onCheckedChange={(checked) => {
                                const current = watch("professionalInfo.positionLevel");
                                if (checked) setValue("professionalInfo.positionLevel", [...current, level]);
                                else setValue("professionalInfo.positionLevel", current.filter(l => l !== level));
                              }}
                              className="border-slate-400"
                            />
                            <Label htmlFor={`level-${level}`} className="text-sm font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer">{level}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 3. EDUCATIONAL BACKGROUND --- */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 w-8 h-8 flex items-center justify-center font-black rounded-xs">3</div>
                      <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white">Educational Background</h3>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ qualification: "", institution: "", country: "", year: "" })} className="gap-2 text-[10px] font-bold uppercase tracking-widest">
                       <Plus className="w-3 h-3" /> Add Row
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="overflow-x-auto border-2 border-slate-100 dark:border-zinc-800 rounded-lg">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-900/5 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-zinc-400">
                            <th className="p-4 border-b border-r border-slate-200 dark:border-zinc-700">Qualification (Highest First)</th>
                            <th className="p-4 border-b border-r border-slate-200 dark:border-zinc-700">Institution Attended</th>
                            <th className="p-4 border-b border-r border-slate-200 dark:border-zinc-700">Country</th>
                            <th className="p-4 border-b border-r border-slate-200 dark:border-zinc-700 w-24">Year Obtained</th>
                            <th className="p-4 border-b border-slate-200 dark:border-zinc-700 w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                              <td className="p-2 border-b border-r border-slate-100 dark:border-zinc-800">
                                <Input {...register(`education.${index}.qualification`)} className="border-0 focus-visible:ring-1 focus-visible:ring-primary font-medium bg-transparent" />
                              </td>
                              <td className="p-2 border-b border-r border-slate-100 dark:border-zinc-800">
                                <Input {...register(`education.${index}.institution`)} className="border-0 focus-visible:ring-1 focus-visible:ring-primary font-medium bg-transparent" />
                              </td>
                              <td className="p-2 border-b border-r border-slate-100 dark:border-zinc-800">
                                <Input {...register(`education.${index}.country`)} className="border-0 focus-visible:ring-1 focus-visible:ring-primary font-medium bg-transparent" />
                              </td>
                              <td className="p-2 border-b border-r border-slate-100 dark:border-zinc-800">
                                <Input type="number" {...register(`education.${index}.year`)} placeholder="2024" className="border-0 focus-visible:ring-1 focus-visible:ring-primary font-medium bg-transparent" />
                              </td>
                              <td className="p-2 border-b border-slate-100 dark:border-zinc-800 text-center">
                                {index > 0 && (
                                  <button type="button" onClick={() => remove(index)} className="text-zinc-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic flex items-center gap-1 md:hidden pl-1">
                      <Info className="w-3 h-3" /> Swipe left to view full table
                    </p>
                    {/* Mobile-friendly stacked view for education entries */}
                    <div className="md:hidden space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg bg-white/50 dark:bg-zinc-900/30">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Qualification</Label>
                            <Input {...register(`education.${index}.qualification`)} className="border-0 focus-visible:ring-1 focus-visible:ring-primary font-medium bg-transparent" placeholder="e.g. MSc. Management" />
                          </div>
                          <div className="space-y-2 mt-3">
                            <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Institution</Label>
                            <Input {...register(`education.${index}.institution`)} className="border-0 focus-visible:ring-1 focus-visible:ring-primary font-medium bg-transparent" placeholder="e.g. University of Ghana" />
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Country</Label>
                              <Input {...register(`education.${index}.country`)} className="border-0 focus-visible:ring-1 focus-visible:ring-primary font-medium bg-transparent" placeholder="Country" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Year Obtained</Label>
                              <Input type="number" {...register(`education.${index}.year`)} className="border-0 focus-visible:ring-1 focus-visible:ring-primary font-medium bg-transparent" placeholder="2024" />
                            </div>
                          </div>
                          <div className="flex justify-end mt-3">
                            {index > 0 && (
                              <button type="button" onClick={() => remove(index)} className="text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-2">
                                <Trash2 size={16} /> Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- 4. PROGRAM OBJECTIVE --- */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 w-8 h-8 flex items-center justify-center font-black rounded-xs">4</div>
                    <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white">Program Objective</h3>
                  </div>
                  <div className="space-y-3">
                    <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Briefly state why you wish to participate in this program and how it aligns with your career goals.</Label>
                    <Textarea 
                      {...register("programObjective")} 
                      className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors min-h-[140px] resize-none font-medium leading-relaxed" 
                      placeholder="YOUR RESPONSE..."
                    />
                    {errors.programObjective && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.programObjective.message}</p>}
                  </div>
                </div>

                {/* --- 5. SPONSORSHIP INFORMATION --- */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 w-8 h-8 flex items-center justify-center font-black rounded-xs">5</div>
                    <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white">Sponsorship Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="space-y-3 col-span-2">
                       <RadioGroup 
                         defaultValue="Self-Sponsored" 
                         onValueChange={(val) => setValue("sponsorship.type", val as any)}
                         className="flex gap-8 pt-1"
                       >
                         {["Self-Sponsored", "Employer-Sponsored"].map(type => (
                           <div key={type} className="flex items-center space-x-2">
                             <RadioGroupItem value={type} id={`sponsor-${type}`} className="border-slate-400 text-primary" />
                             <Label htmlFor={`sponsor-${type}`} className="text-sm font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer">{type}</Label>
                           </div>
                         ))}
                       </RadioGroup>
                    </div>

                    <AnimatePresence>
                      {watch("sponsorship.type") === "Employer-Sponsored" && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="col-span-2 grid md:grid-cols-2 gap-x-10 gap-y-6 border-l-4 border-amber-400 pl-6 py-2 bg-amber-50/20 dark:bg-amber-900/10 rounded-r-lg"
                        >
                          <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Name of Sponsoring Organization (if applicable)</Label>
                            <Input {...register("sponsorship.organizationName")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                          </div>
                          <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Contact Person</Label>
                            <Input {...register("sponsorship.contactPerson")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                          </div>
                          <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Designation</Label>
                            <Input {...register("sponsorship.designation")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                          </div>
                          <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Email / Phone</Label>
                            <Input {...register("sponsorship.emailPhone")} className="border-0 border-b-2 border-slate-200 dark:border-zinc-800 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* --- 6. DECLARATION --- */}
                <div className="space-y-6 pt-6 border-t-2 border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 w-8 h-8 flex items-center justify-center font-black rounded-xs">6</div>
                    <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white">Declaration</h3>
                  </div>
                  
                  <div className="p-8 md:p-10 bg-slate-900 text-white rounded-lg space-y-6">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        id="declaration-box" 
                        onCheckedChange={(checked) => setValue("declaration", !!checked)}
                        className="mt-1 border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-slate-900" 
                      />
                      <Label htmlFor="declaration-box" className="text-xs md:text-sm italic font-medium leading-relaxed cursor-pointer text-zinc-200">
                        I hereby declare that the information provided in this application is true, complete, and accurate to the best of my knowledge. I understand that any false information or omission may result in disqualification from the program.
                      </Label>
                    </div>
                    {errors.declaration && <p className="text-[10px] text-red-400 font-bold uppercase">{errors.declaration.message}</p>}

                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-2">
                        <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-400">Applicant's Digital Signature (Type Name)</Label>
                        <Input {...register("signature")} className="border-0 border-b-2 border-white/20 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors text-xl font-serif italic text-white" />
                        {errors.signature && <p className="text-[10px] text-red-400 font-bold uppercase">{errors.signature.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="uppercase text-[10px] font-bold tracking-widest text-zinc-400">Date</Label>
                        <Input type="date" {...register("date")} className="border-0 border-b-2 border-white/20 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- OFFICIAL USE (Exact matches) --- */}
                <div className="pt-10 opacity-40 select-none grayscale pointer-events-none hidden md:block">
                   <div className="border-2 border-dashed border-zinc-300 p-8 rounded-xl relative">
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">For Official Use Only</span>
                      <div className="grid grid-cols-2 gap-x-20 gap-y-8">
                         <div className="border-b border-zinc-200 h-8 flex items-end text-[10px] uppercase font-bold text-zinc-300">Application No: ____________________</div>
                         <div className="border-b border-zinc-200 h-8 flex items-end text-[10px] uppercase font-bold text-zinc-300">Date Received: ____________________</div>
                         <div className="col-span-2 flex items-center gap-10 text-[10px] uppercase font-bold text-zinc-300">
                            Admission Status: 
                            <div className="flex gap-4">
                               <div className="flex items-center gap-1"><div className="w-3 h-3 border border-zinc-300" /> Approved</div>
                               <div className="flex items-center gap-1"><div className="w-3 h-3 border border-zinc-300" /> Pending</div>
                               <div className="flex items-center gap-1"><div className="w-3 h-3 border border-zinc-300" /> Not Approved</div>
                            </div>
                         </div>
                         <div className="border-b border-zinc-200 h-8 flex items-end text-[10px] uppercase font-bold text-zinc-300">Authorized By: ____________________</div>
                         <div className="border-b border-zinc-200 h-8 flex items-end text-[10px] uppercase font-bold text-zinc-300">Date: ____/____/________</div>
                      </div>
                   </div>
                </div>

              </div>

              {/* --- FORM FOOTER --- */}
              <div className="p-6 md:p-8 bg-slate-950 text-white flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                   <div className="flex flex-col">
                      <span className="text-zinc-400">Headquarters</span>
                      <span>Accra, Ghana | Africa</span>
                   </div>
                   <div className="flex flex-col md:border-l md:border-white/10 md:pl-6">
                      <span className="text-zinc-400">Contact</span>
                      <span>+233 256 257 507</span>
                   </div>
                </div>
                <div className="flex flex-col">
                   <span className="text-amber-400">Building Leaders</span>
                   <span className="text-zinc-200">Strengthening Institutions</span>
                   <span className="text-zinc-300">Transforming Africa</span>
                </div>
              </div>

            </div>

            <div className="flex justify-center pt-8 pb-10">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="h-14 md:h-16 px-8 md:px-12 rounded-2xl bg-primary text-primary-foreground font-black text-sm md:text-lg hover:brightness-110 card-shadow transition-all group w-full md:w-auto"
              >
                {isSubmitting ? "Processing Application..." : (
                  <span className="flex items-center justify-center gap-3">
                    SUBMIT OFFICIAL APPLICATION <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </form>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Apply;
