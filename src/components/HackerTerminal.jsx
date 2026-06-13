import { useState, useRef, useEffect } from "react";
import { Terminal, Shield, Cpu, RefreshCw } from "lucide-react";

export default function HackerTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { text: "DEVANAND COGNITIVE TERMINAL v2.0.8 (SECURE SHELL)", type: "header" },
    { text: "ESTABLISHING HANDSHAKE PROTOCOL WITH DEV-NODE-7...", type: "system" },
    { text: "ENCRYPTED CHANNEL SECURED. KEY LENGTH: 4096-BIT RSA", type: "system" },
    { text: "INITIALIZING UTILITIES MODULE...", type: "system" },
    { text: "STATUS: ACTIVE. TYPE 'help' FOR LIST OF COMMANDS.", type: "welcome" },
  ]);
  const [systemStats, setSystemStats] = useState({
    cpu: 18,
    ram: 44,
    status: "SECURE"
  });

  const terminalHistoryRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (terminalHistoryRef.current) {
      terminalHistoryRef.current.scrollTop = terminalHistoryRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 25) + 10,
        ram: 40 + Math.floor(Math.random() * 8),
        status: Math.random() > 0.98 ? "DIAGNOSTIC" : "SECURE"
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, { text: `guest@devanand-farkade:~$ ${cmd}`, type: "command" }];

    if (cleanCmd === "") {
      setHistory(newHistory);
      return;
    }

    let response = [];
    switch (cleanCmd) {
      case "help":
        response = [
          { text: "AVAILABLE SCHEMATICS COMMANDS:", type: "system" },
          { text: "  about       - Summarize profile & objective", type: "info" },
          { text: "  skills      - List all technical assets", type: "info" },
          { text: "  projects    - Query active development modules", type: "info" },
          { text: "  experience  - Fetch employment chronicles", type: "info" },
          { text: "  education   - Review academic certification", type: "info" },
          { text: "  contact     - Reveal transmission endpoints", type: "info" },
          { text: "  clear       - Purge local buffer", type: "info" },
          { text: "  sudo        - Request root administrative override", type: "info" }
        ];
        break;
      case "about":
        response = [
          { text: "DEVANAND FARKADE - FULL STACK DEVELOPER", type: "title" },
          { text: "Full Stack Developer skilled in React.js and Node.js, passionate about developing efficient, scalable applications and contributing to high-performing development teams.", type: "text" },
          { text: "LOCATION: Pune, Maharashtra, India", type: "text" }
        ];
        break;
      case "skills":
        response = [
          { text: "CORE TECH ASSETS MATRIX:", type: "title" },
          { text: "=========================================", type: "system" },
          { text: "  FRONTEND : React.js, JavaScript, Tailwind CSS, HTML5, CSS3", type: "text" },
          { text: "  BACKEND  : Node.js, Express.js, Java, Spring Boot, REST APIs", type: "text" },
          { text: "  DATABASE : PostgreSQL, MySQL, MongoDB", type: "text" },
          { text: "  UTILITIES: Git, GitHub, Postman, Jest, Redux Toolkit", type: "text" },
          { text: "=========================================", type: "system" },
          { text: "  SOFT SKILLS: Problem Solving, Analytical Thinking, Communication", type: "info" }
        ];
        break;
      case "projects":
        response = [
          { text: "DEPLOYED SYSTEM MODULES:", type: "title" },
          { text: "-----------------------------------------", type: "system" },
          { text: "1. BANK MANAGEMENT SYSTEM [Online]", type: "info" },
          { text: "   - Tech: Java, MySQL, GitHub", type: "text" },
          { text: "   - Desc: Banking ledger automating deposits, checks, ATM, and debit card calculations.", type: "text" },
          { text: "2. VEHICLE SERVICE CENTER [Online]", type: "info" },
          { text: "   - Tech: Java, MySQL, Spring Tool Suite 4, GitHub", type: "text" },
          { text: "   - Desc: Automated billing & invoicing system resolving labor, spare parts, and services.", type: "text" }
        ];
        break;
      case "experience":
        response = [
          { text: "EMPLOYMENT LOGS:", type: "title" },
          { text: "-----------------------------------------", type: "system" },
          { text: "1. FULL STACK DEVELOPER @ RajYug IT Solutions, Pune (Dec 2025 - PRESENT)", type: "info" },
          { text: "   - Built scalable applications using MEAN stack and Java technologies.", type: "text" },
          { text: "   - Integrated frontend, API endpoints, optimized database queries.", type: "text" },
          { text: "2. SOFTWARE DEVELOPMENT ENGINEER (SDE) @ Bluestock Fintech (Apr 2025 - May 2025)", type: "text" },
          { text: "   - Developed production IPO web app & secure REST APIs with Django and PostgreSQL.", type: "text" },
          { text: "3. JAVA DEVELOPER INTERN @ Mass Technologies (Jan 2025 - Apr 2025)", type: "text" },
          { text: "   - Programmed attendance system using Java, JSP, and MySQL with role-based logic.", type: "text" }
        ];
        break;
      case "education":
        response = [
          { text: "ACADEMIC DATABASE:", type: "title" },
          { text: "-----------------------------------------", type: "system" },
          { text: "  * MCA (Master of Computer Applications) | JSPM Narhe Technical Campus, Pune", type: "info" },
          { text: "    - Year: 2023 - 2025 | CGPA: 8.03", type: "text" },
          { text: "  * BCA (Bachelor of Computer Applications) | CMCS College Nashik", type: "info" },
          { text: "    - Year: 2019 - 2022 | CGPA: 6.67", type: "text" }
        ];
        break;
      case "contact":
        response = [
          { text: "SECURE TRANSMISSION ENDPOINTS:", type: "title" },
          { text: "  Email:    devaapatil330@gmail.com", type: "info" },
          { text: "  Phone:    +91 9518331190", type: "info" },
          { text: "  LinkedIn: linkedin.com/in/devanandfarkade", type: "info" },
          { text: "  GitHub:   github.com/Devanandfarkade", type: "info" }
        ];
        break;
      case "clear":
        setHistory([]);
        return;
      case "sudo":
        response = [
          { text: "[WARNING] ATTEMPTING BRUTE-FORCE ADMINISTRATIVE ACCESS...", type: "warn" },
          { text: "ERROR: PRIVILEGE OVERRIDE BLOCKED BY SUBROUTINE FIREWALL.", type: "error" },
          { text: "GUEST SYSTEM LOGGED AND ACTIVE INTRUSION DETECTED.", type: "error" }
        ];
        break;
      default:
        response = [
          { text: `Unknown command: '${cleanCmd}'. Type 'help' for directory of valid codes.`, type: "error" }
        ];
        break;
    }

    setHistory([...newHistory, ...response]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    }
  };

  return (
    <div 
      onClick={focusInput}
      className="w-full bg-black/95 rounded-3xl border border-accent/30 overflow-hidden font-mono-hacker text-left flex flex-col shadow-2xl shadow-green-950/20 crt-flicker relative"
      style={{ height: "450px" }}
    >
      <div className="absolute inset-0 hacker-grid opacity-20 pointer-events-none" />
      
      {/* Console Header Bar */}
      <div className="bg-surface/90 border-b border-accent/20 px-5 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-xs text-accent flex items-center gap-1.5 uppercase font-bold tracking-wider">
            <Terminal size={14} className="text-accent" />
            SECURE_SYSTEM_SHELL@DEVANAND-FARKADE
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-accent-2/60">
          <span className="flex items-center gap-1"><Cpu size={12} /> CPU: {systemStats.cpu}%</span>
          <span className="flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> RAM: {systemStats.ram}%</span>
          <span className="flex items-center gap-1 text-accent"><Shield size={12} /> {systemStats.status}</span>
        </div>
      </div>

      {/* Terminal History Container */}
      <div ref={terminalHistoryRef} className="flex-1 p-6 overflow-y-auto space-y-2 z-10 cyber-scrollbar">
        {history.map((line, idx) => {
          let style = "text-text-primary";
          if (line.type === "header") style = "text-accent font-bold text-sm tracking-wider";
          else if (line.type === "system") style = "text-accent-2/60 text-xs";
          else if (line.type === "welcome") style = "text-accent/80 text-xs";
          else if (line.type === "command") style = "text-white font-semibold";
          else if (line.type === "title") style = "text-accent font-bold border-b border-accent/20 pb-0.5 mt-2";
          else if (line.type === "info") style = "text-accent-2";
          else if (line.type === "warn") style = "text-yellow-400 font-semibold";
          else if (line.type === "error") style = "text-red-500 font-semibold";
          else if (line.type === "text") style = "text-text-secondary pl-4";

          return (
            <div key={idx} className={`${style} leading-relaxed break-words whitespace-pre-wrap`}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Console Input Row */}
      <div className="border-t border-accent/20 bg-surface/40 p-4 flex items-center gap-2 z-10">
        <span className="text-accent font-semibold">guest@devanand-farkade:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          className="flex-1 bg-transparent text-white focus:outline-none border-none outline-none font-semibold shadow-none"
        />
        <span className="terminal-cursor" />
      </div>
    </div>
  );
}
