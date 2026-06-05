import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  FileText, 
  Trash2, 
  Search,
  FileSpreadsheet,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Application {
  id: string;
  data: any;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

const ManageApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("programme_applications")
        .select("*")
        .order("submitted_at", { ascending: false });
      
      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch applications: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("programme_applications")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success(`Application ${status}`);
      setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
      if (viewingApp?.id === id) setViewingApp(null);
    } catch (error: any) {
      toast.error("Status update failed: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const { error } = await supabase.from("programme_applications").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Application deleted");
      setApplications(applications.filter(app => app.id !== id));
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  const exportToCSV = () => {
    if (applications.length === 0) return;

    // Fixed Headers
    const headers = [
      "Submission Date", 
      "Full Name", 
      "Email", 
      "Phone", 
      "Organization", 
      "Job Title", 
      "Status"
    ];
    
    // Rows
    const rows = applications.map(app => {
      const d = app.data;
      return [
        new Date(app.submitted_at).toLocaleString(),
        d.personalInfo.fullName,
        d.personalInfo.email,
        d.personalInfo.mobile,
        d.professionalInfo.organization,
        d.professionalInfo.jobTitle,
        app.status
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `programme-applications-${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApplications = applications.filter(app => {
    const searchStr = JSON.stringify(app.data).toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Programme Applications
          </h1>
          <p className="text-muted-foreground mt-1">Review official RPCSGL programme submissions.</p>
        </div>

        <Button onClick={exportToCSV} disabled={applications.length === 0} className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export All (CSV)
        </Button>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search applicants by name, email, org..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Submission Date</TableHead>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                    {searchTerm ? "No applications match your search." : "No applications received yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-medium">
                      {new Date(app.submitted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground">{app.data.personalInfo.fullName}</div>
                      <div className="text-xs text-muted-foreground">{app.data.professionalInfo.jobTitle}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {app.data.professionalInfo.organization}
                    </TableCell>
                    <TableCell className="text-sm">
                       <a href={`mailto:${app.data.personalInfo.email}`} className="text-primary hover:underline">{app.data.personalInfo.email}</a>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewingApp(app)} title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(app.id)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- APPLICATION DETAIL VIEW --- */}
      <Dialog open={!!viewingApp} onOpenChange={(open) => !open && setViewingApp(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-black">
              <GraduationCap className="w-6 h-6 text-primary" />
              Application Details
            </DialogTitle>
          </DialogHeader>

          {viewingApp && (
            <div className="space-y-8 pt-4">
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h3 className="text-2xl font-bold">{viewingApp.data.personalInfo.fullName}</h3>
                  <p className="text-muted-foreground">{viewingApp.data.personalInfo.email} | {viewingApp.data.personalInfo.mobile}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                  {getStatusBadge(viewingApp.status)}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Personal */}
                <div className="space-y-4">
                   <h4 className="font-black text-xs uppercase tracking-widest text-primary border-b pb-2">1. Personal Details</h4>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Gender</p><p className="font-bold">{viewingApp.data.personalInfo.gender}</p></div>
                      <div><p className="text-muted-foreground">DOB</p><p className="font-bold">{viewingApp.data.personalInfo.dob}</p></div>
                      <div><p className="text-muted-foreground">Nationality</p><p className="font-bold">{viewingApp.data.personalInfo.nationality}</p></div>
                      <div className="col-span-2"><p className="text-muted-foreground">Address</p><p className="font-bold">{viewingApp.data.personalInfo.residentialAddress}</p></div>
                   </div>
                </div>

                {/* Professional */}
                <div className="space-y-4">
                   <h4 className="font-black text-xs uppercase tracking-widest text-primary border-b pb-2">2. Professional Details</h4>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Title</p><p className="font-bold">{viewingApp.data.professionalInfo.jobTitle}</p></div>
                      <div><p className="text-muted-foreground">Exp</p><p className="font-bold">{viewingApp.data.professionalInfo.yearsExperience} Years</p></div>
                      <div className="col-span-2"><p className="text-muted-foreground">Organization</p><p className="font-bold">{viewingApp.data.professionalInfo.organization}</p></div>
                      <div className="col-span-2"><p className="text-muted-foreground">Levels</p><p className="font-bold">{viewingApp.data.professionalInfo.positionLevel.join(", ")}</p></div>
                   </div>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                 <h4 className="font-black text-xs uppercase tracking-widest text-primary border-b pb-2">3. Educational Background</h4>
                 <Table>
                   <TableHeader>
                      <TableRow>
                         <TableHead>Qualification</TableHead>
                         <TableHead>Institution</TableHead>
                         <TableHead>Country</TableHead>
                         <TableHead>Year</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {viewingApp.data.education.map((edu: any, i: number) => (
                        <TableRow key={i}>
                           <TableCell className="font-bold">{edu.qualification}</TableCell>
                           <TableCell>{edu.institution}</TableCell>
                           <TableCell>{edu.country}</TableCell>
                           <TableCell>{edu.year}</TableCell>
                        </TableRow>
                      ))}
                   </TableBody>
                 </Table>
              </div>

              {/* Objective */}
              <div className="space-y-2">
                 <h4 className="font-black text-xs uppercase tracking-widest text-primary border-b pb-2">4. Program Objective</h4>
                 <p className="text-sm bg-muted p-4 rounded-lg italic leading-relaxed whitespace-pre-wrap">
                    "{viewingApp.data.programObjective}"
                 </p>
              </div>

              {/* Sponsorship */}
              <div className="space-y-4">
                 <h4 className="font-black text-xs uppercase tracking-widest text-primary border-b pb-2">5. Sponsorship</h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><p className="text-muted-foreground">Type</p><p className="font-bold">{viewingApp.data.sponsorship.type}</p></div>
                    {viewingApp.data.sponsorship.type === "Employer-Sponsored" && (
                      <>
                        <div className="col-span-2"><p className="text-muted-foreground">Org</p><p className="font-bold">{viewingApp.data.sponsorship.organizationName}</p></div>
                        <div><p className="text-muted-foreground">Contact</p><p className="font-bold">{viewingApp.data.sponsorship.contactPerson}</p></div>
                      </>
                    )}
                 </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setViewingApp(null)}>Close</Button>
                {viewingApp.status === "pending" && (
                  <>
                    <Button variant="destructive" className="gap-2" onClick={() => handleUpdateStatus(viewingApp.id, 'rejected')}>
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => handleUpdateStatus(viewingApp.id, 'approved')}>
                      <CheckCircle className="w-4 h-4" /> Approve Admission
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageApplications;
