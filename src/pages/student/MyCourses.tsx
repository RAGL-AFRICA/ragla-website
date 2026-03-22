import { GraduationCap, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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

      {/* Coming Soon State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border border-dashed border-border bg-card"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
        </motion.div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Coming Soon
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
          Courses Are On the Way
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
          RAGLA's online learning programmes are currently being developed. You will be notified as soon as courses are available for enrolment.
        </p>

        {/* Countdown progress bar to indicate this is active */}
        <div className="mt-8 w-full max-w-xs">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2">
            <span>Development Progress</span>
            <span>40%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "40%" }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-yellow-400 rounded-full"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">Expected — Q3 2026</span>
        </div>
      </motion.div>

    </div>
  );
};

export default MyCourses;
