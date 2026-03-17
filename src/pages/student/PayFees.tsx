import { CreditCard, CheckCircle, Copy, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

const paymentDetails = [
  { label: "Account Name", value: "Royal Academy of Governance & Leadership Africa" },
  { label: "Bank Name", value: "Ghana Commercial Bank (GCB)" },
  { label: "Account Number", value: "1234567890" },
  { label: "Branch", value: "East Legon, Accra" },
  { label: "Swift/Sort Code", value: "GHCBGHAC" },
];

const feeStructure = [
  { category: "Affiliate Member", applicationFee: "GH₵500 / $50", annualDues: "GH₵300 / $30" },
  { category: "Associate Member", applicationFee: "GH₵500 / $50", annualDues: "GH₵500 / $50" },
  { category: "Certified Member", applicationFee: "GH₵500 / $50", annualDues: "GH₵700 / $70" },
  { category: "Chartered Member", applicationFee: "GH₵500 / $50", annualDues: "GH₵1,000 / $100" },
  { category: "Fellow Member", applicationFee: "GH₵500 / $50", annualDues: "GH₵1,500 / $150" },
];

const PayFees = () => {
  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Page header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-500/10">
            <CreditCard className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Pay Fees</h1>
        </div>
        <p className="text-muted-foreground">Please use the bank details below to make your membership payment. After payment, send your proof to us via email or WhatsApp.</p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
        <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-foreground">Payment Instructions</p>
          <ol className="mt-2 space-y-1 text-sm text-muted-foreground list-decimal list-inside">
            <li>Locate the appropriate fee for your membership category in the table below.</li>
            <li>Make a bank transfer using the account details provided.</li>
            <li>Take a photo or screenshot of your payment receipt.</li>
            <li>Send the receipt to <strong className="text-foreground">Info@ragl-africa.org</strong> or WhatsApp <strong className="text-foreground">+233 256 257 507</strong>.</li>
          </ol>
        </div>
      </div>

      {/* Fee Structure */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Fee Structure</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Membership Category</th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Application Fee</th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Annual Dues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {feeStructure.map((row) => (
                <tr key={row.category} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-4 font-medium text-foreground">{row.category}</td>
                  <td className="px-5 py-4 text-muted-foreground font-mono">{row.applicationFee}</td>
                  <td className="px-5 py-4 text-muted-foreground font-mono">{row.annualDues}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Account Details */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Bank Account Details</h2>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {paymentDetails.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors group">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                <p className="text-foreground font-semibold mt-0.5">{item.value}</p>
              </div>
              <button
                onClick={() => copyToClipboard(item.value, item.label)}
                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-secondary hover:bg-primary/10 hover:text-primary transition-all"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2">
        <a href="mailto:Info@ragl-africa.org" className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:-translate-y-0.5 transition-all group">
          <div className="p-3 rounded-xl bg-primary/10"><Mail className="w-5 h-5 text-primary" /></div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Email</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Info@ragl-africa.org</p>
          </div>
        </a>
        <a href="tel:+233256257507" className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:-translate-y-0.5 transition-all group">
          <div className="p-3 rounded-xl bg-primary/10"><Phone className="w-5 h-5 text-primary" /></div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">WhatsApp / Call</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">+233 256 257 507</p>
          </div>
        </a>
      </div>

    </div>
  );
};

export default PayFees;
