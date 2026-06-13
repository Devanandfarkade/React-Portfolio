import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Coffee, Rocket, Terminal as TermIcon } from "lucide-react";
import SectionTitle from "./SectionTitle";
import AboutScene3D from "./3D/AboutScene3D";
import ViewportCanvas from "./ViewportCanvas";
import { useScrollIndicator, ScrollIndicator } from "./ScrollIndicator";

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
      initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="group flex items-start gap-3.5 p-4 rounded-xl bg-surface/40 border border-accent-2/10 hover:border-accent/40 hover:bg-surface-2/60 transition-all duration-300 backdrop-blur-sm cursor-default">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent-2/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
        <Icon size={16} className="text-accent-2 group-hover:text-accent transition-colors" />
      </div>
      <div>
        <div className="font-mono-hacker font-semibold text-text-primary mb-0.5 tracking-wider text-xs">{label}</div>
        <div className="font-dm text-xs text-text-secondary leading-relaxed">{desc}</div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  const inView = useInView(contentRef, { once: true, margin: "-60px" });
  const showIndicator = useScrollIndicator(scrollRef);

  return (
    <section id="about" className="relative lg:h-screen lg:max-h-screen lg:min-h-[600px] flex items-center py-12 lg:py-0 bg-bg overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col justify-center">
        <SectionTitle tag="ABOUT" title="PROFILE:" highlight="ABOUT ME"
          subtitle="Compiling developer core credentials and objectives..." />

        {/* Side-by-side matched heights layout: Content on Left, 3D on Right */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch mt-3">
          
          {/* Content (Left Column) */}
          <div ref={contentRef} className="cyber-card p-6 lg:p-8 rounded-3xl flex flex-col justify-between max-h-[60vh] lg:max-h-[72vh] relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto pr-3 cyber-scrollbar space-y-4">
              <motion.p initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4 }} className="font-mono-hacker text-text-secondary text-sm leading-relaxed">
                &gt; STATUS: <span className="text-accent font-semibold">FULL STACK DEVELOPER</span><br/>
                &gt; CORE STACK: <span className="text-text-primary font-medium">React.js, Node.js, Express, Java</span>
              </motion.p>

              <motion.p initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 }} className="font-dm text-text-secondary text-sm leading-relaxed">
                I am a Full Stack Developer skilled in React.js and Node.js. I specialize in building efficient, scalable applications and contributing to high-performing development teams. With professional experience spanning MEAN stack implementations, Django backend APIs, and Java database operations, I deploy robust applications from database configurations to responsive frontend displays.
              </motion.p>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 }} className="flex flex-wrap gap-2 pt-1">
                {["React.js", "Node.js", "Express.js", "Java", "Spring Boot", "PostgreSQL", "MongoDB", "Tailwind CSS"].map((tech) => (
                  <span key={tech} className="px-2.5 py-0.5 font-mono-hacker text-[10px] text-accent border border-accent/30 bg-accent/5 rounded backdrop-blur-sm">{tech}</span>
                ))}
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {highlights.map(({ icon, label, desc }, i) => (
                  <HighlightCard key={label} icon={icon} label={label} desc={desc} delay={0.1 + i * 0.05} />
                ))}
              </div>
            </div>

            <ScrollIndicator visible={showIndicator} />

            <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.35 }} className="flex gap-3 pt-4 flex-wrap font-mono-hacker text-xs font-bold mt-4 border-t border-accent-2/10">
              <a href="#contact" className="px-5 py-2.5 btn-hacker rounded-lg hover:-translate-y-0.5 transition-all">Let's Talk</a>
              <a href="https://linkedin.com/in/devanandfarkade" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-accent-2/30 text-accent-2 hover:bg-accent-2/5 rounded-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm">LinkedIn</a>
              <a href="https://www.overleaf.com/project/69f4ccd2a77545648f1565de" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-accent/30 text-accent hover:bg-accent/5 rounded-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm">Download Resume</a>
            </motion.div>
          </div>

          {/* 3D Scene (Right Column - matching height) */}
          <div className="relative w-full h-[300px] lg:h-auto rounded-3xl overflow-hidden border border-accent-2/20 bg-surface/25 flex items-stretch">
            <ViewportCanvas title="3D_CORE_MODEL">
              <AboutScene3D height="100%" />
            </ViewportCanvas>
          </div>
          
        </div>
      </div>
    </section>
  );
}