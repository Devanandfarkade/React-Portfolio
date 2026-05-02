import { useState, useRef, Suspense } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ExternalLink, Github, Star, Eye } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ProjectsScene from "./3D/ProjectsScene";

const filters = ["All", "Full Stack", "Frontend", "Backend"];
const projects = [
  { id: 1, title: "ShopMERN", desc: "Full-featured e-commerce platform with cart, payment integration, admin dashboard, and order tracking. Built with MERN stack and Stripe.", tags: ["React", "Node.js", "MongoDB", "Stripe", "Redux"], cat: "Full Stack", stars: 42, views: 1200, live: "https://example.com", repo: "https://github.com", color: "#a855f7", featured: true },
  { id: 2, title: "DevConnect", desc: "Social network for developers — profiles, posts, GitHub integration, and real-time chat using Socket.io.", tags: ["React", "Express", "MongoDB", "Socket.io", "JWT"], cat: "Full Stack", stars: 38, views: 890, live: "https://example.com", repo: "https://github.com", color: "#06b6d4", featured: true },
  { id: 3, title: "PortfolioGen", desc: "AI-powered portfolio generator that builds a beautiful site from a form. React frontend + OpenAI API.", tags: ["React", "Tailwind", "OpenAI", "Vite"], cat: "Frontend", stars: 21, views: 450, live: "https://example.com", repo: "https://github.com", color: "#f59e0b", featured: false },
  { id: 4, title: "Task API", desc: "RESTful task management API with authentication, role-based access, rate limiting, and full test coverage.", tags: ["Node.js", "Express", "MongoDB", "Jest"], cat: "Backend", stars: 15, views: 320, live: null, repo: "https://github.com", color: "#10b981", featured: false },
  { id: 5, title: "Finance Tracker", desc: "Personal finance tracker with charts, budgets, and category analysis. Charts built with Recharts.", tags: ["React", "Node.js", "Chart.js", "Tailwind"], cat: "Full Stack", stars: 29, views: 680, live: "https://example.com", repo: "https://github.com", color: "#8b5cf6", featured: false },
  { id: 6, title: "UI Component Kit", desc: "Open-source React component library with 50+ accessible, animated components and full Storybook docs.", tags: ["React", "TypeScript", "Framer Motion", "Storybook"], cat: "Frontend", stars: 57, views: 2100, live: "https://example.com", repo: "https://github.com", color: "#ec4899", featured: false },
];

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative rounded-3xl bg-surface glow-border overflow-hidden hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-500 hover:-translate-y-1 flex flex-col">
      <div className="h-1 w-full opacity-80" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}44)` }} />
      <div className="p-6 pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {project.featured && <span className="text-xs font-dm font-medium px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">Featured</span>}
            <span className="text-xs font-dm text-muted">{project.cat}</span>
          </div>
          <h3 className="font-syne font-bold text-xl text-text-primary group-hover:text-accent transition-colors duration-300">{project.title}</h3>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-2 hover:bg-accent/20 text-text-secondary hover:text-accent transition-all"><Github size={14} /></a>}
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-2 hover:bg-accent/20 text-text-secondary hover:text-accent transition-all"><ExternalLink size={14} /></a>}
        </div>
      </div>
      <p className="px-6 font-dm text-sm text-text-secondary leading-relaxed flex-1">{project.desc}</p>
      <div className="px-6 pt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => <span key={tag} className="text-xs font-dm px-2.5 py-1 rounded-lg bg-surface-2 text-text-secondary border border-purple-900/30">{tag}</span>)}
      </div>
      <div className="px-6 py-4 mt-4 border-t border-purple-900/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs font-dm text-muted"><Star size={12} className="text-yellow-400" />{project.stars}</span>
          <span className="flex items-center gap-1.5 text-xs font-dm text-muted"><Eye size={12} className="text-cyan-400" />{project.views}</span>
        </div>
        <a href={project.live || project.repo} target="_blank" rel="noopener noreferrer" className="text-xs font-dm font-medium text-accent hover:underline flex items-center gap-1">View <ExternalLink size={10} /></a>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.cat === active);

  return (
    <section id="projects" className="relative py-24 bg-bg overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/4 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle tag="My Work" title="Featured" highlight="Projects"
          subtitle="A selection of real-world projects that showcase my skills and passion." />

        {/* Brain 3D banner */}
        <div className="relative h-[300px] lg:h-[380px] rounded-3xl overflow-hidden bg-surface/20 glow-border mb-12">
          <Suspense fallback={null}>
            <ProjectsScene />
          </Suspense>
          <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/80 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="font-syne font-bold text-3xl lg:text-4xl text-text-primary text-center">Think. Build. Ship.</p>
            <p className="font-dm text-text-secondary mt-2 text-sm">Every project tells a story of problem-solving</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map((f) => (
            <motion.button key={f} onClick={() => setActive(f)} whileTap={{ scale: 0.95 }}
              className={`px-6 py-2.5 rounded-full font-dm font-medium text-sm transition-all duration-300 ${active === f ? "bg-accent text-white shadow-lg shadow-purple-500/30" : "bg-surface border border-purple-900/40 text-text-secondary hover:border-accent/50 hover:text-text-primary"}`}>
              {f}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-purple-500/40 text-text-secondary font-dm font-medium rounded-xl hover:border-accent/70 hover:text-accent hover:bg-accent/5 transition-all duration-300">
            <Github size={16} /> View All on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}