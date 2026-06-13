import { motion } from "framer-motion";

export default function CyberSkeleton({ title = "SECURE MEMORY BUFFER" }) {
  return (
    <div className="w-full h-full min-h-[380px] bg-surface/40 flex flex-col justify-between p-6 font-mono-hacker border border-accent/20 rounded-3xl relative overflow-hidden crt-flicker">
      <div className="absolute inset-0 hacker-grid opacity-30 pointer-events-none" />
      <div className="laser-line" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-accent-2/20 pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-accent uppercase tracking-wider">{title}</span>
        </div>
        <span className="text-[10px] text-accent-2/50">SECURE SHELL v1.0.4</span>
      </div>

      {/* Terminal logs */}
      <div className="my-auto space-y-2 z-10 text-left">
        <div className="text-[11px] text-accent/70 flex items-center gap-2">
          <span className="text-accent/30">&gt;</span> SYS_INIT: CONNECTING TO SUBSYSTEM CORE...
        </div>
        <div className="text-[11px] text-accent/70 flex items-center gap-2">
          <span className="text-accent/30">&gt;</span> COMPILING GLSL VIRTUAL CANVAS INTERFACE...
        </div>
        <div className="text-[11px] text-accent-2/70 flex items-center gap-2">
          <span className="text-accent-2/30">&gt;</span> PARSING GRAPHICS DATA STREAMS: LOADED
        </div>
        <div className="text-[11px] text-accent/90 flex items-center gap-2 font-bold">
          <span className="text-accent/40">&gt;</span> BUFFERING 3D RENDERING DATA...
          <motion.span 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-1.5 h-3.5 bg-accent inline-block"
          />
        </div>
      </div>

      {/* Footer statistics */}
      <div className="flex justify-between items-center border-t border-accent-2/20 pt-3 z-10 text-[10px] text-accent-2/40">
        <span>MEM_ALLOC: 24.8 MB</span>
        <span className="animate-pulse text-accent">SECURE LOAD STATUS: OK</span>
        <span>SYS_LVL_0</span>
      </div>
    </div>
  );
}
