import { BookOpen, ExternalLink, FileText, Video, Globe } from "lucide-react";

const resources = [
  {
    category: "Governance & Leadership",
    icon: Globe,
    items: [
      { title: "African Union Governance Resources", url: "https://au.int/", type: "Website" },
      { title: "UNDP Governance & Peacebuilding", url: "https://www.undp.org/governance", type: "Website" },
      { title: "World Bank Governance Data", url: "https://databank.worldbank.org/source/worldwide-governance-indicators", type: "Website" },
    ],
  },
  {
    category: "Leadership Development",
    icon: Video,
    items: [
      { title: "Harvard Business Review – Leadership", url: "https://hbr.org/topic/leadership", type: "Articles" },
      { title: "TED Talks – Leadership", url: "https://www.ted.com/topics/leadership", type: "Videos" },
      { title: "McKinsey – Leadership Insights", url: "https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights", type: "Articles" },
    ],
  },
  {
    category: "Academic Journals",
    icon: FileText,
    items: [
      { title: "African Journal of Political Science", url: "https://www.tandfonline.com/journals/rafs20", type: "Journal" },
      { title: "Journal of Modern African Studies", url: "https://www.cambridge.org/core/journals/journal-of-modern-african-studies", type: "Journal" },
      { title: "JSTOR – Free Access Resources", url: "https://www.jstor.org/", type: "Database" },
    ],
  },
];

const Library = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-violet-500/10">
            <BookOpen className="w-6 h-6 text-violet-400" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Digital Library</h1>
        </div>
        <p className="text-muted-foreground">Access curated governance and leadership resources, journals, and publications selected by RAGLA.</p>
      </div>

      <div className="space-y-8">
        {resources.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <h2 className="font-bold text-lg text-foreground">{section.category}</h2>
              </div>
              <div className="grid sm:grid-cols-1 gap-3">
                {section.items.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-violet-500/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-200"
                  >
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-violet-400 transition-colors">{item.title}</p>
                      <span className="text-[11px] font-bold text-violet-500/70 uppercase tracking-wider mt-1 inline-block">{item.type}</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-violet-400 flex-shrink-0 ml-4 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 rounded-2xl border border-dashed border-border bg-secondary/30 text-center">
        <p className="text-muted-foreground font-medium text-sm">More exclusive resources for RAGLA members will be added soon.</p>
        <p className="text-muted-foreground text-sm">Contact <a href="mailto:Info@ragl-africa.org" className="text-primary underline">Info@ragl-africa.org</a> for requests.</p>
      </div>

    </div>
  );
};

export default Library;
