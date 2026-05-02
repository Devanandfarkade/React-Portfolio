import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
} from "lucide-react";
import DotField from "./DotField";
import Scene3D from "./3D/Scene3D";
import DecryptedText from "./DecryptedText";

const roles = [
  "MERN Stack Developer",
  "Frontend Engineer",
  "React Specialist",
  "UI/UX Craftsman",
  "Full Stack Builder",
];

function TypingText({ texts, speed = 80, pause = 1800 }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout;
    const current = texts[idx];
    if (typing) {
      if (display.length < current.length) {
        timeout = setTimeout(
          () => setDisplay(current.slice(0, display.length + 1)),
          speed,
        );
      } else {
        timeout = setTimeout(() => setTyping(false), pause);
      }
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(display.slice(0, -1)), speed / 2);
      } else {
        setIdx((prev) => (prev + 1) % texts.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [display, typing, idx, texts, speed, pause]);

  return (
    <span className="gradient-text">
      {display}
      <span className="typing-cursor text-accent">|</span>
    </span>
  );
}

const socials = [
  { icon: Github, href: "https://github.com/", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/", label: "Twitter" },
  { icon: Mail, href: "mailto:devaapatil330@gmail.com", label: "Email" },
];

const stats = [
  { value: "2+", label: "Years Exp." },
  { value: "20+", label: "Projects" },
  { value: "10+", label: "Clients" },
  { value: "5+", label: "Certs" },
];

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-bg flex flex-col"
    >
      {/* DotField full background */}
      <div
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      >
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#A855F7"
          gradientTo="#B497CF"
          glowColor="#120F17"
        />
      </div>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-bg/60 via-bg/40 to-bg pointer-events-none" />

      {/* 3D Scene - right side */}
      <div className="absolute right-0 top-0 w-full lg:w-[55%] h-full z-[2] opacity-80">
        <Suspense fallback={null}>
          <Scene3D height="100%" />
        </Suspense>
      </div>

      {/* Left gradient fade over 3D */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-bg via-bg/80 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute left-20 top-0 z-[4] flex flex-col justify-left min-h-screen mx-auto px-0 lg:px-12 py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-dm text-sm text-text-secondary">
              Available for work
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-syne font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-4"
          >
            Hi, I'm{" "}
            <span className="gradient-text-purple block mt-1">Devanand</span>
          </motion.h1>

          {/* Typing role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-syne text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 h-10"
          >
            <TypingText texts={roles} />
          </motion.div>

          {/* Description with DecryptedText - SMOOTH SEQUENTIAL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-dm text-text-secondary text-base sm:text-lg leading-relaxed mb-10 max-w-xl"
          >
            <DecryptedText
              text="I craft fast, accessible, and visually stunning web applications using the MERN stack. Passionate about pixel-perfect UIs and scalable architectures."
              speed={80}
              sequential={true}
              revealDirection="start"
              useOriginalCharsOnly={false}
              animateOn="view"
              className="text-text-secondary"
              parentClassName="inline-block"
              encryptedClassName="text-purple-400/40"
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?"
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap gap-4 pb-5"
          >
            <a
              href="#projects"
              className="group flex items-center gap-2 px-8 py-4 bg-accent text-white font-dm font-semibold rounded-xl hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              View My Work
              <ExternalLink
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 px-8 py-4 bg-transparent border border-purple-500/40 text-text-primary font-dm font-semibold rounded-xl hover:bg-purple-500/10 hover:border-purple-500/70 transition-all duration-300 hover:-translate-y-0.5"
            >
              Hire Me
            </a>
          </motion.div>

          {/* Socials */}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="bottom-28 mt-1 left-6 lg:left-12 flex gap-8"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-syne font-bold text-2xl gradient-text">
                {value}
              </div>
              <div className="font-dm text-xs text-muted mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-2 text-muted hover:text-accent transition-colors"
      >
        <span className="font-dm text-xs tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={18} />
        </motion.div>
      </motion.a>
    </section>
  );
}