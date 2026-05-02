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
import { Loader2 } from "lucide-react";
import AttendeeBadge from "./AttendeeBadge";

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

  // Helper to find the attendee name from form data
  const getAttendeeName = () => {
    // Try common labels
    const nameLabels = ["Full Name", "Name", "Your Name", "fullname", "name"];
    for (const label of nameLabels) {
      if (formData[label]) return formData[label];
      // Case insensitive check
      const foundIdx = Object.keys(formData).find(k => k.toLowerCase() === label.toLowerCase());
      if (foundIdx) return formData[foundIdx];
    }
    // Fallback to first field value if it's a string
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

      setSubmitted(true);
      toast.success("Successfully registered for the event!");
      onSuccess?.();
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Failed to register: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-8 py-4">
        <AttendeeBadge 
          attendeeName={getAttendeeName()}
          eventTitle={eventTitle}
          eventDate={eventDate}
          eventLocation={eventLocation}
          eventId={eventId}
        />
        <div className="text-center">
          <Button variant="link" className="text-muted-foreground" onClick={() => setSubmitted(false)}>
            Need to register someone else? Click here.
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2.5">
            <Label htmlFor={field.id} className="text-sm font-bold tracking-tight text-foreground/80">
              {field.label} {field.required && <span className="text-primary italic">*</span>}
            </Label>
            
            <div className="relative group">
              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  required={field.required}
                  placeholder={`Enter your ${field.label.toLowerCase()}...`}
                  className="bg-secondary/50 border-border/50 focus:bg-background transition-all min-h-[100px] resize-none rounded-xl"
                  value={formData[field.label] || ""}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                />
              ) : field.type === "select" ? (
                <Select
                  required={field.required}
                  value={formData[field.label] || ""}
                  onValueChange={(val) => handleInputChange(field.label, val)}
                >
                  <SelectTrigger id={field.id} className="bg-secondary/50 border-border/50 focus:bg-background transition-all h-12 rounded-xl">
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {field.options?.map((opt) => (
                      <SelectItem key={opt} value={opt} className="rounded-lg">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "checkbox" ? (
                <div className="flex items-start space-x-3 pt-2 bg-secondary/30 p-4 rounded-xl border border-border/30">
                  <Checkbox
                    id={field.id}
                    className="mt-1"
                    checked={formData[field.label] || false}
                    onCheckedChange={(checked) => handleInputChange(field.label, checked)}
                    required={field.required}
                  />
                  <label
                    htmlFor={field.id}
                    className="text-sm font-medium leading-relaxed cursor-pointer select-none"
                  >
                    {field.label}
                  </label>
                </div>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  required={field.required}
                  placeholder={`Enter your ${field.label.toLowerCase()}...`}
                  className="bg-secondary/50 border-border/50 focus:bg-background transition-all h-12 rounded-xl"
                  value={formData[field.label] || ""}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full h-[52px] text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing registration...
          </>
        ) : (
          "Secure My Seat Now"
        )}
      </Button>
      
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold pt-2 opacity-60">
        <div className="h-[1px] flex-1 bg-border/50"></div>
        SECURE REGISTRATION
        <div className="h-[1px] flex-1 bg-border/50"></div>
      </div>
    </form>
  );
};

export default EventRegistrationForm;
