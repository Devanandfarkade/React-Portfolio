import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import SectionTitle from "./SectionTitle";
import SkillsScene from "./3D/SkillsScene";
import ViewportCanvas from "./ViewportCanvas";
import { useScrollIndicator, ScrollIndicator } from "./ScrollIndicator";
import { api } from "../services/api";

const categories = ["ALL", "FRONTEND", "BACKEND", "TOOLS"];

const getIconComponent = (iconName) => {
  if (iconName && iconName.startsWith("Si") && SiIcons[iconName]) {
    return SiIcons[iconName];
  }
  if (iconName && iconName.startsWith("Fa") && FaIcons[iconName]) {
    return FaIcons[iconName];
  }
  return FaIcons.FaServer; // Fallback
};

const fallbackSkills = [
  { name: "React.js", icon: SiIcons.SiReact, level: 90, color: "#61dafb", cat: "FRONTEND" },
  { name: "JavaScript", icon: SiIcons.SiJavascript, level: 88, color: "#f7df1e", cat: "FRONTEND" },
  { name: "Tailwind CSS", icon: SiIcons.SiTailwindcss, level: 92, color: "#06b6d4", cat: "FRONTEND" },
  { name: "HTML5", icon: SiIcons.SiHtml5, level: 95, color: "#e34f26", cat: "FRONTEND" },
  { name: "CSS3", icon: SiIcons.SiCss, level: 90, color: "#1572b6", cat: "FRONTEND" },
  { name: "Node.js", icon: SiIcons.SiNodedotjs, level: 85, color: "#339933", cat: "BACKEND" },
  { name: "Express.js", icon: SiIcons.SiExpress, level: 82, color: "#ffffff", cat: "BACKEND" },
  { name: "Java", icon: FaIcons.FaJava, level: 86, color: "#007396", cat: "BACKEND" },
  { name: "Spring Boot", icon: FaIcons.FaServer, level: 78, color: "#6db33f", cat: "BACKEND" },
  { name: "PostgreSQL", icon: SiIcons.SiPostgresql, level: 80, color: "#336791", cat: "BACKEND" },
  { name: "MongoDB", icon: SiIcons.SiMongodb, level: 80, color: "#47a248", cat: "BACKEND" },
  { name: "Git", icon: SiIcons.SiGit, level: 88, color: "#f05032", cat: "TOOLS" },
  { name: "GitHub", icon: SiIcons.SiGithub, level: 90, color: "#ffffff", cat: "TOOLS" },
  { name: "REST APIs", icon: FaIcons.FaServer, level: 87, color: "#00e5ff", cat: "TOOLS" },
];

function SkillBar({ skill, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = typeof skill.icon === "string" ? getIconComponent(skill.icon) : (skill.icon || FaIcons.FaServer);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="group p-3.5 rounded-xl bg-surface/50 border border-accent-2/10 hover:border-accent/30 hover:bg-surface-2/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${skill.color}15` }}>
            <Icon size={15} style={{ color: skill.color }} />
          </div>
          <span className="font-mono-hacker text-xs font-semibold text-text-primary">{skill.name}</span>
        </div>
        <span className="font-mono-hacker text-[10px] text-accent-2">{skill.level}%</span>
      </div>
      <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 0.8, delay: delay + 0.05, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, ${skill.color}55, ${skill.color})` }}>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/80" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const showIndicator = useScrollIndicator(scrollRef);

  useEffect(() => {
    api.getSkills()
      .then((data) => {
        if (data.skills && data.skills.length > 0) {
          const mapped = data.skills.map((s) => ({
            name: s.name,
            level: s.level,
            color: s.color_hex || s.color,
            icon: s.icon_name || s.iconName,
            cat: s.category || s.cat
          }));
          setSkillsList(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch technical skills:", err);
        setLoading(false);
      });
  }, []);

  const displaySkills = skillsList.length > 0 ? skillsList : fallbackSkills;
  const filtered = activeTab === "ALL" ? displaySkills : displaySkills.filter((s) => s.cat === activeTab);

  return (
    <section id="skills" className="relative lg:h-screen lg:max-h-screen lg:min-h-[600px] flex items-center py-12 lg:py-0 bg-surface/10 overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col justify-center">
        <SectionTitle tag="SKILLS" title="SKILLSET:" highlight="TECH ASSETS"
          subtitle="Programming languages, backend frameworks, and development environments..." />

        {/* Split: 3D left + skills right (matching heights) */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch mt-3">
          
          {/* 3D laptop scene (Left Column) */}
          <div className="relative w-full h-[300px] lg:h-auto rounded-3xl overflow-hidden border border-accent/20 bg-surface/20">
            <ViewportCanvas title="3D_SKILLS_MODEL">
              <SkillsScene />
            </ViewportCanvas>
          </div>

          {/* Skills (Right Column) */}
          <div className="cyber-card p-6 lg:p-8 rounded-3xl flex flex-col justify-between max-h-[60vh] lg:max-h-[72vh] relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto pr-3 cyber-scrollbar">
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <motion.button key={cat} onClick={() => setActiveTab(cat)} whileTap={{ scale: 0.96 }}
                    className={`px-3.5 py-1.5 rounded-lg font-mono-hacker font-semibold text-[10px] tracking-wider transition-all duration-300 ${activeTab === cat ? "bg-accent text-black font-bold shadow-md shadow-green-500/20" : "bg-surface border border-accent-2/20 text-text-secondary hover:border-accent-2/50 hover:text-text-primary"}`}>
                    {cat}
                  </motion.button>
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }} className="grid sm:grid-cols-2 gap-3.5">
                  {filtered.map((skill, i) => (
                    <SkillBar key={skill.name} skill={skill} delay={i * 0.03} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <ScrollIndicator visible={showIndicator} className="bottom-[100px]" />

            {/* Soft skills footer panel */}
            <div className="border-t border-accent-2/20 pt-5 mt-4">
              <p className="font-mono-hacker text-accent text-xs mb-3 tracking-widest uppercase">&gt; OTHER SKILLS</p>
              <div className="flex flex-wrap gap-1.5">
                {["Problem Solving", "Analytical Thinking", "Team Collaboration", "Communication", "Adaptability", "Quick Learner"].map((tool) => (
                  <span key={tool} className="font-mono-hacker text-[10px] text-text-secondary px-2.5 py-1 rounded bg-surface border border-accent-2/15 hover:border-accent/40 hover:text-accent transition-all duration-200 cursor-default">{tool}</span>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}