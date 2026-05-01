import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import SectionTitle from './SectionTitle';

const certs = [
  {
    id: 1,
    title: 'Meta React Developer Certificate',
    issuer: 'Meta (Coursera)',
    date: 'March 2024',
    credId: 'META-REACT-2024',
    link: 'https://coursera.org',
    color: '#0081fb',
    icon: '⚛️',
    skills: ['React', 'JSX', 'Hooks', 'Component Design'],
  },
  {
    id: 2,
    title: 'Node.js & MongoDB Full Stack',
    issuer: 'Udemy',
    date: 'January 2024',
    credId: 'UC-NODE-MONGO-01',
    link: 'https://udemy.com',
    color: '#a435f0',
    icon: '🟢',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
  },
  {
    id: 3,
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: 'November 2023',
    credId: 'AWS-CLF-C01-2023',
    link: 'https://aws.amazon.com',
    color: '#ff9900',
    icon: '☁️',
    skills: ['Cloud', 'EC2', 'S3', 'Lambda'],
  },
  {
    id: 4,
    title: 'JavaScript Algorithms & DS',
    issuer: 'freeCodeCamp',
    date: 'August 2023',
    credId: 'FCC-JS-ALG-2023',
    link: 'https://freecodecamp.org',
    color: '#0a0a23',
    icon: '🏅',
    skills: ['DSA', 'ES6+', 'OOP', 'Functional Programming'],
  },
  {
    id: 5,
    title: 'Google UX Design Certificate',
    issuer: 'Google (Coursera)',
    date: 'June 2023',
    credId: 'GOOGLE-UX-2023',
    link: 'https://coursera.org',
    color: '#4285f4',
    icon: '🎨',
    skills: ['UX Research', 'Figma', 'Prototyping', 'User Testing'],
  },
  {
    id: 6,
    title: 'TypeScript Fundamentals',
    issuer: 'LinkedIn Learning',
    date: 'March 2023',
    credId: 'LI-TS-FUND-2023',
    link: 'https://linkedin.com/learning',
    color: '#0077b5',
    icon: '🔷',
    skills: ['TypeScript', 'Generics', 'Interfaces', 'Type Guards'],
  },
];

function CertCard({ cert, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="group relative p-6 rounded-2xl bg-surface glow-border hover:shadow-xl hover:shadow-purple-900/15 transition-all duration-400 hover:-translate-y-1 overflow-hidden"
    >
      {/* Color top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: `linear-gradient(90deg, ${cert.color}, transparent)` }}
      />

      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: cert.color + '20' }}
        >
          {cert.icon}
        </div>
        <a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-lg bg-surface-2 hover:bg-accent/20 text-muted hover:text-accent transition-all duration-200"
        >
          <ExternalLink size={13} />
        </a>
      </div>

      <h3 className="font-syne font-bold text-text-primary text-base mb-1 leading-snug group-hover:text-accent transition-colors duration-300">
        {cert.title}
      </h3>

      <div className="flex items-center gap-1.5 mb-3">
        <Award size={12} style={{ color: cert.color }} />
        <span className="font-dm text-sm font-medium" style={{ color: cert.color }}>{cert.issuer}</span>
      </div>

      <div className="flex items-center gap-1.5 mb-4 text-xs font-dm text-muted">
        <Calendar size={11} />
        {cert.date}
        <span className="mx-1">·</span>
        <CheckCircle size={11} className="text-green-400" />
        <span className="text-green-400/80">Verified</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {cert.skills.map((s) => (
          <span key={s} className="text-xs font-dm px-2 py-0.5 rounded-md bg-surface-2 text-text-secondary border border-purple-900/25">
            {s}
          </span>
        ))}
      </div>

      {/* Cred ID */}
      <div className="mt-4 pt-4 border-t border-purple-900/20">
        <span className="text-xs font-dm text-muted">ID: {cert.credId}</span>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-28 bg-surface/20 overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle
          tag="Credentials"
          title="My"
          highlight="Certifications"
          subtitle="Industry-recognized credentials validating my technical expertise."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
