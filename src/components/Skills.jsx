import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss, SiJavascript, SiGit, SiPostgresql, SiGithub, SiHtml5, SiCss } from "react-icons/si";
import { FaJava, FaServer } from "react-icons/fa";
import SectionTitle from "./SectionTitle";
import SkillsScene from "./3D/SkillsScene";
import ViewportCanvas from "./ViewportCanvas";

const categories = ["All", "Frontend", "Backend", "Tools"];
const skills = [
  { name: "React.js", icon: SiReact, level: 90, color: "#61dafb", cat: "Frontend" },
  { name: "JavaScript", icon: SiJavascript, level: 88, color: "#f7df1e", cat: "Frontend" },
  { name: "Tailwind CSS", icon: SiTailwindcss, level: 92, color: "#06b6d4", cat: "Frontend" },
  { name: "HTML5", icon: SiHtml5, level: 95, color: "#e34f26", cat: "Frontend" },
  { name: "CSS3", icon: SiCss, level: 90, color: "#1572b6", cat: "Frontend" },
  { name: "Node.js", icon: SiNodedotjs, level: 85, color: "#339933", cat: "Backend" },
  { name: "Express.js", icon: SiExpress, level: 82, color: "#ffffff", cat: "Backend" },
  { name: "Java", icon: FaJava, level: 86, color: "#007396", cat: "Backend" },
  { name: "Spring Boot", icon: FaServer, level: 78, color: "#6db33f", cat: "Backend" },
  { name: "PostgreSQL", icon: SiPostgresql, level: 80, color: "#336791", cat: "Backend" },
  { name: "MySQL", icon: FaServer, level: 85, color: "#4479a1", cat: "Backend" },
  { name: "MongoDB", icon: SiMongodb, level: 80, color: "#47a248", cat: "Backend" },
  { name: "Git", icon: SiGit, level: 88, color: "#f05032", cat: "Tools" },
  { name: "GitHub", icon: SiGithub, level: 90, color: "#ffffff", cat: "Tools" },
  { name: "REST APIs", icon: FaServer, level: 87, color: "#00e5ff", cat: "Tools" },
];

function SkillBar({ skill, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      className="group p-4 rounded-xl bg-surface/50 border border-accent-2/10 hover:border-accent/30 hover:bg-surface-2/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${skill.color}15` }}>
            <skill.icon size={16} style={{ color: skill.color }} />
          </div>
          <span className="font-mono-hacker text-sm font-semibold text-text-primary">{skill.name}</span>
        </div>
        <span className="font-mono-hacker text-xs text-accent-2">{skill.level}%</span>
      </div>
      <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.0, delay: delay + 0.1, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, ${skill.color}55, ${skill.color})` }}>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/80" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState("All");
  const filtered = activeTab === "All" ? skills : skills.filter((s) => s.cat === activeTab);

  return (
    <section id="skills" className="relative py-24 bg-surface/10 overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle tag="SYSTEM_CAPABILITIES" title="SKILLSET:" highlight="TECH_ASSETS"
          subtitle="Compiling runtime library of languages, frameworks, and developer environments..." />

        {/* Split: 3D left + skills right (matching heights) */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12">
          
          {/* 3D laptop scene (Left Column) */}
          <div className="relative w-full h-full min-h-[450px] lg:min-h-0 rounded-3xl overflow-hidden border border-accent/20 bg-surface/20">
            <ViewportCanvas title="TECH_STACK_HOLOGRAM_CORE">
              <SkillsScene />
            </ViewportCanvas>
          </div>

          {/* Skills (Right Column) */}
          <div className="cyber-card p-8 rounded-3xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap gap-2.5 mb-6">
                {categories.map((cat) => (
                  <motion.button key={cat} onClick={() => setActiveTab(cat)} whileTap={{ scale: 0.96 }}
                    className={`px-4 py-2 rounded-lg font-mono-hacker font-semibold text-xs tracking-wider transition-all duration-300 ${activeTab === cat ? "bg-accent text-black font-bold shadow-md shadow-green-500/20" : "bg-surface border border-accent-2/20 text-text-secondary hover:border-accent-2/50 hover:text-text-primary"}`}>
                    {cat.toUpperCase()}
                  </motion.button>
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }} className="grid sm:grid-cols-2 gap-4">
                  {filtered.map((skill, i) => (
                    <SkillBar key={skill.name} skill={skill} delay={i * 0.04} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Soft skills footer panel */}
            <div className="border-t border-accent-2/20 pt-6">
              <p className="font-mono-hacker text-accent text-xs mb-3.5 tracking-widest uppercase">&gt; SOFT_SKILLS_RESOLVER</p>
              <div className="flex flex-wrap gap-2">
                {["Problem Solving", "Analytical Thinking", "Team Collaboration", "Communication", "Adaptability", "Quick Learner"].map((tool) => (
                  <span key={tool} className="font-mono-hacker text-xs text-text-secondary px-3 py-1.5 rounded bg-surface border border-accent-2/15 hover:border-accent/40 hover:text-accent transition-all duration-200 cursor-default">{tool}</span>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}