import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { FileText, Download, UserCheck, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type MembershipApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  membership_category: string;
  status: string;
  created_at: string;
  
  // Files
  payment_evidence_url: string;
  passport_photo_url: string;
  resume_url: string;
  certificates_url: string;

  // Additional Data
  place_of_work: string;
  work_address: string;
  current_rank: string;
  work_experience: string;
  industry: string;
  academic_qualification: string;
  added_qualification: string;
  ragla_number: string;
  other_membership: string;
  professional_referees: string;
  academic_referee: string;
  statement_of_purpose: string;
};

const ManageApplications = () => {
  const [apps, setApps] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("membership_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApps(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch applications: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("membership_applications")
        .update({ status: newStatus })
        .eq("id", id);
        
      if (error) throw error;
      
      setApps(apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
      toast.success(`Application marked as ${newStatus}`);
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const FileLink = ({ url, label }: { url: string, label: string }) => (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-3 rounded-lg border bg-background hover:bg-muted transition-colors text-sm font-medium"
    >
      <Download className="w-4 h-4 text-primary" />
      {label}
    </a>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Applications</h1>
          <p className="text-muted-foreground mt-2">
            Review and process RAGLA Certified Professional Membership applications.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(n => <div key={n} className="bg-muted h-24 rounded-xl"></div>)}
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No applications found</h3>
          <p className="text-muted-foreground">Applications submitted via the website will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {apps.map((app) => (
            <div key={app.id} className="bg-card rounded-xl border border-border overflow-hidden card-shadow">
              
              {/* Header / Summary row */}
              <div 
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border">
                    <img src={app.passport_photo_url} alt={app.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{app.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-primary">{app.membership_category}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  {expandedId === app.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === app.id && (
                <div className="p-6 border-t border-border bg-muted/20 space-y-8">
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end pb-4 border-b border-border">
                    <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(app.id, 'pending')} disabled={app.status === 'pending'}>
                      <Clock className="w-4 h-4 mr-2" /> Mark Pending
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(app.id, 'rejected')} disabled={app.status === 'rejected'}>
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(app.id, 'approved')} disabled={app.status === 'approved'}>
                      <UserCheck className="w-4 h-4 mr-2" /> Approve
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Column 1: Core Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider border-b pb-2">Contact Info</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-muted-foreground">Email:</span> {app.email}</p>
                          <p><span className="text-muted-foreground">Phone:</span> {app.phone}</p>
                          <p><span className="text-muted-foreground">Place of Work:</span> {app.place_of_work}</p>
                          <p><span className="text-muted-foreground">Work Address:</span> {app.work_address}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider border-b pb-2">Professional Profile</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-muted-foreground">Profession:</span> {app.profession}</p>
                          <p><span className="text-muted-foreground">Current Rank/Position:</span> {app.current_rank}</p>
                          <p><span className="text-muted-foreground">Experience:</span> {app.work_experience}</p>
                          <p><span className="text-muted-foreground">Industry:</span> {app.industry || 'N/A'}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider border-b pb-2">Files & Documents</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <FileLink url={app.payment_evidence_url} label="Payment Proof" />
                          <FileLink url={app.passport_photo_url} label="Passport Photo" />
                          <FileLink url={app.resume_url} label="Resume (CV)" />
                          <FileLink url={app.certificates_url} label="Certificates" />
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Extended Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider border-b pb-2">Academic & Memberships</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-muted-foreground">Highest Qualification:</span> {app.academic_qualification}</p>
                          <p><span className="text-muted-foreground">Added Qualification:</span> {app.added_qualification || 'None'}</p>
                          <p><span className="text-muted-foreground">RAGLA Number (if any):</span> {app.ragla_number || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Other Memberships:</span> {app.other_membership || 'None'}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider border-b pb-2">References</h4>
                        <div className="space-y-4 text-sm">
                          <div>
                            <span className="text-muted-foreground block mb-1">Professional/Work Referees:</span>
                            <p className="whitespace-pre-wrap bg-background p-3 rounded-md border">{app.professional_referees}</p>
                          </div>
                          {app.academic_referee && (
                            <div>
                              <span className="text-muted-foreground block mb-1">Academic Referee:</span>
                              <p className="whitespace-pre-wrap bg-background p-3 rounded-md border">{app.academic_referee}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full width SOP */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider border-b pb-2">Statement of Purpose</h4>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed bg-background p-4 rounded-md border">
                      {app.statement_of_purpose}
                    </p>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
