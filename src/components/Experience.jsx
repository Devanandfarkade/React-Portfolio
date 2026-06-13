import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Calendar, MapPin, ArrowRight, Server } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ExperienceScene from "./3D/ExperienceScene";
import ViewportCanvas from "./ViewportCanvas";

const experiences = [
  {
    id: 1,
    role: "FULL STACK DEVELOPER",
    company: "RajYug IT Solutions",
    location: "Pune, India",
    period: "Dec 2025 – Present",
    type: "Full-Time",
    color: "#39ff14",
    desc: "Contributing to enterprise-grade web applications using the MEAN stack and Java technologies.",
    points: [
      "Involved in frontend development, backend API integration, database design, and performance optimization within agile teams.",
      "Enhanced usability, data accuracy, and automation for professional and client applications.",
      "Developed modular REST APIs and streamlined data validation processes."
    ],
    tech: ["MongoDB", "Express.js", "Angular", "Node.js", "Java", "REST APIs"]
  },
  {
    id: 2,
    role: "SOFTWARE DEVELOPMENT ENGINEER (SDE)",
    company: "Bluestock Fintech",
    location: "Pune, India",
    period: "Apr 2025 – May 2025",
    type: "Contract",
    color: "#00e5ff",
    desc: "Engineered high-throughput IPO tracking applications and REST API web nodes.",
    points: [
      "Developed a production-level IPO web application and REST API using Django and PostgreSQL.",
      "Created secure APIs delivering IPO data including company info, price band, dates, and status.",
      "Coordinated with testing teams under agile methodology to minimize deployment stutters."
    ],
    tech: ["Django", "Python", "PostgreSQL", "REST APIs", "JavaScript", "SQL"]
  },
  {
    id: 3,
    role: "JAVA DEVELOPER INTERN",
    company: "Mass Technologies",
    location: "Pune, India",
    period: "Jan 2025 – Apr 2025",
    type: "Internship",
    color: "#ff007f",
    desc: "Programmed educational and administrative systems using Java web architectures.",
    points: [
      "Developed an attendance system using Java, JSP, and MySQL with role-based logins and tracking features.",
      "Refactored relational schemas to improve database query execution times.",
      "Built simple, clean web frontends using JSP, CSS, and HTML5 templates."
    ],
    tech: ["Java", "JSP", "Servlets", "MySQL", "HTML5", "CSS3"]
  }
];

function ExpTimelineCard({ exp, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, x: 30 }} 
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-5 rounded-2xl bg-surface/40 border border-accent-2/10 hover:border-accent/40 hover:bg-surface-2/30 transition-all duration-300 relative"
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-accent-2/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: exp.color }} />
          <span className="font-mono-hacker text-xs uppercase" style={{ color: exp.color }}>{exp.role}</span>
        </div>
        <span className="text-[10px] font-mono-hacker text-text-secondary bg-surface px-2 py-0.5 rounded border border-accent-2/15">{exp.type}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs font-mono-hacker text-text-secondary mb-3">
        <span className="text-accent-2 flex items-center gap-1"><Server size={11} /> {exp.company}</span>
        <span className="flex items-center gap-1"><Calendar size={11} /> {exp.period}</span>
        <span className="flex items-center gap-1"><MapPin size={11} /> {exp.location}</span>
      </div>

      <p className="font-dm text-sm text-text-secondary leading-relaxed mb-4">{exp.desc}</p>
      
      <ul className="space-y-2 mb-4">
        {exp.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-xs font-dm text-text-secondary">
            <ArrowRight size={12} className="mt-0.5 flex-shrink-0 text-accent" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 border-t border-accent-2/10 pt-3">
        {exp.tech.map((t) => (
          <span key={t} className="text-[10px] font-mono-hacker px-2.5 py-0.5 rounded bg-surface border border-accent-2/10 text-text-secondary">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 bg-surface/5 overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle tag="SYSTEM_HISTORY" title="EMPLOYMENT_LEDGER:" highlight="EXPERIENCE"
          subtitle="Compiling previous workplace logs and database administration history..." />

        {/* Side-by-side equal-height layout: 3D Left, Content Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12">
          
          {/* 3D Model Scene (Left Column) */}
          <div className="relative w-full h-full min-h-[450px] lg:min-h-0 rounded-3xl overflow-hidden border border-accent/20 bg-surface/20">
            <ViewportCanvas title="ROBOTIC_UTILITIES_NODE_GRAPH">
              <ExperienceScene />
            </ViewportCanvas>
          </div>

          {/* Experience Timeline list (Right Column - matching height) */}
          <div className="cyber-card p-8 rounded-3xl space-y-5 flex flex-col justify-between overflow-y-auto max-h-[700px]">
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <ExpTimelineCard key={exp.id} exp={exp} index={i} />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}