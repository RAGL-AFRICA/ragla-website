import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Trash2, ShieldCheck, Users, Upload } from "lucide-react";
import { motion } from "framer-motion";

type StudentID = {
  student_id: string;
  claimed: boolean;
  user_id: string | null;
  created_at: string;
};

const ManageStudentIDs = () => {
  const [ids, setIds] = useState<StudentID[]>([]);
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState("");
  const [bulkIds, setBulkIds] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const fetchIds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("valid_student_ids")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching student IDs");
    } else {
      setIds(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIds();
  }, []);

  const handleAddId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim()) return;

    const { error } = await supabase
      .from("valid_student_ids")
      .insert([{ student_id: newId.trim() }]);

    if (error) {
      toast.error(error.message || "Failed to add ID");
    } else {
      toast.success("Student ID added successfully");
      setNewId("");
      fetchIds();
    }
  };

  const handleBulkAdd = async () => {
    const lines = bulkIds.split("\n").map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return;

    const insertData = lines.map(id => ({ student_id: id }));

    const { error } = await supabase
      .from("valid_student_ids")
      .insert(insertData);

    if (error) {
      toast.error(error.message || "Failed to add IDs in bulk");
    } else {
      toast.success(`${lines.length} Student IDs added successfully`);
      setBulkIds("");
      setShowBulk(false);
      fetchIds();
    }
  };

  const deleteId = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ID? Users already registered with it may lose access to validation checks.")) return;

    const { error } = await supabase
      .from("valid_student_ids")
      .delete()
      .eq("student_id", id);

    if (error) {
      toast.error("Failed to delete ID");
    } else {
      toast.success("ID deleted successfully");
      fetchIds();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student ID Management</h1>
          <p className="text-muted-foreground">Pre-authorize students to register using their existing IDs.</p>
        </div>
        <button 
          onClick={() => setShowBulk(!showBulk)}
          className="bg-secondary text-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary/80 transition-all font-medium"
        >
          <Upload className="w-4 h-4" />
          {showBulk ? "Single Entry" : "Bulk Upload"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">ID Statistics</h3>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Pre-authorized</span>
                <span className="font-bold">{ids.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Claimed/Registered</span>
                <span className="font-bold text-green-500">{ids.filter(i => i.claimed).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-bold text-blue-500">{ids.filter(i => !i.claimed).length}</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-semibold mb-4">Add Student ID</h3>
            {showBulk ? (
              <div className="space-y-4">
                <textarea
                  placeholder="Paste IDs here (one per line)..."
                  rows={8}
                  value={bulkIds}
                  onChange={(e) => setBulkIds(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleBulkAdd}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:brightness-110 transition-all"
                >
                  Bulk Add IDs
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddId} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Student ID"
                  required
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add ID
                </button>
              </form>
            )}
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-2">
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student ID</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </td>
                    </tr>
                  ) : ids.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                        No Student IDs added yet.
                      </td>
                    </tr>
                  ) : (
                    ids.map((id) => (
                      <motion.tr 
                        key={id.student_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-secondary/20 transition-colors group"
                      >
                        <td className="px-6 py-4 font-mono text-sm">{id.student_id}</td>
                        <td className="px-6 py-4">
                          {id.claimed ? (
                            <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                              <Users className="w-3 h-3" /> Registered
                            </span>
                          ) : (
                            <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-semibold w-fit inline-block">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteId(id.student_id)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Delete ID"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentIDs;
