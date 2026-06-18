import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { api } from "../services/api";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Certs", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const [resumeUrl, setResumeUrl] = useState("https://www.overleaf.com/project/69f4ccd2a77545648f1565de");

  useEffect(() => {
    api.getProfile()
      .then((data) => {
        if (data && data.resume_url) {
          setResumeUrl(data.resume_url);
        }
      })
      .catch((err) => {
        console.error("Navbar failed to load profile settings:", err);
      });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.3 },
    );
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#020308]/90 backdrop-blur-xl border-b border-accent/20 shadow-lg shadow-green-950/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="font-mono-hacker font-bold text-lg text-accent tracking-wider"
            whileHover={{ scale: 1.03 }}
          >
            &lt;<span className="text-white">DEVA_CORE</span> /&gt;
          </motion.a>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-1.5">
            {navLinks.map(({ label, href }) => {
              const isActive = active === href.slice(1);
              return (
                <li key={label}>
                  <a
                    href={href}
                    className={`relative px-3.5 py-1.5 font-mono-hacker text-xs font-semibold tracking-wider transition-all duration-300 ${
                      isActive
                        ? "text-accent"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-accent/5 border border-accent/30 rounded"
                        transition={{
                          type: "spring",
                          bounce: 0.1,
                          duration: 0.35,
                        }}
                      />
                    )}
                    <span className="relative">[{label.toUpperCase()}]</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <motion.a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-accent/5 border border-accent/35 text-accent text-xs font-mono-hacker font-bold rounded hover:bg-accent hover:text-black transition-all duration-200"
            >
              <Download size={12} />
              Resume
            </motion.a>

            <motion.a
              href="#admin-login"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-green-500/5 border border-green-500/35 text-green-400 text-xs font-mono-hacker font-bold rounded hover:bg-green-500 hover:text-black transition-all duration-200"
            >
              Admin Login
            </motion.a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-text-secondary hover:text-accent transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#070c19]/95 backdrop-blur-xl border-b border-accent/25"
          >
            <ul className="flex flex-col p-6 gap-2">
              {navLinks.map(({ label, href }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-text-secondary hover:text-accent font-mono-hacker text-xs tracking-wider rounded hover:bg-accent/5 transition-all duration-150"
                  >
                    &gt; {label.toUpperCase()}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.04 }}
                className="pt-2"
              >
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-accent text-black font-mono-hacker font-bold text-xs rounded"
                >
                  <Download size={12} />
                  DOWNLOAD RESUME
                </a>
              </motion.li>

              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.04 }}
                className="pt-2"
              >
                <a
                  href="#admin-login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-mono-hacker font-bold text-xs rounded hover:bg-green-500 hover:text-black transition-all duration-200"
                >
                  ADMIN LOGIN
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
