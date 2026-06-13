import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SectionTitle({ tag, title, highlight, subtitle }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="text-center mb-5 z-10">
      {tag && (
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35 }}
          className="inline-block font-mono-hacker text-[9px] font-bold tracking-[0.1em] uppercase text-accent mb-2 px-2 py-0.5 bg-accent/5 border border-accent/30 rounded"
        >
          &gt;&gt; {tag}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="font-mono-hacker font-bold text-xl sm:text-2xl lg:text-3xl text-text-primary leading-tight tracking-wider"
      >
        {title}{' '}
        {highlight && <span className="gradient-text-cyber">{highlight}</span>}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-dm text-text-secondary mt-1.5 max-w-lg mx-auto text-xs leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
