import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";
import SectionTitle from "./SectionTitle";
import EducationScene from "./3D/EducationScene";
import ViewportCanvas from "./ViewportCanvas";
import { useScrollIndicator, ScrollIndicator } from "./ScrollIndicator";
import { api } from "../services/api";



function EduCard({ edu, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative p-5 rounded-xl bg-surface/50 border border-accent-2/15 hover:border-accent/40 hover:bg-surface-2/40 transition-all duration-300">
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3.5 flex-wrap gap-3 border-b border-accent-2/10 pb-2.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: edu.color + "15" }}>
              <GraduationCap size={18} style={{ color: edu.color }} />
            </div>
            <div>
              <h3 className="font-mono-hacker font-bold text-sm text-text-primary tracking-wider">{edu.degree}</h3>
              <div className="font-mono-hacker text-[11px] text-text-secondary mt-0.5">{edu.institution}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded border font-mono-hacker text-[10px] font-semibold" style={{ borderColor: edu.color + "44", color: edu.color, backgroundColor: edu.color + "08" }}>
            <Award size={10} /> {edu.grade}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-[10px] font-mono-hacker text-text-secondary mb-3">
          <div className="flex items-center gap-1"><MapPin size={10} /> {edu.location}</div>
          <div className="flex items-center gap-1"><Calendar size={10} /> {edu.period}</div>
        </div>

        <ul className="space-y-1.5">
          {edu.highlights.map((point, i) => (
            <li key={i} className="flex items-start gap-1.5 font-dm text-[11px] text-text-secondary leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: edu.color }} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      
    </motion.div>
  );
}

import Skeleton from '@mui/material/Skeleton';

export default function Education({ showSkeleton }) {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const showIndicator = useScrollIndicator(scrollRef);

  useEffect(() => {
    api.getEducation()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((edu) => ({
            id: edu.id,
            degree: edu.degree,
            institution: edu.institution,
            location: edu.location,
            period: edu.period,
            grade: edu.grade,
            color: edu.color_hex || "#00e5ff",
            highlights: edu.highlights || []
          }));
          setEducationList(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch academic credentials:", err);
        setLoading(false);
      });
  }, []);

  const isLoading = loading || showSkeleton;
  const displayEducation = educationList || [];

  return (
    <section id="education" className="relative lg:h-screen lg:max-h-screen lg:min-h-[600px] flex items-center py-12 lg:py-0 bg-bg overflow-hidden hacker-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col justify-center">
        <SectionTitle tag="EDUCATION" title="EDUCATION:" highlight="ACADEMIC BACKGROUND"
          subtitle="University degrees and database verification checks..." />

        {/* Side-by-side equal-height layout: Content Left, 3D Right */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch mt-3">
          
          {/* Content (Left Column) */}
          <div className="cyber-card p-6 lg:p-8 rounded-3xl flex flex-col justify-between max-h-[60vh] lg:max-h-[72vh] relative">
            <div ref={scrollRef} className="flex-1 overflow-y-auto pr-3 cyber-scrollbar space-y-4">
              {isLoading ? (
                [1,2].map(i => <Skeleton key={i} variant="rounded" height={150} className="bg-surface-2/40 rounded-xl w-full" />)
              ) : (
                displayEducation.map((edu, i) => (
                  <EduCard key={edu.id} edu={edu} index={i} />
                ))
              )}
            </div>

            <ScrollIndicator visible={showIndicator} className="bottom-[70px]" />
            <div className="border-t border-accent-2/20 pt-4 mt-6 text-left font-mono-hacker text-[10px] text-accent-2/50">
              SYS_LOG: SECURE CERT_CHECKS: PASS.
            </div>
          </div>

          {/* 3D Scene (Right Column - matching height) */}
          <div className="relative w-full h-[300px] lg:h-auto rounded-3xl overflow-hidden border border-accent-2/20 bg-surface/25 flex items-stretch">
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" className="bg-surface-2/40" />
            ) : (
              <ViewportCanvas title="3D_EDUCATION_MODEL">
                <EducationScene />
              </ViewportCanvas>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}