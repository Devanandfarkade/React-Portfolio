import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import SectionTitle from './SectionTitle';
import CertsScene from './3D/CertsScene';
import ViewportCanvas from './ViewportCanvas';

const certs = [
  { id: 1, title: 'Java Full Stack Development', issuer: 'QSpiders Wakad, Pune', date: 'Mar 2023 - Sep 2023', credId: 'QS-JFS-2023', link: 'https://qspiders.com', color: '#39ff14', icon: '☕', skills: ['Java', 'SQL', 'Web Technologies', 'J2EE'] },
  { id: 2, title: 'Java Full Stack Development', issuer: 'Symbiosis (Capgemini), Pune', date: 'Jun 2024 - Aug 2024', credId: 'SYM-CAP-24', link: 'https://capgemini.com', color: '#00e5ff', icon: '💻', skills: ['Enterprise Java', 'Spring Boot', 'Angular', 'Agile'] },
  { id: 3, title: "Technology's Impact on Business", issuer: 'HP LIFE Online Course', date: 'Oct 2022 - Nov 2022', credId: 'HP-LIFE-2022', link: 'https://life-global.org', color: '#ffb700', icon: '📊', skills: ['Business IT', 'Tech Strategy', 'Analytics'] },
  { id: 4, title: 'Basics of Java Certification', issuer: 'CodeChef', date: 'Aug 2023', credId: 'CC-JAVA-23', link: 'https://codechef.com', color: '#ff007f', icon: '🍳', skills: ['Java Basics', 'OOPs', 'Problem Solving'] },
];

function CertCard({ cert, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative p-5 rounded-2xl bg-surface/50 border border-accent-2/15 hover:border-accent/40 hover:bg-surface-2/40 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60" style={{ background: `linear-gradient(90deg, ${cert.color}, transparent)` }} />
      
      <div>
        <div className="flex items-start justify-between mb-3 border-b border-accent-2/10 pb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: cert.color + '15' }}>{cert.icon}</div>
          <a href={cert.link} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-surface border border-accent-2/20 hover:border-accent hover:text-accent transition-all duration-200">
            <ExternalLink size={12} />
          </a>
        </div>
        <h3 className="font-mono-hacker font-bold text-sm text-text-primary leading-snug group-hover:text-accent transition-colors duration-300 tracking-wider">{cert.title}</h3>
        <div className="flex items-center gap-1.5 mt-2 mb-2">
          <Award size={11} style={{ color: cert.color }} />
          <span className="font-mono-hacker text-xs" style={{ color: cert.color }}>{cert.issuer}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono-hacker text-text-secondary mb-4">
          <Calendar size={10} /> {cert.date} <span className="mx-1">·</span> <CheckCircle size={10} className="text-accent" /> <span className="text-accent">VERIFIED</span>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-1 mb-3">
          {cert.skills.map((s) => <span key={s} className="text-[9px] font-mono-hacker px-2 py-0.5 rounded bg-surface border border-accent-2/10 text-text-secondary">{s}</span>)}
        </div>
        <div className="pt-2.5 border-t border-accent-2/10 flex justify-between text-[9px] font-mono-hacker text-text-secondary/50">
          <span>CRED_ID: {cert.credId}</span>
          <span>SYS_VER: 2.0</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-24 bg-surface/5 overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle tag="SYSTEM_CREDENTIALS" title="VERIFIED_CERTIFICATES:" highlight="CREDENTIALS"
          subtitle="Loading professional accreditations and capstone validation tokens..." />

        {/* Side-by-side equal-height layout: 3D Left, Content Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12">
          
          {/* 3D Medal scene (Left Column) */}
          <div className="relative w-full h-full min-h-[450px] lg:min-h-0 rounded-3xl overflow-hidden border border-accent/20 bg-surface/20">
            <ViewportCanvas title="ACCREDITATIONS_MEDALLION_3D">
              <CertsScene />
            </ViewportCanvas>
          </div>

          {/* Cert cards list (Right Column - matching height) */}
          <div className="cyber-card p-8 rounded-3xl space-y-5 flex flex-col justify-between overflow-y-auto max-h-[700px]">
            <div className="grid sm:grid-cols-2 gap-4">
              {certs.map((cert, i) => <CertCard key={cert.id} cert={cert} index={i} />)}
            </div>
            <div className="border-t border-accent-2/20 pt-4 text-left font-mono-hacker text-[10px] text-accent-2/50">
              SYS_LOG: VERIFIED SIGNATURE CERTIFICATE REGISTRY RETRIEVED. STATUS: COMPLETE.
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}