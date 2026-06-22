import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ServerOff, RefreshCw, Terminal, Activity } from 'lucide-react';
import DotField from './DotField';

export default function ServerOffline({ onRetry }) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    await onRetry();
    setRetrying(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg flex flex-col items-center justify-center text-text-primary scanline-overlay">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-40">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#ef4444" // red
          gradientTo="#b91c1c"   // dark red
          glowColor="#120F17"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
          <ServerOff size={80} className="text-red-500 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text-cyber"
          style={{ backgroundImage: "linear-gradient(to right, #ef4444, #f87171)" }}
        >
          SYSTEM OFFLINE
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono-hacker text-red-400/80 text-sm md:text-base mb-8 space-y-2 border border-red-500/20 bg-red-500/5 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4 justify-center text-red-500">
            <Terminal size={16} />
            <span>CONNECTION_REFUSED</span>
          </div>
          <p>The neural link to the main server has been severed.</p>
          <p>Awaiting database initialization to retrieve dynamic components.</p>
          <p className="mt-4 text-xs opacity-50 flex items-center justify-center gap-2">
            <Activity size={12} className="animate-pulse" />
            Monitoring connection status...
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={handleRetry}
          disabled={retrying}
          className="flex items-center gap-2 px-8 py-4 bg-red-500/10 border border-red-500/40 text-red-400 font-dm font-semibold rounded-xl hover:bg-red-500/20 hover:border-red-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <RefreshCw size={18} className={retrying ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          {retrying ? "REESTABLISHING LINK..." : "RETRY CONNECTION"}
        </motion.button>
      </div>
    </div>
  );
}
