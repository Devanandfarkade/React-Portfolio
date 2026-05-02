import { useRef, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, MapPin, Calendar, ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ExperienceScene from "./3D/ExperienceScene";

const experiences = [
  {
    id: 1, role: "Frontend Developer", company: "Rajyug IT Solutions", location: "Pune, India", period: "Dec 2025 – Present", type: "Full-time", color: "#a855f7",
    desc: "Led development of the company's flagship SaaS product using React and TypeScript. Collaborated with cross-functional teams to deliver new features and improve performance.",
    points: ["Built 15+ reusable UI components adopted across 10 products", "Integrated GraphQL APIs and optimized data fetching with React Query", "Implemented CI/CD pipelines with GitHub Actions"],
    tech: ["React", "TypeScript", "JavaScript", "GraphQL", "Tailwind", "Jest"]
  },
  {
    id: 2, role: "MERN Stack Developer", company: "Freelance / Self-employed", location: "India", period: "Jun 2022 – Dec 2023", type: "Freelance", color: "#06b6d4",
    desc: "Delivered 5+ full-stack web applications for clients across e-commerce, SaaS, and service industries.",
    points: ["Developed full-stack apps using React, Node.js, Express, and MongoDB", "Integrated payment gateways (Stripe, Razorpay) for 3 e-commerce projects", "Built RESTful APIs with JWT authentication and role-based access control", "Deployed apps on AWS, Vercel, and DigitalOcean"],
    tech: ["React", "Node.js", "MongoDB", "Express", "Stripe"]
  },
  {
    id: 3, role: "Frontend Developer Intern", company: "Zidio Technologies", location: "Pune, India", period: "Sep 2025 – Nov 2025", type: "Internship", color: "#f59e0b",
    desc: "Contributed to building the company's React-based web app. Worked closely with designers to implement pixel-perfect UIs.",
    points: ["Built responsive UI components using React and Tailwind CSS", "Integrated REST APIs and managed state with Redux Toolkit", "Improved page load speed by 25% through code splitting", "Collaborated with design team using Figma to implement UI"],
    tech: ["React", "Redux", "Tailwind CSS", "REST API"]
  },
];

function ExpCard({ exp }) {
  return (
    <div className="p-6 rounded-2xl bg-surface glow-border group hover:bg-surface/80 transition-all duration-300 text-left">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-dm font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: exp.color + "20", color: exp.color }}>{exp.type}</span>
        <span className="flex items-center gap-1 text-xs text-muted font-dm"><Calendar size={11} /> {exp.period}</span>
        <span className="flex items-center gap-1 text-xs text-muted font-dm"><MapPin size={11} /> {exp.location}</span>
      </div>
      <h3 className="font-syne font-bold text-text-primary text-lg mb-0.5">{exp.role}</h3>
      <div className="font-dm text-accent text-sm font-medium mb-3">{exp.company}</div>
      <p className="font-dm text-sm text-text-secondary leading-relaxed mb-4">{exp.desc}</p>
      <ul className="space-y-2 mb-4">
        {exp.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-sm font-dm text-text-secondary">
            <ArrowRight size={14} className="mt-0.5 flex-shrink-0 text-accent" />{pt}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        {exp.tech.map((t) => <span key={t} className="text-xs font-dm px-2.5 py-1 rounded-lg bg-surface-2 text-text-secondary border border-purple-900/30">{t}</span>)}
      </div>
    </div>
  );
}

function TimelineItem({ exp, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = index % 2 === 0;
  return (
    <div ref={ref} className="relative flex items-start gap-0">
      <div className={`hidden lg:block w-[calc(50%-2rem)] ${isLeft ? "pr-12 text-right" : "pl-12 order-last"}`}>
        {isLeft && <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}><ExpCard exp={exp} /></motion.div>}
      </div>
      <div className="relative flex flex-col items-center z-10">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.2 }}
          className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-bg shadow-lg"
          style={{ backgroundColor: exp.color + "20", borderColor: exp.color + "60", boxShadow: `0 0 24px ${exp.color}40` }}>
          <Briefcase size={18} style={{ color: exp.color }} />
        </motion.div>
        <div className="w-px flex-1 bg-gradient-to-b from-purple-500/30 to-transparent mt-2" style={{ minHeight: "40px" }} />
      </div>
      <div className={`hidden lg:block w-[calc(50%-2rem)] ${isLeft ? "pl-12 order-last" : "pr-12 text-right order-first"}`}>
        {!isLeft && <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}><ExpCard exp={exp} /></motion.div>}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }} className="lg:hidden pl-6 pb-8 w-full">
        <ExpCard exp={exp} />
      </motion.div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 bg-surface/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle tag="Work History" title="My" highlight="Experience"
          subtitle="My professional journey building real-world software." />

        {/* 3D Robot banner */}
        <div className="relative h-[280px] lg:h-[360px] rounded-3xl overflow-hidden bg-surface/20 glow-border mb-14">
          <Suspense fallback={null}>
            <ExperienceScene />
          </Suspense>
          <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-transparent to-bg/85 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="font-syne font-bold text-3xl lg:text-4xl text-text-primary text-center">Built with Purpose</p>
            <p className="font-dm text-text-secondary mt-2 text-sm">Every role shaped who I am as a developer</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent -translate-x-1/2" />
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent" />
          <div className="space-y-8 lg:space-y-0">
            {experiences.map((exp, i) => <TimelineItem key={exp.id} exp={exp} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}