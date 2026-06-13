import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ExternalLink, Github, Database, Cpu, Terminal as TermIcon } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ProjectsScene from "./3D/ProjectsScene";
import ViewportCanvas from "./ViewportCanvas";

const filters = ["ALL", "JAVA", "DATABASE"];
const projects = [
  { 
    id: 1, 
    title: "BANK MANAGEMENT SYSTEM", 
    desc: "A comprehensive financial transaction ledger built to manage core banking operations. Implements user authentication, automated ledger entries, checking deposits, withdrawals, and calculations of ATM and debit card schedules.", 
    tags: ["Java", "MySQL", "JDBC", "Database Design", "Git"], 
    cat: "JAVA", 
    repo: "https://github.com/Devanandfarkade", 
    live: null,
    color: "#39ff14", 
    featured: true 
  },
  { 
    id: 2, 
    title: "VEHICLE SERVICE CENTER", 
    desc: "An automated billing, scheduling, and invoicing system developed from scratch. Processes diagnostic logs, tracks inventory parts consumed, aggregates labor rates, and computes customer invoices with detailed cost summaries.", 
    tags: ["Java", "Spring Boot", "MySQL", "Spring Tool Suite 4", "REST APIs"], 
    cat: "JAVA", 
    repo: "https://github.com/Devanandfarkade", 
    live: null,
    color: "#00e5ff", 
    featured: true 
  },
];

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative rounded-xl bg-surface/50 border border-accent-2/15 p-5 flex flex-col justify-between hover:bg-surface-2/40 hover:border-accent/40 transition-all duration-300">
      
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-accent-2/10 pb-2">
          <span className="flex items-center gap-1 text-[10px] font-mono-hacker text-accent-2">
            <Cpu size={10} /> {project.cat}
          </span>
          <div className="flex gap-2">
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded bg-surface border border-accent-2/20 hover:border-accent hover:text-accent text-text-secondary transition-all">
                <Github size={11} />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded bg-surface border border-accent-2/20 hover:border-accent hover:text-accent text-text-secondary transition-all">
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>

        <h3 className="font-mono-hacker text-sm font-bold text-text-primary group-hover:text-accent transition-colors duration-300 tracking-wider">
          {project.title}
        </h3>
        <p className="font-dm text-xs text-text-secondary leading-relaxed mt-2">
          {project.desc}
        </p>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[9px] font-mono-hacker px-2 py-0.5 rounded bg-surface border border-accent-2/10 text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="border-t border-accent-2/10 pt-2 flex items-center justify-between text-[10px] font-mono-hacker">
          <span className="text-accent/60 flex items-center gap-1">
            <Database size={9} /> STATUS: STABLE
          </span>
          <span className="text-accent-2 flex items-center gap-0.5">
            LOGS <TermIcon size={9} />
          </span>
        </div>
      </div>
      
    </motion.div>
  );
}

export default function Projects() {
  const [active, setActive] = useState("ALL");
  
  // Custom filter logic
  const filtered = active === "ALL" 
    ? projects 
    : projects.filter((p) => {
        if (active === "DATABASE") return p.tags.includes("MySQL") || p.tags.includes("Database Design");
        return p.cat === active;
      });

  return (
    <section id="projects" className="relative lg:h-screen lg:max-h-screen lg:min-h-[600px] flex items-center py-12 lg:py-0 bg-bg overflow-hidden hacker-grid">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-950/2 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col justify-center">
        <SectionTitle tag="PROJECTS" title="PROJECTS:" highlight="MY WORK"
          subtitle="Source code repositories and application databases..." />

        {/* Side-by-side equal-height layout: Content Left, 3D Right */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch mt-3">
          
          {/* Projects Content Panel (Left Column) */}
          <div className="cyber-card p-6 lg:p-8 rounded-3xl flex flex-col justify-between max-h-[58vh] lg:max-h-[62vh]">
            <div className="flex-1 overflow-y-auto pr-3 cyber-scrollbar">
              {/* Category Filter buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.map((f) => (
                  <motion.button key={f} onClick={() => setActive(f)} whileTap={{ scale: 0.96 }}
                    className={`px-3.5 py-1.5 rounded-lg font-mono-hacker font-semibold text-[10px] tracking-wider transition-all duration-300 ${active === f ? "bg-accent text-black font-bold shadow-md shadow-green-500/20" : "bg-surface border border-accent-2/20 text-text-secondary hover:border-accent-2/50 hover:text-text-primary"}`}>
                    {f}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }} className="space-y-4">
                  {filtered.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* View All Panel */}
            <div className="border-t border-accent-2/20 pt-5 mt-6 text-center">
              <a href="https://github.com/Devanandfarkade" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-accent/30 text-accent font-mono-hacker text-xs rounded-lg hover:bg-accent/5 hover:border-accent transition-all duration-300">
                <Github size={12} /> View GitHub
              </a>
            </div>
          </div>

          {/* 3D Brain Point Cloud Scene (Right Column - matches height) */}
          <div className="relative w-full h-[300px] lg:h-auto rounded-3xl overflow-hidden border border-accent/20 bg-surface/25 flex items-stretch">
            <ViewportCanvas title="3D_PROJECTS_MODEL">
              <ProjectsScene />
            </ViewportCanvas>
          </div>
          
        </div>
      </div>
    </section>
  );
}