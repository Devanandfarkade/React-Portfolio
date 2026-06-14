import { useState, useRef, useEffect } from "react";
import { Terminal, Shield, Cpu, RefreshCw } from "lucide-react";
import { api } from "../services/api";

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

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getProfile().catch(() => null),
      api.getSkills().catch(() => null),
      api.getProjects().catch(() => null),
      api.getExperience().catch(() => null),
      api.getEducation().catch(() => null)
    ]).then(([profileData, skillsData, projectsData, expData, eduData]) => {
      if (profileData) setProfile(profileData);
      if (skillsData) setSkills(skillsData.skills || []);
      if (projectsData) setProjects(projectsData);
      if (expData) setExperiences(expData);
      if (eduData) setEducation(eduData);
    });
  }, []);

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
      case "about": {
        const name = profile?.name || "DEVANAND FARKADE";
        const status = profile?.status || "FULL STACK DEVELOPER";
        const aboutText = profile?.about_text || "Full Stack Developer skilled in React.js and Node.js, passionate about developing efficient, scalable applications and contributing to high-performing development teams.";
        const location = profile?.location || "Pune, Maharashtra, India";
        response = [
          { text: `${name.toUpperCase()} - ${status.toUpperCase()}`, type: "title" },
          { text: aboutText, type: "text" },
          { text: `LOCATION: ${location}`, type: "text" }
        ];
        break;
      }
      case "skills": {
        const frontendSkills = skills.filter(s => (s.category || s.cat) === "FRONTEND").map(s => s.name).join(", ") || "React.js, JavaScript, Tailwind CSS, HTML5, CSS3";
        const backendSkills = skills.filter(s => (s.category || s.cat) === "BACKEND").map(s => s.name).join(", ") || "Node.js, Express.js, Java, Spring Boot, REST APIs";
        const databaseSkills = skills.filter(s => (s.category || s.cat) === "DATABASE" || s.name.toLowerCase().includes("postgres") || s.name.toLowerCase().includes("sql") || s.name.toLowerCase().includes("mongo")).map(s => s.name).join(", ") || "PostgreSQL, MySQL, MongoDB";
        const toolsSkills = skills.filter(s => (s.category || s.cat) === "TOOLS").map(s => s.name).join(", ") || "Git, GitHub, REST APIs";
        
        response = [
          { text: "CORE TECH ASSETS MATRIX:", type: "title" },
          { text: "=========================================", type: "system" },
          { text: `  FRONTEND : ${frontendSkills}`, type: "text" },
          { text: `  BACKEND  : ${backendSkills}`, type: "text" },
          { text: `  DATABASE : ${databaseSkills}`, type: "text" },
          { text: `  UTILITIES: ${toolsSkills}`, type: "text" },
          { text: "=========================================", type: "system" },
          { text: "  SOFT SKILLS: Problem Solving, Analytical Thinking, Communication", type: "info" }
        ];
        break;
      }
      case "projects": {
        const list = projects.length > 0 ? projects : [
          { title: "BANK MANAGEMENT SYSTEM", tags: ["Java", "MySQL"], description: "Banking ledger automating deposits, checks, ATM, and debit card calculations.", status: "STABLE" },
          { title: "VEHICLE SERVICE CENTER", tags: ["Java", "MySQL", "Spring Tool Suite 4"], description: "Automated billing & invoicing system resolving labor, spare parts, and services.", status: "STABLE" }
        ];
        response = [
          { text: "DEPLOYED SYSTEM MODULES:", type: "title" },
          { text: "-----------------------------------------", type: "system" }
        ];
        list.forEach((p, i) => {
          response.push({ text: `${i + 1}. ${p.title.toUpperCase()} [${p.status || "STABLE"}]`, type: "info" });
          response.push({ text: `   - Tech: ${(p.tags || []).join(", ")}`, type: "text" });
          response.push({ text: `   - Desc: ${p.description || p.desc}`, type: "text" });
        });
        break;
      }
      case "experience": {
        const list = experiences.length > 0 ? experiences : [
          { role: "Full Stack Developer", company: "RajYug IT Solutions", period: "Dec 2025 - PRESENT", description: "Built scalable applications using MEAN stack and Java technologies." },
          { role: "Software Development Engineer (SDE)", company: "Bluestock Fintech", period: "Apr 2025 - May 2025", description: "Developed production IPO web app & secure REST APIs with Django and PostgreSQL." },
          { role: "Java Developer Intern", company: "Mass Technologies", period: "Jan 2025 - Apr 2025", description: "Programmed attendance system using Java, JSP, and MySQL with role-based logic." }
        ];
        response = [
          { text: "EMPLOYMENT LOGS:", type: "title" },
          { text: "-----------------------------------------", type: "system" }
        ];
        list.forEach((exp, i) => {
          response.push({ text: `${i + 1}. ${exp.role.toUpperCase()} @ ${exp.company}, ${exp.location || ""} (${exp.period})`, type: "info" });
          response.push({ text: `   - ${exp.description || exp.desc}`, type: "text" });
        });
        break;
      }
      case "education": {
        const list = education.length > 0 ? education : [
          { degree: "Master of Computer Applications (MCA)", institution: "JSPM Narhe Technical Campus, Pune", period: "2023 - 2025", grade: "8.03 CGPA" },
          { degree: "Bachelor of Computer Applications (BCA)", institution: "CMCS College Nashik", period: "2019 - 2022", grade: "6.67 CGPA" }
        ];
        response = [
          { text: "ACADEMIC DATABASE:", type: "title" },
          { text: "-----------------------------------------", type: "system" }
        ];
        list.forEach((edu) => {
          response.push({ text: `  * ${edu.degree} | ${edu.institution}`, type: "info" });
          response.push({ text: `    - Year: ${edu.period} | Grade: ${edu.grade}`, type: "text" });
        });
        break;
      }
      case "contact": {
        const email = profile?.email || "devaapatil330@gmail.com";
        const phone = profile?.phone || "+91 9518331190";
        const github = profile?.github_url || "github.com/Devanandfarkade";
        const linkedin = profile?.linkedin_url || "linkedin.com/in/devanandfarkade";
        response = [
          { text: "SECURE TRANSMISSION ENDPOINTS:", type: "title" },
          { text: `  Email:    ${email}`, type: "info" },
          { text: `  Phone:    ${phone}`, type: "info" },
          { text: `  LinkedIn: ${linkedin}`, type: "info" },
          { text: `  GitHub:   ${github}`, type: "info" }
        ];
        break;
      }
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
