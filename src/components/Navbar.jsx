import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";

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
      { threshold: 0.4 },
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
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#060411]/90 backdrop-blur-xl border-b border-purple-900/30 shadow-lg shadow-purple-900/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="font-syne font-bold text-xl"
            whileHover={{ scale: 1.05 }}
          >
            <span className="gradient-text">{"<Devaa />"}</span>
          </motion.a>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const isActive = active === href.slice(1);
              return (
                <li key={label}>
                  <a
                    href={href}
                    className={`relative px-4 py-2 font-dm text-sm font-medium rounded-full transition-all duration-300 ${
                      isActive
                        ? "text-accent"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-purple-500/10 border border-purple-500/30 rounded-full"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.4,
                        }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <motion.a
              href="https://www.overleaf.com/project/69f4ccd2a77545648f1565de"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/40 text-accent text-sm font-dm font-medium rounded-full hover:bg-accent/20 transition-all duration-300"
            >
              <Download size={14} />
              Resume
            </motion.a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0f0b1a]/95 backdrop-blur-xl border-b border-purple-900/30"
          >
            <ul className="flex flex-col p-6 gap-2">
              {navLinks.map(({ label, href }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-text-secondary hover:text-accent font-dm font-medium rounded-xl hover:bg-purple-500/10 transition-all duration-200"
                  >
                    {label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.06 }}
                className="pt-2"
              >
                <a
                  href="/resume.pdf"
                  download
                  className="flex items-center gap-2 px-4 py-3 bg-accent text-white font-dm font-medium rounded-xl"
                >
                  <Download size={14} />
                  Download Resume
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
