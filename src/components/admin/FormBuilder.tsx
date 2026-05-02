import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type FieldType = "text" | "email" | "tel" | "number" | "textarea" | "select" | "checkbox";

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Short Text" },
  { value: "email", label: "Email Address" },
  { value: "tel", label: "Phone Number" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Long Text" },
  { value: "select", label: "Dropdown Select" },
  { value: "checkbox", label: "Checkbox" },
];

const FormBuilder = ({ fields, onChange }: FormBuilderProps) => {
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    
    const newField: FormField = {
      id: generateId(),
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: false,
      options: newFieldType === "select" ? ["Option 1", "Option 2"] : undefined,
    };
    
    onChange([...fields, newField]);
    setNewFieldLabel("");
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    onChange(newFields);
  };

  const addQuickField = (label: string, type: FieldType, required: boolean = true) => {
    const newField: FormField = {
      id: generateId(),
      label,
      type,
      required,
    };
    onChange([...fields, newField]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-muted-foreground w-full mb-1">Quick Add:</span>
        <Button variant="outline" size="sm" onClick={() => addQuickField("Full Name", "text")}>Full Name</Button>
        <Button variant="outline" size="sm" onClick={() => addQuickField("Email", "email")}>Email</Button>
        <Button variant="outline" size="sm" onClick={() => addQuickField("Phone Number", "tel", false)}>Phone</Button>
        <Button variant="outline" size="sm" onClick={() => addQuickField("Organisation", "text", false)}>Organisation</Button>
      </div>

      <div className="bg-muted/30 border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,150px,auto] gap-3 items-end">
          <div className="space-y-2">
            <Label htmlFor="new-field-label">Custom Field Label</Label>
            <Input
              id="new-field-label"
              placeholder="e.g. Dietary Requirements"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addField())}
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={newFieldType} onValueChange={(val: FieldType) => setNewFieldType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={addField} disabled={!newFieldLabel.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground bg-background">
            No fields added yet. Add some fields to create your registration form.
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} className="bg-background border rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="capitalize">{field.type}</Badge>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="font-medium h-8 border-none focus-visible:ring-0 px-0"
                    />
                  </div>
                  
                  {field.type === "select" && (
                    <div className="space-y-2 pl-4 border-l-2">
                      <Label className="text-xs uppercase text-muted-foreground">Options (comma separated)</Label>
                      <Input
                        placeholder="Option 1, Option 2, Option 3"
                        value={field.options?.join(", ") || ""}
                        onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map(o => o.trim()).filter(Boolean) })}
                        className="h-8"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`req-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(val) => updateField(field.id, { required: val })}
                      />
                      <Label htmlFor={`req-${field.id}`} className="text-sm cursor-pointer">Required field</Label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveField(index, "up")} disabled={index === 0}>
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveField(index, "down")} disabled={index === fields.length - 1}>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeField(field.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
