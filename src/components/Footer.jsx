import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Shield, ArrowUp, Download } from "lucide-react";
import { api } from "../services/api";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { icon: Github, href: "https://github.com/Devanandfarkade", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/devanandfarkade",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:devaapatil330@gmail.com", label: "Email" },
];

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.getProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => {
        console.error("Footer failed to load profile settings:", err);
      });
  }, []);

  const resumeUrl = profile?.resume_url || "https://www.overleaf.com/project/69f4ccd2a77545648f1565de";
  const email = profile?.email || "devaapatil330@gmail.com";
  const githubUrl = profile?.github_url || "https://github.com/Devanandfarkade";
  const linkedinUrl = profile?.linkedin_url || "https://linkedin.com/in/devanandfarkade";

  const displaySocials = [
    { icon: Github, href: githubUrl, label: "GitHub" },
    { icon: Linkedin, href: linkedinUrl, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${email}`, label: "Email" },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-[#020308] border-t border-accent/25 overflow-hidden hacker-grid">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <a
              href="#hero"
              className="font-mono-hacker font-bold text-lg text-accent tracking-wider block"
            >
              &lt;DEVANAND FARKADE /&gt;
            </a>
            <p className="font-dm text-sm text-text-secondary leading-relaxed max-w-xs">
              Full Stack Developer crafting performant, scalable, and secure digital architectures with React.js, Node.js, and Java.
            </p>
            <div className="flex gap-2.5 pt-2">
              {displaySocials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="w-8 h-8 flex items-center justify-center rounded bg-surface border border-accent-2/15 text-text-secondary hover:text-accent hover:border-accent/40 transition-all duration-200"
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="font-mono-hacker font-semibold text-text-primary text-xs uppercase tracking-wider">
              &gt; Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-2 font-mono-hacker text-xs">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-text-secondary hover:text-accent transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  <Download size={10} /> Resume
                </a>
              </li>
            </ul>
          </div>

          {/* Comms Link */}
          <div className="space-y-4">
            <h4 className="font-mono-hacker font-semibold text-text-primary text-xs uppercase tracking-wider">
              &gt; Contact Me
            </h4>
            <p className="font-dm text-sm text-text-secondary leading-relaxed">
              Looking for a dedicated full-stack developer? Let's build something great.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/5 border border-accent/35 text-accent font-mono-hacker text-xs font-semibold rounded hover:bg-accent hover:text-black transition-all duration-200"
            >
              <Mail size={12} />
              Send Message
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-accent-2/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono-hacker text-[10px] text-text-secondary/50 flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
            <Shield size={10} className="text-accent animate-pulse" />
            <span>Active</span>
            <span>·</span>
            <span>Portfolio v2.0.8</span>
            <span>·</span>
            <span>© {new Date().getFullYear()} Devanand Farkade</span>
          </p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded bg-surface border border-accent-2/20 text-text-secondary hover:text-accent hover:border-accent font-mono-hacker text-xs tracking-wider transition-all duration-150"
          >
            <ArrowUp size={12} />
            Back to Top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
