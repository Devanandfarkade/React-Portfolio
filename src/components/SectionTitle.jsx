import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SectionTitle({ tag, title, highlight, subtitle }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="text-center mb-12">
      {tag && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="inline-block font-mono-hacker text-[10px] font-bold tracking-[0.15em] uppercase text-accent mb-3.5 px-3 py-1 bg-accent/5 border border-accent/35 rounded"
        >
          &gt;&gt; {tag}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="font-mono-hacker font-bold text-3xl sm:text-4xl text-text-primary leading-tight tracking-wider"
      >
        {title}{' '}
        {highlight && <span className="gradient-text-cyber">{highlight}</span>}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="font-dm text-text-secondary mt-3.5 max-w-xl mx-auto text-sm leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.24 }}
        className="h-[1px] w-24 mx-auto mt-5 bg-gradient-to-r from-transparent via-accent to-transparent"
      />
    </div>
  );
}
