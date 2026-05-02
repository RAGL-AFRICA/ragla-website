import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "./admin/FormBuilder";
import { Loader2, ShieldCheck, Zap, Sparkles, ArrowRight } from "lucide-react";
import AttendeeBadge from "./AttendeeBadge";
import { motion, AnimatePresence } from "framer-motion";

interface EventRegistrationFormProps {
  eventId: string;
  fields: FormField[];
  eventTitle: string;
  eventDate: string | null;
  eventLocation: string | null;
  onSuccess?: () => void;
}

const EventRegistrationForm = ({ 
  eventId, 
  fields, 
  eventTitle, 
  eventDate, 
  eventLocation, 
  onSuccess 
}: EventRegistrationFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    "Securing your unique seat...",
    "Validating leadership credentials...",
    "Preparing your exclusive digital pass...",
    "Finalising registration..."
  ];

  const getAttendeeName = () => {
    const nameLabels = ["Full Name", "Name", "Your Name", "fullname", "name"];
    for (const label of nameLabels) {
      if (formData[label]) return formData[label];
      const foundIdx = Object.keys(formData).find(k => k.toLowerCase() === label.toLowerCase());
      if (foundIdx) return formData[foundIdx];
    }
    const firstVal = Object.values(formData)[0];
    if (typeof firstVal === "string") return firstVal;
    return "Honoured Guest";
  };

  const handleInputChange = (fieldLabel: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldLabel]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const { data: formDataDb, error: formError } = await supabase
        .from("event_registration_forms")
        .select("id")
        .eq("event_id", eventId)
        .single();

      if (formError) throw formError;

      const { error: regError } = await supabase.from("event_registrations").insert([
        {
          event_id: eventId,
          form_id: formDataDb.id,
          data: formData,
        },
      ]);

      if (regError) throw regError;

      await new Promise(resolve => setTimeout(resolve, 1000)); // Ensure last step is seen
      setSubmitted(true);
      onSuccess?.();
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Failed to register: " + error.message);
    } finally {
      clearInterval(stepInterval);
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8 py-4"
        >
          <AttendeeBadge 
            attendeeName={getAttendeeName()}
            eventTitle={eventTitle}
            eventDate={eventDate}
            eventLocation={eventLocation}
            eventId={eventId}
          />
          <div className="text-center">
            <Button variant="link" className="text-muted-foreground transition-opacity hover:opacity-100 opacity-60" onClick={() => setSubmitted(false)}>
              Need to register someone else? Click here.
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center space-y-8 rounded-3xl"
          >
            <div className="relative">
               <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Zap className="w-8 h-8 text-primary animate-pulse" />
               </div>
            </div>
            <div className="text-center space-y-2">
               <motion.p 
                 key={loadingStep}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-xl font-bold tracking-tight text-foreground"
               >
                 {steps[loadingStep]}
               </motion.p>
               <p className="text-xs uppercase tracking-widest text-muted-foreground font-black opacity-50">Please do not refresh</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6">
          {fields.map((field, index) => (
            <motion.div 
              key={field.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2.5"
            >
              <Label htmlFor={field.id} className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 flex items-center gap-2">
                {field.label} {field.required && <Sparkles className="w-3 h-3 text-primary" />}
              </Label>
              
              <div className="relative group">
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    required={field.required}
                    placeholder={`Enter details...`}
                    className="bg-secondary/30 border-border/50 focus:bg-background transition-all min-h-[120px] resize-none rounded-2xl focus:ring-4 focus:ring-primary/10 border-transparent shadow-sm"
                    value={formData[field.label] || ""}
                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                  />
                ) : field.type === "select" ? (
                  <Select
                    required={field.required}
                    value={formData[field.label] || ""}
                    onValueChange={(val) => handleInputChange(field.label, val)}
                  >
                    <SelectTrigger id={field.id} className="bg-secondary/30 border-border/50 focus:bg-background transition-all h-14 rounded-2xl focus:ring-4 focus:ring-primary/10 border-transparent shadow-sm">
                      <SelectValue placeholder={`Select one...`} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl p-2">
                      {field.options?.map((opt) => (
                        <SelectItem key={opt} value={opt} className="rounded-xl py-3 cursor-pointer">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "checkbox" ? (
                  <div className="flex items-start space-x-4 pt-2 bg-secondary/20 p-5 rounded-2xl border border-border/20 group hover:border-primary/30 transition-colors cursor-pointer" 
                    onClick={() => handleInputChange(field.label, !formData[field.label])}>
                    <Checkbox
                      id={field.id}
                      className="mt-1 w-5 h-5 rounded-md border-2 border-primary/30 data-[state=checked]:bg-primary transition-all"
                      checked={formData[field.label] || false}
                      onCheckedChange={(checked) => handleInputChange(field.label, checked)}
                      required={field.required}
                    />
                    <label
                      htmlFor={field.id}
                      className="text-sm font-bold leading-relaxed cursor-pointer select-none text-foreground/70 group-hover:text-foreground transition-colors"
                    >
                      {field.label}
                    </label>
                  </div>
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    required={field.required}
                    placeholder={`Your ${field.label.toLowerCase()}...`}
                    className="bg-secondary/30 border-border/50 focus:bg-background transition-all h-14 rounded-2xl focus:ring-4 focus:ring-primary/10 border-transparent shadow-sm"
                    value={formData[field.label] || ""}
                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 space-y-4">
          <Button 
            type="submit" 
            className="w-full h-[60px] text-lg font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0 group relative overflow-hidden" 
            disabled={isSubmitting}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
               CLAIM MY EXCLUSIVE ACCESS
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Button>
          
          <div className="flex flex-col items-center gap-3">
             <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-40">
               <ShieldCheck className="w-3.5 h-3.5" />
               End-to-End Encrypted Registration
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventRegistrationForm;
