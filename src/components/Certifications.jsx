import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import SectionTitle from './SectionTitle';
import CertsScene from './3D/CertsScene';
import ViewportCanvas from './ViewportCanvas';
import { useScrollIndicator, ScrollIndicator } from './ScrollIndicator';
import { api } from '../services/api';

const fallbackCerts = [
  { id: 1, title: 'Java Full Stack Development', issuer: 'QSpiders Wakad, Pune', date: 'Mar 2023 - Sep 2023', credId: 'QS-JFS-2023', link: 'https://qspiders.com', color: '#39ff14', icon: '☕', skills: ['Java', 'SQL', 'Web Technologies', 'J2EE'] },
  { id: 2, title: 'Java Full Stack Development', issuer: 'Symbiosis (Capgemini), Pune', date: 'Jun 2024 - Aug 2024', credId: 'SYM-CAP-24', link: 'https://capgemini.com', color: '#00e5ff', icon: '💻', skills: ['Enterprise Java', 'Spring Boot', 'Angular', 'Agile'] },
  { id: 3, title: "Technology's Impact on Business", issuer: 'HP LIFE Online Course', date: 'Oct 2022 - Nov 2022', credId: 'HP-LIFE-2022', link: 'https://life-global.org', color: '#ffb700', icon: '📊', skills: ['Business IT', 'Tech Strategy', 'Analytics'] },
  { id: 4, title: 'Basics of Java Certification', issuer: 'CodeChef', date: 'Aug 23', credId: 'CC-JAVA-23', link: 'https://codechef.com', color: '#ff007f', icon: '🍳', skills: ['Java Basics', 'OOPs', 'Problem Solving'] },
];

function CertCard({ cert, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group relative p-4 rounded-xl bg-surface/50 border border-accent-2/15 hover:border-accent/40 hover:bg-surface-2/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
      style={{ borderColor: `${cert.color}20` }}>
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60" style={{ background: `linear-gradient(90deg, ${cert.color}, transparent)` }} />
      
      <div>
        <div className="flex items-start justify-between mb-2.5 border-b border-accent-2/10 pb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: cert.color + '15' }}>{cert.icon}</div>
          {cert.link && (
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded bg-surface border border-accent-2/20 hover:border-accent text-text-secondary hover:text-accent transition-all duration-200">
              <ExternalLink size={10} />
            </a>
          )}
        </div>
        <h3 className="font-mono-hacker font-bold text-xs text-text-primary leading-snug group-hover:text-accent transition-colors duration-300 tracking-wider">{cert.title}</h3>
        <div className="flex items-center gap-1.5 mt-1.5 mb-1.5">
          <Award size={10} style={{ color: cert.color }} />
          <span className="font-mono-hacker text-[10px]" style={{ color: cert.color }}>{cert.issuer}</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono-hacker text-text-secondary mb-3">
          <Calendar size={9} /> {cert.date} <span className="mx-1">·</span> <CheckCircle size={9} className="text-accent" /> <span className="text-accent">VERIFIED</span>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-1 mb-2.5">
          {cert.skills.map((s) => <span key={s} className="text-[8px] font-mono-hacker px-1.5 py-0.5 rounded bg-surface border border-accent-2/10 text-text-secondary">{s}</span>)}
        </div>
        <div className="pt-2 border-t border-accent-2/10 flex justify-between text-[8px] font-mono-hacker text-text-secondary/50">
          <span>ID: {cert.credId}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  const [certsList, setCertsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const showIndicator = useScrollIndicator(scrollRef);

  useEffect(() => {
    api.getCerts()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((cert) => ({
            id: cert.id,
            title: cert.title,
            issuer: cert.issuer,
            date: cert.date,
            credId: cert.credential_id,
            link: cert.link,
            color: cert.color_hex || '#39ff14',
            icon: cert.icon_emoji || '🎓',
            skills: cert.skills || []
          }));
          setCertsList(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load credentials ledger:", err);
        setLoading(false);
      });
  }, []);

  const displayCerts = certsList.length > 0 ? certsList : fallbackCerts;

  return (
    <section id="certifications" className="relative lg:h-screen lg:max-h-screen lg:min-h-[600px] flex items-center py-12 lg:py-0 bg-surface/5 overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col justify-center">
        <SectionTitle tag="CERTIFICATIONS" title="CERTIFICATIONS:" highlight="CREDENTIALS"
          subtitle="Accreditation files and technical capstone tokens..." />

        {/* Side-by-side equal-height layout: 3D Left, Content Right */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch mt-3">
          
          {/* 3D Medal scene (Left Column) */}
          <div className="relative w-full h-[300px] lg:h-auto rounded-3xl overflow-hidden border border-accent/20 bg-surface/20">
            <ViewportCanvas title="3D_CERTIFICATIONS_MODEL">
              <CertsScene />
            </ViewportCanvas>
          </div>

          {/* Cert cards list (Right Column - matching height) */}
          <div className="cyber-card p-6 lg:p-8 rounded-3xl flex flex-col justify-between max-h-[60vh] lg:max-h-[72vh] relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto pr-3 cyber-scrollbar">
              <div className="grid sm:grid-cols-2 gap-3.5">
                {displayCerts.map((cert, i) => <CertCard key={cert.id} cert={cert} index={i} />)}
              </div>
            </div>

            <ScrollIndicator visible={showIndicator} className="bottom-[70px]" />
            <div className="border-t border-accent-2/20 pt-4 mt-6 text-left font-mono-hacker text-[10px] text-accent-2/50">
              SYS_LOG: CREDENTIAL INDEX LOADED. STATUS: OK
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}