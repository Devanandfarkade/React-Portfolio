import { useState, useEffect } from "react";
import { Shield, Key, AlertTriangle, Terminal, ArrowLeft } from "lucide-react";
import DecryptedText from "./DecryptedText";
import { api } from "../services/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [terminalLogs, setTerminalLogs] = useState([
    "INITIALIZING LOGIN INTERFACE...",
    "ESTABLISHING SECURE RSA HANDSHAKE...",
  ]);

  useEffect(() => {
    // Hide custom cursor and restore standard cursor inside admin views
    document.body.classList.add("admin-route");
    return () => {
      document.body.classList.remove("admin-route");
    };
  }, []);

  const addLog = (msg) => {
    setTerminalLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Credentials required.");
      addLog("ERROR: USERNAME/PASSWORD PARAMETERS EMPTY.");
      return;
    }

    setLoading(true);
    setError("");
    addLog(`ATTEMPTING ACCESS AUTHENTICATION FOR: ${username.toUpperCase()}...`);

    try {
      const data = await api.login(username, password);

      addLog("HANDSHAKE AUTHORIZED. TOKEN GRANTED.");
      addLog("REDIRECTING TO SECURE ADMIN CONSOLE...");

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      setTimeout(() => {
        window.location.hash = "#admin-dashboard";
      }, 1000);
    } catch (err) {
      setError(err.message);
      addLog(`ACCESS DENIED: ${err.message.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-text-primary flex flex-col justify-center items-center px-4 py-12 hacker-grid relative select-text">
      {/* Laser scan effect */}
      <div className="laser-line" />

      {/* Back to Home Button */}
      <a
        href="#"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono-hacker text-accent-2/65 hover:text-accent hover:border-accent border border-accent-2/20 px-3.5 py-2 rounded-lg bg-surface/80 transition-all z-20"
      >
        <ArrowLeft size={12} /> RETURN TO HOST
      </a>

      {/* Cyber Panel */}
      <div className="w-full max-w-md bg-surface/90 border border-accent/35 rounded-3xl p-6 md:p-8 shadow-2xl shadow-green-950/20 crt-flicker relative z-10">
        <div className="absolute inset-0 hacker-grid opacity-10 pointer-events-none rounded-3xl" />
        
        {/* Top Glitch Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-3">
            <Shield size={24} className="text-accent animate-pulse" />
          </div>
          <h2 className="text-2xl font-mono-hacker font-bold tracking-widest text-accent uppercase">
            ADMIN_PORTAL
          </h2>
          <div className="text-[10px] font-mono-hacker text-accent-2/60 mt-1">
            DEVANAND SECURITY SYSTEM MODULE v2.0
          </div>
        </div>

        {/* Console logs */}
        <div className="bg-black/80 rounded-xl border border-accent-2/20 p-3 mb-6 h-28 overflow-y-auto font-mono-hacker text-[10px] leading-relaxed text-accent-2/85 space-y-1.5 cyber-scrollbar">
          {terminalLogs.map((log, i) => (
            <div key={i} className="break-words">
              {log.startsWith("[") ? log : `> ${log}`}
            </div>
          ))}
          {loading && <div className="text-accent animate-pulse"> WAITING FOR CRYPTO SIGNATURE...</div>}
        </div>

        {/* Error HUD */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-950/20 border border-red-500/35 rounded-xl p-3 mb-6 text-xs font-mono-hacker text-red-400">
            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">INTRUSION WARNING:</span> {error}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 font-mono-hacker">
          <div>
            <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
              Operator Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="root"
                required
                className="w-full bg-black/50 border border-accent-2/25 focus:border-accent text-white placeholder-text-secondary/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors outline-none focus:ring-1 focus:ring-accent"
              />
              <Terminal size={14} className="absolute left-3.5 top-3.5 text-accent-2/60" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
              Access Passphrase
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-black/50 border border-accent-2/25 focus:border-accent text-white placeholder-text-secondary/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors outline-none focus:ring-1 focus:ring-accent"
              />
              <Key size={14} className="absolute left-3.5 top-3.5 text-accent-2/60" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-hacker py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold mt-4 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "PROCESSING..." : "SIGN HANDSHAKE"}
          </button>
        </form>
      </div>

      {/* Cyber Footer */}
      <div className="absolute bottom-6 text-[10px] font-mono-hacker text-muted tracking-widest">
        &copy; {new Date().getFullYear()} DEVANAND CORESYSTEMS. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}
