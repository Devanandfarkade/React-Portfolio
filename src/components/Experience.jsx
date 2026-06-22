import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Calendar, MapPin, ArrowRight, Server } from "lucide-react";
import SectionTitle from "./SectionTitle";
import ExperienceScene from "./3D/ExperienceScene";
import ViewportCanvas from "./ViewportCanvas";
import { useScrollIndicator, ScrollIndicator } from "./ScrollIndicator";
import { api } from "../services/api";



function ExpTimelineCard({ exp, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, x: 20 }} 
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="p-4 rounded-xl bg-surface/40 border border-accent-2/10 hover:border-accent/40 hover:bg-surface-2/30 transition-all duration-300 relative"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-accent-2/10 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: exp.color }} />
          <span className="font-mono-hacker text-xs uppercase font-semibold" style={{ color: exp.color }}>{exp.role}</span>
        </div>
        <span className="text-[9px] font-mono-hacker text-text-secondary bg-surface px-2 py-0.5 rounded border border-accent-2/15">{exp.type}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono-hacker text-text-secondary mb-2.5">
        <span className="text-accent-2 flex items-center gap-1"><Server size={10} /> {exp.company}</span>
        <span className="flex items-center gap-1"><Calendar size={10} /> {exp.period}</span>
        <span className="flex items-center gap-1"><MapPin size={10} /> {exp.location}</span>
      </div>

      <p className="font-dm text-xs text-text-secondary leading-relaxed mb-3">{exp.desc}</p>
      
      <ul className="space-y-1.5 mb-3">
        {exp.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] font-dm text-text-secondary">
            <ArrowRight size={11} className="mt-0.5 flex-shrink-0 text-accent" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1 border-t border-accent-2/10 pt-2.5">
        {exp.tech.map((t) => (
          <span key={t} className="text-[9px] font-mono-hacker px-2 py-0.5 rounded bg-surface border border-accent-2/10 text-text-secondary">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

import Skeleton from '@mui/material/Skeleton';

export default function Experience({ showSkeleton }) {
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const showIndicator = useScrollIndicator(scrollRef);

  useEffect(() => {
    api.getExperience()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((exp) => ({
            id: exp.id,
            role: exp.role,
            company: exp.company,
            location: exp.location,
            period: exp.period,
            type: exp.type,
            color: exp.color_hex || "#39ff14",
            desc: exp.description,
            points: exp.points || [],
            tech: exp.tech || []
          }));
          setExperienceList(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load experience details:", err);
        setLoading(false);
      });
  }, []);

  const isLoading = loading || showSkeleton;
  const displayExperiences = experienceList || [];

  return (
    <section id="experience" className="relative lg:h-screen lg:max-h-screen lg:min-h-[600px] flex items-center py-12 lg:py-0 bg-surface/5 overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col justify-center">
        <SectionTitle tag="EXPERIENCE" title="EXPERIENCE:" highlight="WORK HISTORY"
          subtitle="Employment history and previous workplace logs..." />

        {/* Side-by-side equal-height layout: 3D Left, Content Right */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch mt-3">
          
          {/* 3D Model Scene (Left Column) */}
          <div className="relative w-full h-[300px] lg:h-auto rounded-3xl overflow-hidden border border-accent/20 bg-surface/20">
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" className="bg-surface-2/40" />
            ) : (
              <ViewportCanvas title="3D_EXPERIENCE_MODEL">
                <ExperienceScene />
              </ViewportCanvas>
            )}
          </div>

          {/* Experience list (Right Column - matching height) */}
          <div className="cyber-card p-6 lg:p-8 rounded-3xl flex flex-col justify-between max-h-[60vh] lg:max-h-[72vh] relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto pr-3 cyber-scrollbar space-y-3.5">
              {isLoading ? (
                [1,2,3].map(i => <Skeleton key={i} variant="rounded" height={160} className="bg-surface-2/40 rounded-xl w-full" />)
              ) : (
                displayExperiences.map((exp, i) => (
                  <ExpTimelineCard key={exp.id} exp={exp} index={i} />
                ))
              )}
            </div>

            <ScrollIndicator visible={showIndicator} className="bottom-5" />
          </div>
          
        </div>
      </div>
    </section>
  );
}