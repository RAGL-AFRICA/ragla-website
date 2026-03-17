import { GraduationCap, Clock, BookOpen } from "lucide-react";

const courses = [
  {
    title: "Certificate in Governance Excellence",
    category: "Governance",
    duration: "6 Months",
    status: "upcoming",
    description: "A comprehensive programme covering principles of good governance, accountability, and transparency in public and private sectors.",
  },
  {
    title: "Leadership Development Programme",
    category: "Leadership",
    duration: "3 Months",
    status: "upcoming",
    description: "Develop practical leadership competencies, emotional intelligence, and strategic thinking skills.",
  },
  {
    title: "Public Sector Management",
    category: "Management",
    duration: "4 Months",
    status: "upcoming",
    description: "An in-depth study of modern public sector management theories and best practices in the African context.",
  },
];

const MyCourses = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-foreground">My Courses</h1>
        </div>
        <p className="text-muted-foreground">Your enrolled RAGLA programmes and learning materials.</p>
      </div>

      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-4">
        <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-foreground">Programme Enrolment</p>
          <p className="text-sm text-muted-foreground mt-1">
            Active programme enrolment is available to members with an <strong className="text-foreground">Active</strong> membership status. Contact us to enrol in any of the programmes below.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.title}
            className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 rounded-2xl border border-border bg-card"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> {course.duration}
                </span>
              </div>
              <h3 className="font-bold text-foreground text-lg">{course.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{course.description}</p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="/contact-us"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 transition-colors"
              >
                Enquire
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MyCourses;
