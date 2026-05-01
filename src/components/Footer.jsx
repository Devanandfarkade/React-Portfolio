import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp } from 'lucide-react';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

const socials = [
  { icon: Github, href: 'https://github.com/', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com/', label: 'Twitter' },
  { icon: Mail, href: 'mailto:your@email.com', label: 'Email' },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-surface/40 border-t border-purple-900/20 overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <a href="#hero" className="font-syne font-bold text-2xl gradient-text mb-4 block">{'<Dev />'}</a>
            <p className="font-dm text-sm text-text-secondary leading-relaxed max-w-xs">
              MERN Stack Developer crafting performant, accessible, and visually stunning digital experiences.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-2 border border-purple-900/30 text-text-secondary hover:text-accent hover:border-accent/40 transition-all duration-200"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-syne font-semibold text-text-primary mb-5">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="font-dm text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Availability CTA */}
          <div>
            <h4 className="font-syne font-semibold text-text-primary mb-5">Work Together</h4>
            <p className="font-dm text-sm text-text-secondary mb-4">
              Looking for a dedicated developer? Let's build something great.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent/10 border border-accent/30 text-accent font-dm text-sm font-medium rounded-xl hover:bg-accent/20 transition-all duration-300"
            >
              <Mail size={14} />
              Start a Conversation
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-purple-900/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-dm text-sm text-muted flex items-center gap-1.5">
            Built with <Heart size={13} className="text-red-400 fill-red-400" /> using React, Tailwind & Three.js
            <span className="mx-1">·</span>
            © {new Date().getFullYear()} Your Name
          </p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-purple-900/30 text-text-secondary hover:text-accent hover:border-accent/40 font-dm text-sm transition-all duration-200"
          >
            <ArrowUp size={14} />
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
