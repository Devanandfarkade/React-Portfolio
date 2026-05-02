import { useState, useRef, Suspense } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss, SiJavascript, SiTypescript, SiGit, SiDocker, SiFigma, SiRedux, SiNextdotjs, SiGraphql, SiPostgresql, SiFirebase, SiVercel } from "react-icons/si";
import SectionTitle from "./SectionTitle";
import SkillsScene from "./3D/SkillsScene";

const categories = ["All", "Frontend", "Backend", "Tools"];
const skills = [
  { name: "React.js", icon: SiReact, level: 92, color: "#61dafb", cat: "Frontend" },
  { name: "JavaScript", icon: SiJavascript, level: 90, color: "#f7df1e", cat: "Frontend" },
  { name: "TypeScript", icon: SiTypescript, level: 80, color: "#3178c6", cat: "Frontend" },
  { name: "Tailwind CSS", icon: SiTailwindcss, level: 95, color: "#06b6d4", cat: "Frontend" },
  { name: "Next.js", icon: SiNextdotjs, level: 75, color: "#ffffff", cat: "Frontend" },
  { name: "Redux", icon: SiRedux, level: 82, color: "#764abc", cat: "Frontend" },
  { name: "Node.js", icon: SiNodedotjs, level: 85, color: "#339933", cat: "Backend" },
  { name: "Express.js", icon: SiExpress, level: 85, color: "#ffffff", cat: "Backend" },
  { name: "MongoDB", icon: SiMongodb, level: 82, color: "#47a248", cat: "Backend" },
  { name: "PostgreSQL", icon: SiPostgresql, level: 65, color: "#336791", cat: "Backend" },
  { name: "GraphQL", icon: SiGraphql, level: 60, color: "#e10098", cat: "Backend" },
  { name: "Firebase", icon: SiFirebase, level: 72, color: "#ffca28", cat: "Backend" },
  { name: "Git", icon: SiGit, level: 88, color: "#f05032", cat: "Tools" },
  { name: "Docker", icon: SiDocker, level: 60, color: "#2496ed", cat: "Tools" },
  { name: "Figma", icon: SiFigma, level: 70, color: "#f24e1e", cat: "Tools" },
  { name: "Vercel", icon: SiVercel, level: 85, color: "#ffffff", cat: "Tools" },
];

function SkillBar({ skill, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group p-4 rounded-2xl bg-surface/50 glow-border hover:bg-surface transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${skill.color}18` }}>
            <skill.icon size={18} style={{ color: skill.color }} />
          </div>
          <span className="font-dm font-medium text-text-primary">{skill.name}</span>
        </div>
        <span className="font-syne text-sm font-bold text-text-secondary">{skill.level}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})` }}>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/80 shadow-lg" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState("All");
  const filtered = activeTab === "All" ? skills : skills.filter((s) => s.cat === activeTab);

  return (
    <section id="skills" className="relative py-24 bg-surface/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle tag="Tech Stack" title="Skills &" highlight="Expertise"
          subtitle="Technologies I use to build exceptional digital products." />

        {/* Split: 3D left + skills right */}
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-10">
          {/* 3D laptop scene */}
          <div className="hidden lg:block relative h-[460px] rounded-3xl overflow-hidden bg-surface/30 glow-border">
            <Suspense fallback={null}>
              <SkillsScene />
            </Suspense>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <motion.button key={cat} onClick={() => setActiveTab(cat)} whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2 rounded-full font-dm font-medium text-sm transition-all duration-300 ${activeTab === cat ? "bg-accent text-white shadow-lg shadow-purple-500/30" : "bg-surface border border-purple-900/40 text-text-secondary hover:border-accent/50 hover:text-text-primary"}`}>
                  {cat}
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }} className="grid sm:grid-cols-3 gap-3">
                {filtered.map((skill, i) => (
                  <SkillBar key={skill.name} skill={skill} delay={i * 0.05} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Also tools row */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="p-7 rounded-3xl bg-surface/50 glow-border">
          <p className="font-dm text-muted text-center text-xs mb-6 tracking-widest uppercase">Also worked with</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["REST APIs", "JWT Auth", "Socket.io", "Axios", "Mongoose", "Zustand", "React Query", "Vite", "Webpack", "Postman"].map((tool) => (
              <span key={tool} className="font-dm text-sm text-text-secondary px-4 py-2 rounded-xl bg-surface-2/80 border border-purple-900/30 hover:border-accent/40 hover:text-text-primary transition-all duration-200 cursor-default">{tool}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}