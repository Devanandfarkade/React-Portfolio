import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Coffee, Rocket, Heart } from "lucide-react";
import SectionTitle from "./SectionTitle";

const highlights = [
  {
    icon: Code2,
    label: "Clean Code",
    desc: "Writing maintainable, scalable, well-documented code is my standard.",
  },
  {
    icon: Rocket,
    label: "Performance",
    desc: "Obsessed with load times, Lighthouse scores, and smooth UX.",
  },
  {
    icon: Coffee,
    label: "Problem Solver",
    desc: "I turn complex problems into elegant, user-friendly solutions.",
  },
  {
    icon: Heart,
    label: "Passionate",
    desc: "Continuously learning and keeping up with the latest in web tech.",
  },
];

function HighlightCard({ icon: Icon, label, desc, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className="group flex items-start gap-4 p-5 rounded-2xl bg-surface/60 glow-border hover:bg-surface transition-all duration-300 cursor-default"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors duration-300">
        <Icon size={18} className="text-accent" />
      </div>
      <div>
        <div className="font-syne font-semibold text-text-primary mb-1">
          {label}
        </div>
        <div className="font-dm text-sm text-text-secondary leading-relaxed">
          {desc}
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const leftRef = useRef(null);
  const inView = useInView(leftRef, { once: true, margin: "-60px" });

  return (
    <section id="about" className="relative py-5 bg-bg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-600/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-600/5 blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle
          tag="About Me"
          title="Crafting Digital"
          highlight="Experiences"
          subtitle="A passionate developer with a love for clean code and beautiful UIs."
        />

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left - text */}
          <div ref={leftRef} className="space-y-6">
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-dm text-text-secondary text-lg leading-relaxed"
            >
              I'm a{" "}
              <span className="text-text-primary font-medium">
                MERN Stack Developer
              </span>{" "}
              based in India, with a strong focus on building modern,
              responsive, and performant web applications. I specialize in{" "}
              <span className="text-accent font-medium">React.js</span>,
              Node.js, Express, and MongoDB — bringing ideas to life from
              concept to deployment.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-dm text-text-secondary text-lg leading-relaxed"
            >
              When I'm not coding, you'll find me exploring new technologies,
              contributing to open-source projects, or diving deep into design
              systems and micro-interactions that create delightful user
              experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              {[
                "JavaScript",
                "TypeScript",
                "React",
                "Node.js",
                "MongoDB",
                "Tailwind",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 font-dm text-sm text-accent border border-accent/30 bg-accent/5 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex gap-6 pt-4"
            >
              <a
                href="#contact"
                className="px-6 py-3 bg-accent text-white font-dm font-medium rounded-xl hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Let's Talk
              </a>
              <a
                href="https://www.overleaf.com/project/69f4ccd2a77545648f1565de"
                download
                className="px-6 py-3 border border-purple-500/30 text-text-secondary font-dm font-medium rounded-xl hover:border-accent/60 hover:text-text-primary hover:bg-purple-500/5 transition-all duration-300 hover:-translate-y-0.5"
              >
                Download CV
              </a>
            </motion.div>
          </div>

          {/* Right - highlight cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map(({ icon, label, desc }, i) => (
              <HighlightCard
                key={label}
                icon={icon}
                label={label}
                desc={desc}
                delay={0.1 + i * 0.1}
              />
            ))}

            {/* Stat badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-cyan-900/20 border border-purple-500/20 flex items-center justify-around"
            >
              {[
                { n: "2+", l: "Years" },
                { n: "20+", l: "Projects" },
                { n: "10+", l: "Happy Clients" },
              ].map(({ n, l }) => (
                <div key={l} className="text-center">
                  <div className="font-syne font-bold text-3xl gradient-text">
                    {n}
                  </div>
                  <div className="font-dm text-xs text-muted mt-1">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
