import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function useScrollIndicator(ref) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkScroll = () => {
      // Allow a tiny margin of 6px for rounding issues
      const isScrollable = el.scrollHeight > el.clientHeight + 6;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 12;
      setShowIndicator(isScrollable && !isAtBottom);
    };

    // Initial check
    checkScroll();

    // Listeners
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    // Mutation observer to watch content updates inside the container
    const observer = new MutationObserver(checkScroll);
    observer.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      observer.disconnect();
    };
  }, [ref]);

  return showIndicator;
}

export function ScrollIndicator({ visible, className = "bottom-20" }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/40 bg-[#070c19]/90 text-[10px] font-mono-hacker text-accent shadow-lg shadow-black/50 backdrop-blur-md ${className}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="uppercase tracking-widest text-[9px] font-bold">SCROLL INSIDE FOR MORE DETAILS</span>
          
          <div className="flex flex-col items-center justify-center w-3 h-5 border border-accent/40 rounded-full relative overflow-hidden ml-1">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-1.5 bg-accent rounded-full absolute top-1"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
