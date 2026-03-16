import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UploadCloud } from "lucide-react";

const MEMBERSHIP_CATEGORIES = [
  "Affiliate Membership",
  "Associate Membership",
  "Certified Membership",
  "Chartered Membership",
  "Fellow Membership"
];

const Apply = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    profession: "",
    place_of_work: "",
    work_address: "",
    current_rank: "",
    work_experience: "",
    industry: "",
    academic_qualification: "",
    added_qualification: "",
    membership_category: "",
    ragla_number: "",
    other_membership: "",
    professional_referees: "",
    academic_referee: "",
    statement_of_purpose: ""
  });

  const [files, setFiles] = useState<{
    payment_evidence: File | null;
    passport_photo: File | null;
    resume: File | null;
    certificates: File | null;
  }>({
    payment_evidence: null,
    passport_photo: null,
    resume: null,
    certificates: null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof files) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles({ ...files, [key]: e.target.files[0] });
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('membership_applications')
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('membership_applications')
      .getPublicUrl(filePath);
      
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!files.payment_evidence || !files.passport_photo || !files.resume || !files.certificates) {
        throw new Error("Please upload all required files.");
      }

      // 1. Upload all files concurrently
      const [paymentUrl, photoUrl, resumeUrl, certificatesUrl] = await Promise.all([
        uploadFile(files.payment_evidence, 'payments'),
        uploadFile(files.passport_photo, 'photos'),
        uploadFile(files.resume, 'resumes'),
        uploadFile(files.certificates, 'certificates')
      ]);

      // 2. Insert record into database
      const { error } = await supabase
        .from("membership_applications")
        .insert([{
          ...form,
          payment_evidence_url: paymentUrl,
          passport_photo_url: photoUrl,
          resume_url: resumeUrl,
          certificates_url: certificatesUrl
        }]);

      if (error) throw error;

      toast({ 
        title: "Application Submitted!", 
        description: "Your application has been received successfully." 
      });

      // Redirect or reset form could go here
      window.scrollTo(0, 0);
      setTimeout(() => window.location.reload(), 2000); // Simplest reset for massive forms

    } catch (error: any) {
       toast({ 
        title: "Submission Error", 
        description: error.message || "Please check your inputs and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-padding bg-secondary">
        <div className="container-main max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">RAGLA REGISTRATION FORMS</p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Certified Professional Membership</h1>
          <p className="text-muted-foreground">
            These forms are to be completed by applicants who intend to register as Certified Professional Members of Royal Academy of Governance and Leadership Africa (RAGLA).
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main max-w-4xl mx-auto">
          <div className="bg-card p-6 md:p-10 rounded-2xl border border-border card-shadow">
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground border-b pb-2">Personal & Contact Info</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number(s) *</label>
                    <input type="text" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Email Address *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                </div>
              </div>

              {/* Work Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground border-b pb-2">Professional Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Profession *</label>
                    <input type="text" required value={form.profession} onChange={e => setForm({...form, profession: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Place of Work *</label>
                    <input type="text" required value={form.place_of_work} onChange={e => setForm({...form, place_of_work: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Work Address (Digital Address preferably) *</label>
                    <input type="text" required value={form.work_address} onChange={e => setForm({...form, work_address: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Rank/Position *</label>
                    <input type="text" required value={form.current_rank} onChange={e => setForm({...form, current_rank: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Relevant Work Experience *</label>
                    <input type="text" required value={form.work_experience} onChange={e => setForm({...form, work_experience: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Industry/Sector of Work</label>
                    <input type="text" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground border-b pb-2">Academic & Membership</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Highest Academic Qualification *</label>
                    <input type="text" required value={form.academic_qualification} onChange={e => setForm({...form, academic_qualification: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Any Added Qualification(s)</label>
                    <input type="text" value={form.added_qualification} onChange={e => setForm({...form, added_qualification: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Membership Category Applied For *</label>
                    <select required value={form.membership_category} onChange={e => setForm({...form, membership_category: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3">
                      <option value="">Select Category</option>
                      {MEMBERSHIP_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">RAGLA Membership Number (If any)</label>
                    <input type="text" value={form.ragla_number} onChange={e => setForm({...form, ragla_number: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Other Professional Membership</label>
                    <input type="text" value={form.other_membership} onChange={e => setForm({...form, other_membership: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3" />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground border-b pb-2">Required Uploads</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  
                  {/* Evidence of Payment */}
                  <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center text-center justify-center bg-background">
                    <UploadCloud className="w-8 h-8 text-primary mb-2" />
                    <label className="block text-sm font-medium mb-1">Evidence of Payment (GH500 / 50USD) *</label>
                    <span className="text-xs text-muted-foreground mb-3">PDF, document, or image. Max 10MB</span>
                    <input type="file" required onChange={e => handleFileChange(e, 'payment_evidence')} className="text-sm w-full max-w-[250px]" />
                  </div>

                  {/* Passport Photo */}
                  <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center text-center justify-center bg-background">
                    <UploadCloud className="w-8 h-8 text-primary mb-2" />
                    <label className="block text-sm font-medium mb-1">Most Recent Passport Photograph *</label>
                    <span className="text-xs text-muted-foreground mb-3">Image. Max 10MB</span>
                    <input type="file" accept="image/*" required onChange={e => handleFileChange(e, 'passport_photo')} className="text-sm w-full max-w-[250px]" />
                  </div>

                  {/* Resume */}
                  <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center text-center justify-center bg-background">
                    <UploadCloud className="w-8 h-8 text-primary mb-2" />
                    <label className="block text-sm font-medium mb-1">Updated Summarized Resume *</label>
                    <span className="text-xs text-muted-foreground mb-3">PDF. Max 10MB</span>
                    <input type="file" accept=".pdf" required onChange={e => handleFileChange(e, 'resume')} className="text-sm w-full max-w-[250px]" />
                  </div>

                  {/* Certificates */}
                  <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center text-center justify-center bg-background">
                    <UploadCloud className="w-8 h-8 text-primary mb-2" />
                    <label className="block text-sm font-medium mb-1">Academic/Professional Certificates *</label>
                    <span className="text-xs text-muted-foreground mb-3">PDF. Max 10MB</span>
                    <input type="file" accept=".pdf" required onChange={e => handleFileChange(e, 'certificates')} className="text-sm w-full max-w-[250px]" />
                  </div>

                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground border-b pb-2">Additional Information</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Two Professional/Work-Related Referees *</label>
                    <span className="text-xs text-muted-foreground block mb-2">Provide Name, Address, and Contact details.</span>
                    <textarea required rows={4} value={form.professional_referees} onChange={e => setForm({...form, professional_referees: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Academic Referee (Optional)</label>
                    <span className="text-xs text-muted-foreground block mb-2">Provide Name, Address, and Contact details.</span>
                    <textarea rows={3} value={form.academic_referee} onChange={e => setForm({...form, academic_referee: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Statement of Purpose (SOP) *</label>
                    <span className="text-xs text-muted-foreground block mb-2">Provide a brief statement of who you are, your professional/academic interests, motivation for joining RAGLA, and the value you will add.</span>
                    <textarea required rows={6} value={form.statement_of_purpose} onChange={e => setForm({...form, statement_of_purpose: e.target.value})} className="w-full bg-background border rounded-lg px-4 py-3 resize-none" />
                  </div>
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all disabled:opacity-70 shadow-xl shadow-primary/20">
                {isSubmitting ? "Submitting Application..." : "Submit Application Form"}
              </button>

            </form>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Apply;
