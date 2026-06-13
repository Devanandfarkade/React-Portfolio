import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Coffee, Rocket, Terminal as TermIcon } from "lucide-react";
import SectionTitle from "./SectionTitle";
import AboutScene3D from "./3D/AboutScene3D";
import ViewportCanvas from "./ViewportCanvas";

const highlights = [
  { icon: Code2, label: "CLEAN CODE PROTOCOL", desc: "Writing modular, scalable, and highly documented architectures is my baseline default." },
  { icon: Rocket, label: "LATENCY OPTIMIZATION", desc: "Obsessed with file size reductions, request pipelines, and 60fps frame budgets." },
  { icon: Coffee, label: "ALGORITHMIC RESOLVER", desc: "Translating convoluted business logics into clean, decoupled web applications." },
  { icon: TermIcon, label: "SECURE INTRUSION", desc: "Ensuring secure token handling, parameterized database queries, and clean input sanitizations." },
];

function HighlightCard({ icon: Icon, label, desc, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group flex items-start gap-4 p-5 rounded-2xl bg-surface/40 border border-accent-2/10 hover:border-accent/40 hover:bg-surface-2/60 transition-all duration-300 backdrop-blur-sm cursor-default">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-2/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
        <Icon size={18} className="text-accent-2 group-hover:text-accent transition-colors" />
      </div>
      <div>
        <div className="font-mono-hacker font-semibold text-text-primary mb-1 tracking-wider text-sm">{label}</div>
        <div className="font-dm text-sm text-text-secondary leading-relaxed">{desc}</div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const contentRef = useRef(null);
  const inView = useInView(contentRef, { once: true, margin: "-60px" });

  return (
    <section id="about" className="relative py-24 bg-bg overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle tag="SYSTEM_DIAGNOSTICS" title="USER_PROFILE:" highlight="ABOUT_ME"
          subtitle="Querying memory blocks for developer core credentials..." />

        {/* Side-by-side matched heights layout: Content on Left, 3D on Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12">
          
          {/* Content (Left Column) */}
          <div ref={contentRef} className="flex flex-col justify-between space-y-6 cyber-card p-8 rounded-3xl">
            <div className="space-y-6">
              <motion.p initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }} className="font-mono-hacker text-text-secondary text-base leading-relaxed">
                &gt; USER STATUS: <span className="text-accent font-semibold">FULL STACK DEVELOPER</span><br/>
                &gt; CORE LANGUAGE COMPILING: <span className="text-text-primary font-medium">React.js, Node.js, Express, Java</span>
              </motion.p>

              <motion.p initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }} className="font-dm text-text-secondary text-base leading-relaxed">
                I am a Full Stack Developer skilled in React.js and Node.js. I specialize in building efficient, scalable applications and contributing to high-performing development teams. With professional experience spanning MEAN stack implementations, Django backend APIs, and Java database operations, I deploy robust applications from database configurations to responsive frontend displays.
              </motion.p>

              <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-wrap gap-2.5 pt-2">
                {["React.js", "Node.js", "Express.js", "Java", "Spring Boot", "PostgreSQL", "MongoDB", "Tailwind CSS"].map((tech) => (
                  <span key={tech} className="px-3 py-1 font-mono-hacker text-xs text-accent border border-accent/30 bg-accent/5 rounded-md backdrop-blur-sm">{tech}</span>
                ))}
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {highlights.map(({ icon, label, desc }, i) => (
                  <HighlightCard key={label} icon={icon} label={label} desc={desc} delay={0.1 + i * 0.08} />
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }} className="flex gap-4 pt-4 flex-wrap">
              <a href="#contact" className="px-6 py-3 btn-hacker rounded-xl hover:-translate-y-0.5 font-bold transition-all">INITIALIZE_CHAT</a>
              <a href="https://linkedin.com/in/devanandfarkade" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-accent-2/30 text-accent-2 hover:border-accent-2/70 hover:bg-accent-2/5 font-mono-hacker text-sm rounded-xl hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm">SECURE_LINKEDIN_SHELL</a>
            </motion.div>
          </div>

          {/* 3D Scene (Right Column - matching height) */}
          <div className="relative w-full h-full min-h-[450px] lg:min-h-0 rounded-3xl overflow-hidden border border-accent-2/20 bg-surface/25 flex items-stretch">
            <ViewportCanvas title="COGNITIVE_AI_GRAPHICS_MATRIX">
              <AboutScene3D height="100%" />
            </ViewportCanvas>
          </div>
          
        </div>
      </div>
    </section>
  );
}