import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";
import SectionTitle from "./SectionTitle";
import EducationScene from "./3D/EducationScene";
import ViewportCanvas from "./ViewportCanvas";

const education = [
  {
    id: 1, 
    degree: "Master of Computer Applications (MCA)", 
    institution: "JSPM Narhe Technical Campus", 
    location: "Pune, MH, India", 
    period: "2023 – 2025", 
    grade: "8.03 CGPA", 
    color: "#39ff14",
    highlights: [
      "Acquired expertise in Advanced Web Technologies and Cloud computing.",
      "Developed web applications integrating React.js client layers with Node.js REST nodes.",
      "Focused on database efficiency, object-oriented concepts, and software architecture."
    ]
  },
  {
    id: 2, 
    degree: "Bachelor of Computer Applications (BCA)", 
    institution: "CMCS College Nashik", 
    location: "Nashik, MH, India", 
    period: "2019 – 2022", 
    grade: "6.67 CGPA", 
    color: "#00e5ff",
    highlights: [
      "Studied programming fundamentals, data structures, and database management systems (DBMS).",
      "Completed graduation with strong foundations in software engineering paradigms.",
      "Engineered database projects utilizing relational structures and SQL queries."
    ]
  }
];

function EduCard({ edu, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-6 rounded-2xl bg-surface/50 border border-accent-2/15 hover:border-accent/40 hover:bg-surface-2/40 transition-all duration-300">
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-4 border-b border-accent-2/10 pb-3">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: edu.color + "15" }}>
              <GraduationCap size={20} style={{ color: edu.color }} />
            </div>
            <div>
              <h3 className="font-mono-hacker font-bold text-base text-text-primary tracking-wider">{edu.degree}</h3>
              <div className="font-mono-hacker text-xs text-text-secondary mt-1">{edu.institution}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded border font-mono-hacker text-xs font-semibold" style={{ borderColor: edu.color + "44", color: edu.color, backgroundColor: edu.color + "08" }}>
            <Award size={12} /> {edu.grade}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs font-mono-hacker text-text-secondary mb-4">
          <div className="flex items-center gap-1"><MapPin size={11} /> {edu.location}</div>
          <div className="flex items-center gap-1"><Calendar size={11} /> {edu.period}</div>
        </div>

        <ul className="space-y-2">
          {edu.highlights.map((point, i) => (
            <li key={i} className="flex items-start gap-2 font-dm text-xs text-text-secondary leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: edu.color }} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      
    </motion.div>
  );
}

export default function Education() {
  return (
    <section id="education" className="relative py-24 bg-bg overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle tag="SYSTEM_ACADEMICS" title="CREDENTIALS_REGISTRY:" highlight="EDUCATION"
          subtitle="Loading university database entries and academic index files..." />

        {/* Side-by-side equal-height layout: Content Left, 3D Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12">
          
          {/* Content (Left Column) */}
          <div className="cyber-card p-8 rounded-3xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {education.map((edu, i) => (
                <EduCard key={edu.id} edu={edu} index={i} />
              ))}
            </div>
            <div className="border-t border-accent-2/20 pt-4 text-left font-mono-hacker text-[10px] text-accent-2/50">
              SYS_LOG: DEGREE CREDENTIAL VERIFICATION SUITE ENABLED. SECURE CERT_CHECKS: PASS.
            </div>
          </div>

          {/* 3D Scene (Right Column - matching height) */}
          <div className="relative w-full h-full min-h-[450px] lg:min-h-0 rounded-3xl overflow-hidden border border-accent-2/20 bg-surface/25 flex items-stretch">
            <ViewportCanvas title="ACADEMIC_CREDENTIALS_GLOBE_NODES">
              <EducationScene />
            </ViewportCanvas>
          </div>
          
        </div>
      </div>
    </section>
  );
}