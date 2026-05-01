import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, MapPin, Calendar, ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";

const experiences = [
  {
    id: 1,
    role: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "Remote",
    period: "Jan 2024 – Present",
    type: "Full-time",
    color: "#a855f7",
    desc: "Led development of the company's flagship SaaS product using React and TypeScript. Improved performance by 45% and reduced bundle size by 30%.",
    points: [
      "Built 15+ reusable UI components adopted across 3 products",
      "Integrated GraphQL APIs and optimized data fetching with React Query",
      "Mentored 2 junior developers and conducted code reviews",
      "Implemented CI/CD pipelines with GitHub Actions",
    ],
    tech: ["React", "TypeScript", "GraphQL", "Tailwind", "Jest"],
  },
  {
    id: 2,
    role: "MERN Stack Developer",
    company: "Freelance / Self-employed",
    location: "India",
    period: "Jun 2022 – Dec 2023",
    type: "Freelance",
    color: "#06b6d4",
    desc: "Delivered 10+ full-stack web applications for clients across e-commerce, SaaS, and service industries.",
    points: [
      "Developed full-stack apps using React, Node.js, Express, and MongoDB",
      "Integrated payment gateways (Stripe, Razorpay) for 3 e-commerce projects",
      "Built RESTful APIs with JWT authentication and role-based access control",
      "Deployed apps on AWS, Vercel, and DigitalOcean",
    ],
    tech: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
  },
  {
    id: 3,
    role: "Frontend Developer Intern",
    company: "StartupXYZ",
    location: "Pune, India",
    period: "Jan 2022 – May 2022",
    type: "Internship",
    color: "#f59e0b",
    desc: "Contributed to building the company's React-based web app. Worked closely with designers to implement pixel-perfect UIs.",
    points: [
      "Built responsive UI components using React and Tailwind CSS",
      "Integrated REST APIs and managed state with Redux Toolkit",
      "Improved page load speed by 25% through code splitting",
      "Collaborated with design team using Figma to implement UI",
    ],
    tech: ["React", "Redux", "Tailwind CSS", "REST API"],
  },
];

function TimelineItem({ exp, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-start gap-0">
      {/* Left content (desktop) */}
      <div
        className={`hidden lg:block w-[calc(50%-2rem)] ${isLeft ? "pr-12 text-right" : "pl-12 order-last"}`}
      >
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <ExpCard exp={exp} />
          </motion.div>
        )}
      </div>

      {/* Center dot */}
      <div className="relative flex flex-col items-center z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-bg shadow-lg"
          style={{
            backgroundColor: exp.color + "20",
            borderColor: exp.color + "60",
            boxShadow: `0 0 20px ${exp.color}30`,
          }}
        >
          <Briefcase size={18} style={{ color: exp.color }} />
        </motion.div>
        <div
          className="w-px flex-1 bg-gradient-to-b from-purple-500/30 to-transparent mt-2"
          style={{ minHeight: "40px" }}
        />
      </div>

      {/* Right content (desktop) */}
      <div
        className={`hidden lg:block w-[calc(50%-2rem)] ${isLeft ? "pl-12 order-last" : "pr-12 text-right order-first"}`}
      >
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <ExpCard exp={exp} />
          </motion.div>
        )}
      </div>

      {/* Mobile: always below */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
        className="lg:hidden pl-6 pb-8 w-full"
      >
        <ExpCard exp={exp} />
      </motion.div>
    </div>
  );
}

function ExpCard({ exp }) {
  return (
    <div className="p-6 rounded-2xl bg-surface glow-border group hover:bg-surface/80 transition-all duration-300 text-left">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className="text-xs font-dm font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: exp.color + "20", color: exp.color }}
        >
          {exp.type}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted font-dm">
          <Calendar size={11} /> {exp.period}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted font-dm">
          <MapPin size={11} /> {exp.location}
        </span>
      </div>
      <h3 className="font-syne font-bold text-text-primary text-lg mb-0.5">
        {exp.role}
      </h3>
      <div className="font-dm text-accent text-sm font-medium mb-3">
        {exp.company}
      </div>
      <p className="font-dm text-sm text-text-secondary leading-relaxed mb-4">
        {exp.desc}
      </p>
      <ul className="space-y-2 mb-4">
        {exp.points.map((pt, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm font-dm text-text-secondary"
          >
            <ArrowRight
              size={14}
              className="mt-0.5 flex-shrink-0 text-accent"
            />
            {pt}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        {exp.tech.map((t) => (
          <span
            key={t}
            className="text-xs font-dm px-2.5 py-1 rounded-lg bg-surface-2 text-text-secondary border border-purple-900/30"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-28 bg-surface/20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-12">
        <SectionTitle
          tag="Work History"
          title="My"
          highlight="Experience"
          subtitle="My professional journey building real-world software."
        />

        {/* Timeline */}
        <div className="relative">
          {/* Center line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent -translate-x-1/2" />
          {/* Left line (mobile) */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent" />

          <div className="space-y-8 lg:space-y-5">
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.id} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
