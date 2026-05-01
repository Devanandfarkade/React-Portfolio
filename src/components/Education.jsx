import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";
import SectionTitle from "./SectionTitle";

const education = [
  {
    id: 1,
    degree: "Master of Computer Application (MCA)",
    field: "Computer Applications",
    institution: "JSPM Narhe Technical Campus",
    location: "Pune, Maharashtra",
    period: "2023 – 2025",
    grade: "8.03 CGPA",
    color: "#a855f7",
    highlights: [
      "Graduated with First class with distinction",
      "Led college tech club for 2 years",
      "Participated in 2 inter-college hackathons",
      "Final project: Full-stack MERN e-learning platform",
    ],
  },
  {
    id: 2,
    degree: "Bachelor of Computer Application (BCA)",
    field: "Computer Applications",
    institution: "CMCS College",
    location: "Nashik, Maharashtra",
    period: "2019 – 2022",
    grade: "6.67 CGPA",
    color: "#a855f7",
    highlights: [
      "Graduated with First Class Honors",
      "Led college tech club for 2 years",
      "Participated in 2 inter-college hackathons",
      "Final project: Full-stack MERN e-learning platform",
    ],
  },

  {
    id: 3,
    degree: "Maharashtra State Board of Secondary & HSC Education",
    field: "Science — Physics, Chemistry, Mathematics,Biology",
    institution: "Rajkunwar College Dhanwat",
    location: "Pune, Maharashtra",
    period: "2017 – 2018",
    grade: "64.62%",
    color: "#06b6d4",
    highlights: [
      "Participated in Hallyball tournaments in 2017-18",
      "Participated in NSS activities and community service",
    ],
  },
];

function EduCard({ edu, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.15 }}
      className="group relative p-8 rounded-3xl bg-surface glow-border hover:shadow-2xl hover:shadow-purple-900/15 transition-all duration-500 overflow-hidden"
    >
      {/* Glow blob */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: edu.color }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: edu.color + "20" }}
            >
              <GraduationCap size={24} style={{ color: edu.color }} />
            </div>
            <div>
              <h3 className="font-syne font-bold text-xl text-text-primary mb-0.5">
                {edu.degree}
              </h3>
              <div
                className="font-dm text-sm font-medium"
                style={{ color: edu.color }}
              >
                {edu.field}
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-syne font-bold text-sm"
            style={{ backgroundColor: edu.color + "15", color: edu.color }}
          >
            <Award size={14} />
            {edu.grade}
          </div>
        </div>

        {/* Info row */}
        <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-purple-900/20">
          <div className="flex items-center gap-1.5 text-sm font-dm text-text-secondary">
            <MapPin size={13} className="text-muted" />
            <span className="font-medium text-text-primary">
              {edu.institution}
            </span>
            <span className="text-muted">— {edu.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-dm text-muted">
            <Calendar size={13} />
            {edu.period}
          </div>
        </div>

        {/* Highlights */}
        <ul className="grid sm:grid-cols-2 gap-2">
          {edu.highlights.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-2 font-dm text-sm text-text-secondary"
            >
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: edu.color }}
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Education() {
  return (
    <section id="education" className="relative py-5 bg-bg overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-cyan-900/8 blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-12">
        <SectionTitle
          tag="Academic Background"
          title="My"
          highlight="Education"
          subtitle="The academic foundation that shaped my technical thinking."
        />

        <div className="space-y-6">
          {education.map((edu, i) => (
            <EduCard key={edu.id} edu={edu} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
