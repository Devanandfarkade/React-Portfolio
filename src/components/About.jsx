// About.jsx
import { useRef, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Coffee, Rocket, Heart } from "lucide-react";
import SectionTitle from "./SectionTitle";
import AboutScene3D from "./3D/AboutScene3D"; // Make sure this path is correct

// --- Highlight Card Component ---
const highlights = [
  { icon: Code2, label: "Clean Code", desc: "Writing maintainable, scalable, well-documented code is my standard." },
  { icon: Rocket, label: "Performance", desc: "Obsessed with load times, Lighthouse scores, and smooth UX." },
  { icon: Coffee, label: "Problem Solver", desc: "I turn complex problems into elegant, user-friendly solutions." },
  { icon: Heart, label: "Passionate", desc: "Continuously learning and keeping up with the latest in web tech." },
];

function HighlightCard({ icon: Icon, label, desc, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className="group flex items-start gap-4 p-5 rounded-2xl bg-surface/60 glow-border hover:bg-surface transition-all duration-300 cursor-default backdrop-blur-sm">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors duration-300">
        <Icon size={18} className="text-accent" />
      </div>
      <div>
        <div className="font-syne font-semibold text-text-primary mb-1">{label}</div>
        <div className="font-dm text-sm text-text-secondary leading-relaxed">{desc}</div>
      </div>
    </motion.div>
  );
}

// --- Main About Component (3D on left, content on right) ---
export default function About() {
  const contentRef = useRef(null);
  const inView = useInView(contentRef, { once: true, margin: "-60px" });

  return (
    <section id="about" className="relative py-10 bg-bg overflow-hidden">
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-bg/60 via-bg/40 to-bg pointer-events-none" />

      {/* 3D Scene - left side (opposite of hero) */}
      <div className="absolute left-0 top-0 w-full lg:w-[55%] h-full z-[2] opacity-80">
        <Suspense fallback={null}>
          <AboutScene3D height="100%" />
        </Suspense>
      </div>

      {/* Right gradient fade over 3D (opposite of hero) */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-l from-bg via-bg/80 to-transparent pointer-events-none" />

      {/* Content - Right side */}
      <div className="relative z-[4] flex justify-end min-h-screen">
        <div className="w-full lg:w-1/2 px-6 lg:px-12 py-10">
          <div ref={contentRef}>
            <SectionTitle tag="About Me" title="Crafting Digital" highlight="Experiences"
              subtitle="A passionate developer with a love for clean code and beautiful UIs." />

            <div className="space-y-6 mt-8">
              <motion.p initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }} className="font-dm text-text-secondary text-lg leading-relaxed">
                I'm a <span className="text-text-primary font-medium">MERN Stack Developer</span> based in
                India, with a strong focus on building modern, responsive, and performant web applications.
                I specialize in <span className="text-accent font-medium">React.js</span>, Node.js, Express,
                and MongoDB — bringing ideas to life from concept to deployment.
              </motion.p>

              <motion.p initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }} className="font-dm text-text-secondary text-lg leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source
                projects, or diving deep into design systems and micro-interactions that create delightful user experiences.
              </motion.p>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3 pt-2">
                {["JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "Tailwind"].map((tech) => (
                  <span key={tech} className="px-3 py-1.5 font-dm text-sm text-accent border border-accent/30 bg-accent/5 rounded-lg backdrop-blur-sm">{tech}</span>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45 }} className="flex gap-4 pt-4 flex-wrap">
                <a href="#contact" className="px-6 py-3 bg-accent text-white font-dm font-medium rounded-xl hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5">Let's Talk</a>
                <a href="https://www.overleaf.com/project/69f4ccd2a77545648f1565de" className="px-6 py-3 border border-purple-500/30 text-text-secondary font-dm font-medium rounded-xl hover:border-accent/60 hover:text-text-primary hover:bg-purple-500/5 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm">Download CV</a>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {highlights.map(({ icon, label, desc }, i) => (
                  <HighlightCard key={label} icon={icon} label={label} desc={desc} delay={0.1 + i * 0.1} />
                ))}

                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.5 }}
                  className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-cyan-900/20 border border-purple-500/20 flex items-center justify-around backdrop-blur-sm">
                  {[{ n: "2+", l: "Years" }, { n: "20+", l: "Projects" }, { n: "10+", l: "Happy Clients" }].map(({ n, l }) => (
                    <div key={l} className="text-center">
                      <div className="font-syne font-bold text-3xl gradient-text">{n}</div>
                      <div className="font-dm text-xs text-muted mt-1">{l}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}