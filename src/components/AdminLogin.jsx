import { useState, useEffect } from "react";
import { Shield, Key, AlertTriangle, Terminal, ArrowLeft, Mail, RefreshCw } from "lucide-react";
import DecryptedText from "./DecryptedText";
import { api } from "../services/api";

export default function AdminLogin() {
  const [view, setView] = useState("LOGIN"); // "LOGIN", "FORGOT", "REGISTER"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError("All registration parameters required.");
      addLog("ERROR: OPERATOR REGISTRATION INCOMPLETE.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      addLog("ERROR: PASSPHRASE MISMATCH FAILURE.");
      return;
    }

    setLoading(true);
    setError("");
    addLog(`INITIALIZING REGISTRATION PROTOCOL FOR: ${username.toUpperCase()}...`);

    try {
      await api.register(username, email, password);
      addLog("REGISTRATION SIGNATURE GRANTED.");
      addLog("OPERATOR LOGGED IN DATABASE CONFIG.");
      
      // Reset state
      setPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        setView("LOGIN");
        addLog("SWITCHING VIEW TO LOGIN PORTAL...");
      }, 1500);
    } catch (err) {
      setError(err.message);
      addLog(`REGISTRATION DENIED: ${err.message.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!username || !email || !newPassword || !confirmPassword) {
      setError("Verification parameters required.");
      addLog("ERROR: PASSWORD RESET BLOCKED.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      addLog("ERROR: PASSPHRASE MISMATCH FAILURE.");
      return;
    }

    setLoading(true);
    setError("");
    addLog(`INITIATING PASSWORD RESET FOR OPERATOR: ${username.toUpperCase()}...`);

    try {
      await api.forgotPassword(username, email, newPassword);
      addLog("VERIFICATION PROTOCOL MATCHED.");
      addLog("PASSPHRASE UPDATED IN ENCRYPTED CORESYSTEM.");
      
      // Reset state
      setNewPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        setView("LOGIN");
        addLog("SWITCHING VIEW TO LOGIN PORTAL...");
      }, 1500);
    } catch (err) {
      setError(err.message);
      addLog(`PASSPHRASE RESET BLOCKED: ${err.message.toUpperCase()}`);
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
            {view === "LOGIN" && "ADMIN_PORTAL"}
            {view === "REGISTER" && "NEW_OPERATOR"}
            {view === "FORGOT" && "RESET_PASS"}
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

        {/* Dynamic Forms */}
        
        {view === "LOGIN" && (
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
        )}

        {view === "REGISTER" && (
          <form onSubmit={handleRegister} className="space-y-4 font-mono-hacker">
            <div>
              <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
                Operator Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-black/50 border border-accent-2/25 focus:border-accent text-white placeholder-text-secondary/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors outline-none focus:ring-1 focus:ring-accent"
                />
                <Terminal size={14} className="absolute left-3.5 top-3.5 text-accent-2/60" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
                Operator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@deva.core"
                  required
                  className="w-full bg-black/50 border border-accent-2/25 focus:border-accent text-white placeholder-text-secondary/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors outline-none focus:ring-1 focus:ring-accent"
                />
                <Mail size={14} className="absolute left-3.5 top-3.5 text-accent-2/60" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
                Passphrase
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

            <div>
              <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
                Confirm Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "CREATING OPERATOR..." : "REGISTER OPERATOR"}
            </button>
          </form>
        )}

        {view === "FORGOT" && (
          <form onSubmit={handleForgotPassword} className="space-y-4 font-mono-hacker">
            <div>
              <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
                Operator Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-black/50 border border-accent-2/25 focus:border-accent text-white placeholder-text-secondary/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors outline-none focus:ring-1 focus:ring-accent"
                />
                <Terminal size={14} className="absolute left-3.5 top-3.5 text-accent-2/60" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
                Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@deva.core"
                  required
                  className="w-full bg-black/50 border border-accent-2/25 focus:border-accent text-white placeholder-text-secondary/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors outline-none focus:ring-1 focus:ring-accent"
                />
                <Mail size={14} className="absolute left-3.5 top-3.5 text-accent-2/60" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
                New Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-black/50 border border-accent-2/25 focus:border-accent text-white placeholder-text-secondary/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors outline-none focus:ring-1 focus:ring-accent"
                />
                <Key size={14} className="absolute left-3.5 top-3.5 text-accent-2/60" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-text-secondary tracking-widest mb-1.5 font-bold">
                Confirm New Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "VERIFYING CREDENTIALS..." : "RESET PASSPHRASE"}
            </button>
          </form>
        )}

        {/* Form sublinks */}
        <div className="mt-6 flex justify-between items-center text-[10px] font-mono-hacker border-t border-accent-2/15 pt-4">
          {view === "LOGIN" ? (
            <>
              <button
                type="button"
                onClick={() => { setView("FORGOT"); setError(""); }}
                className="text-accent-2/60 hover:text-accent transition-colors"
              >
                [ FORGOT_PASS ]
              </button>
              <button
                type="button"
                onClick={() => { setView("REGISTER"); setError(""); }}
                className="text-accent-2/60 hover:text-accent transition-colors"
              >
                [ REGISTER_OPERATOR ]
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => { setView("LOGIN"); setError(""); }}
              className="text-accent hover:text-accent-2 transition-colors mx-auto"
            >
              &lt; RETURN TO LOGIN PORTAL
            </button>
          )}
        </div>
      </div>

      {/* Cyber Footer */}
      <div className="absolute bottom-6 text-[10px] font-mono-hacker text-muted tracking-widest">
        &copy; {new Date().getFullYear()} DEVANAND CORESYSTEMS. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}
