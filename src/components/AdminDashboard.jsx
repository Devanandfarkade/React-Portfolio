import { useState, useEffect } from "react";
import { 
  Shield, 
  Terminal, 
  User, 
  Layers, 
  FolderGit2, 
  Calendar, 
  Award, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  LogOut, 
  RefreshCw, 
  Upload, 
  CheckCircle, 
  XCircle,
  FileText,
  Briefcase,
  GraduationCap
} from "lucide-react";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("DASHBOARD");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Datasets
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState({});
  const [roles, setRoles] = useState([]);
  const [heroStats, setHeroStats] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certs, setCerts] = useState([]);
  const [messages, setMessages] = useState([]);

  // Active form structures
  const [roleForm, setRoleForm] = useState({ id: null, roleName: "", displayOrder: 0 });
  const [statForm, setStatForm] = useState({ id: null, value: "", label: "", displayOrder: 0 });
  const [skillForm, setSkillForm] = useState({ id: null, name: "", iconName: "", level: 80, colorHex: "#39ff14", category: "FRONTEND", displayOrder: 0 });
  const [highlightForm, setHighlightForm] = useState({ id: null, iconName: "", label: "", description: "", delayOffset: 0.1, displayOrder: 0 });
  const [projectForm, setProjectForm] = useState({ id: null, title: "", description: "", category: "JAVA", repo_url: "", live_url: "", status: "STABLE", color_hex: "#00e5ff", tagsStr: "" });
  const [expForm, setExpForm] = useState({ id: null, role: "", company: "", location: "", period: "", type: "Full-Time", description: "", pointsStr: "", techStr: "", color_hex: "#39ff14", display_order: 0 });
  const [eduForm, setEduForm] = useState({ id: null, degree: "", institution: "", location: "", period: "", grade: "", highlightsStr: "", color_hex: "#00e5ff", display_order: 0 });
  const [certForm, setCertForm] = useState({ id: null, title: "", issuer: "", date: "", credential_id: "", link: "", skillsStr: "", icon_emoji: "🎓", color_hex: "#39ff14", display_order: 0 });

  // Resume file state
  const [resumeFile, setResumeFile] = useState(null);
  const [operatorForm, setOperatorForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  // Validate authentication
  useEffect(() => {
    // Hide custom cursor and restore standard cursor inside admin views
    document.body.classList.add("admin-route");

    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      window.location.hash = "#admin-login";
      return;
    }
    setToken(savedToken);
    
    const savedUser = localStorage.getItem("admin_user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setOperatorForm({ username: user.username || "", email: user.email || "", password: "", confirmPassword: "" });
    }

    // Fetch initial datasets
    fetchData(savedToken);

    return () => {
      document.body.classList.remove("admin-route");
    };
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showErr = (err) => {
    setError(err);
    setTimeout(() => setError(""), 6000);
  };

  const fetchWithAuth = async (endpoint, options = {}, customToken) => {
    const actToken = customToken || token;
    const headers = {
      "Authorization": `Bearer ${actToken}`,
      ...options.headers
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const data = await res.json();
      if (res.status === 401 || res.status === 433) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        window.location.hash = "#admin-login";
        throw new Error(data.error || "Session expired. Please authenticate again.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Request failed.");
      }

      return data;
    } catch (err) {
      console.error(`Fetch error on ${endpoint}:`, err);
      throw err;
    }
  };

  const fetchData = async (savedToken) => {
    setLoading(true);
    try {
      // Stats
      const statData = await fetchWithAuth("/admin/stats", {}, savedToken);
      setStats(statData);

      // Profile payload (includes roles & stats)
      const profData = await fetchWithAuth("/profile", {}, savedToken);
      setProfile(profData.settings || {});
      setRoles(profData.roles || []);
      setHeroStats(profData.stats || []);

      // Skills payload (includes skills & highlights)
      const skillData = await fetchWithAuth("/skills", {}, savedToken);
      setSkills(skillData.skills || []);
      setHighlights(skillData.highlights || []);

      // Projects
      const projData = await fetchWithAuth("/projects", {}, savedToken);
      setProjects(projData || []);

      // Experiences
      const expData = await fetchWithAuth("/experience", {}, savedToken);
      setExperiences(expData || []);

      // Education
      const eduData = await fetchWithAuth("/education", {}, savedToken);
      setEducation(eduData || []);

      // Certifications
      const certData = await fetchWithAuth("/certs", {}, savedToken);
      setCerts(certData || []);

      // Messages
      const msgData = await fetchWithAuth("/messages", {}, savedToken);
      setMessages(msgData || []);

    } catch (err) {
      showErr("Data loading anomaly: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.hash = "#admin-login";
  };

  // Profile Form Submissions
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const result = await fetchWithAuth("/profile", {
        method: "PUT",
        body: JSON.stringify(profile)
      });
      showSuccess("Global Profile Settings updated successfully.");
      setProfile(result.profile);
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setActionLoading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await fetchWithAuth("/profile/resume", {
        method: "POST",
        body: formData
      });
      showSuccess("Resume PDF updated in core profile settings.");
      setProfile(result.profile);
      setResumeFile(null);
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Hero Roles CRUD
  const submitRole = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (roleForm.id) {
        // Edit
        const data = await fetchWithAuth(`/profile/roles/${roleForm.id}`, {
          method: "PUT",
          body: JSON.stringify(roleForm)
        });
        setRoles(roles.map(r => r.id === roleForm.id ? data.role : r));
        showSuccess("Hero Role updated.");
      } else {
        // Add
        const data = await fetchWithAuth("/profile/roles", {
          method: "POST",
          body: JSON.stringify(roleForm)
        });
        setRoles([...roles, data.role]);
        showSuccess("Hero Role added.");
      }
      setRoleForm({ id: null, roleName: "", displayOrder: 0 });
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteRole = async (id) => {
    if (!confirm("Are you sure you want to delete this Hero typing role?")) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/profile/roles/${id}`, { method: "DELETE" });
      setRoles(roles.filter(r => r.id !== id));
      showSuccess("Hero Role purged.");
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Hero Stats CRUD
  const submitHeroStat = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (statForm.id) {
        const data = await fetchWithAuth(`/profile/stats/${statForm.id}`, {
          method: "PUT",
          body: JSON.stringify(statForm)
        });
        setHeroStats(heroStats.map(s => s.id === statForm.id ? data.stat : s));
        showSuccess("Hero Stat entry updated.");
      } else {
        const data = await fetchWithAuth("/profile/stats", {
          method: "POST",
          body: JSON.stringify(statForm)
        });
        setHeroStats([...heroStats, data.stat]);
        showSuccess("Hero Stat entry created.");
      }
      setStatForm({ id: null, value: "", label: "", displayOrder: 0 });
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteHeroStat = async (id) => {
    if (!confirm("Purge this Hero statistic?")) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/profile/stats/${id}`, { method: "DELETE" });
      setHeroStats(heroStats.filter(s => s.id !== id));
      showSuccess("Hero Stat entry purged.");
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // About Highlights CRUD
  const submitHighlight = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (highlightForm.id) {
        const data = await fetchWithAuth(`/skills/highlights/${highlightForm.id}`, {
          method: "PUT",
          body: JSON.stringify(highlightForm)
        });
        setHighlights(highlights.map(h => h.id === highlightForm.id ? data.highlight : h));
        showSuccess("Highlight updated.");
      } else {
        const data = await fetchWithAuth("/skills/highlights", {
          method: "POST",
          body: JSON.stringify(highlightForm)
        });
        setHighlights([...highlights, data.highlight]);
        showSuccess("Highlight created.");
      }
      setHighlightForm({ id: null, iconName: "", label: "", description: "", delayOffset: 0.1, displayOrder: 0 });
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteHighlight = async (id) => {
    if (!confirm("Delete this about highlights entry?")) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/skills/highlights/${id}`, { method: "DELETE" });
      setHighlights(highlights.filter(h => h.id !== id));
      showSuccess("Highlight entry deleted.");
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Skills CRUD
  const submitSkill = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (skillForm.id) {
        const data = await fetchWithAuth(`/skills/${skillForm.id}`, {
          method: "PUT",
          body: JSON.stringify(skillForm)
        });
        setSkills(skills.map(s => s.id === skillForm.id ? data.skill : s));
        showSuccess("Skill updated.");
      } else {
        const data = await fetchWithAuth("/skills", {
          method: "POST",
          body: JSON.stringify(skillForm)
        });
        setSkills([...skills, data.skill]);
        showSuccess("Skill added.");
      }
      setSkillForm({ id: null, name: "", iconName: "", level: 80, colorHex: "#39ff14", category: "FRONTEND", displayOrder: 0 });
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm("Delete this technology skill item?")) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/skills/${id}`, { method: "DELETE" });
      setSkills(skills.filter(s => s.id !== id));
      showSuccess("Skill purged.");
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Projects CRUD
  const submitProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    // Parse tags array
    const tags = projectForm.tagsStr.split(",").map(t => t.trim()).filter(Boolean);
    const body = { ...projectForm, tags };
    delete body.tagsStr;

    try {
      if (projectForm.id) {
        const data = await fetchWithAuth(`/projects/${projectForm.id}`, {
          method: "PUT",
          body: JSON.stringify(body)
        });
        setProjects(projects.map(p => p.id === projectForm.id ? data.project : p));
        showSuccess("Project timeline updated.");
      } else {
        const data = await fetchWithAuth("/projects", {
          method: "POST",
          body: JSON.stringify(body)
        });
        setProjects([...projects, data.project]);
        showSuccess("Project module launched.");
      }
      setProjectForm({ id: null, title: "", description: "", category: "JAVA", repo_url: "", live_url: "", status: "STABLE", color_hex: "#00e5ff", tagsStr: "" });
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project from active ledger?")) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/projects/${id}`, { method: "DELETE" });
      setProjects(projects.filter(p => p.id !== id));
      showSuccess("Project purged.");
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Experience CRUD
  const submitExperience = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const points = expForm.pointsStr.split("\n").map(p => p.trim()).filter(Boolean);
    const tech = expForm.techStr.split(",").map(t => t.trim()).filter(Boolean);
    const body = { ...expForm, points, tech };
    delete body.pointsStr;
    delete body.techStr;

    try {
      if (expForm.id) {
        const data = await fetchWithAuth(`/experience/${expForm.id}`, {
          method: "PUT",
          body: JSON.stringify(body)
        });
        setExperiences(experiences.map(ex => ex.id === expForm.id ? data.experience : ex));
        showSuccess("Experience updated.");
      } else {
        const data = await fetchWithAuth("/experience", {
          method: "POST",
          body: JSON.stringify(body)
        });
        setExperiences([...experiences, data.experience]);
        showSuccess("Experience timeline entry logged.");
      }
      setExpForm({ id: null, role: "", company: "", location: "", period: "", type: "Full-Time", description: "", pointsStr: "", techStr: "", color_hex: "#39ff14", display_order: 0 });
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    if (!confirm("Delete this employment experience entry?")) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/experience/${id}`, { method: "DELETE" });
      setExperiences(experiences.filter(ex => ex.id !== id));
      showSuccess("Experience entry purged.");
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Education CRUD
  const submitEducation = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const highlightsList = eduForm.highlightsStr.split("\n").map(h => h.trim()).filter(Boolean);
    const body = { ...eduForm, highlights: highlightsList };
    delete body.highlightsStr;

    try {
      if (eduForm.id) {
        const data = await fetchWithAuth(`/education/${eduForm.id}`, {
          method: "PUT",
          body: JSON.stringify(body)
        });
        setEducation(education.map(ed => ed.id === eduForm.id ? data.education : ed));
        showSuccess("Education entry updated.");
      } else {
        const data = await fetchWithAuth("/education", {
          method: "POST",
          body: JSON.stringify(body)
        });
        setEducation([...education, data.education]);
        showSuccess("Education entry registered.");
      }
      setEduForm({ id: null, degree: "", institution: "", location: "", period: "", grade: "", highlightsStr: "", color_hex: "#00e5ff", display_order: 0 });
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteEducation = async (id) => {
    if (!confirm("Purge this academic education entry?")) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/education/${id}`, { method: "DELETE" });
      setEducation(education.filter(ed => ed.id !== id));
      showSuccess("Education entry purged.");
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Certifications CRUD
  const submitCert = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const skillsList = certForm.skillsStr.split(",").map(s => s.trim()).filter(Boolean);
    const body = { ...certForm, skills: skillsList };
    delete body.skillsStr;

    try {
      if (certForm.id) {
        const data = await fetchWithAuth(`/certs/${certForm.id}`, {
          method: "PUT",
          body: JSON.stringify(body)
        });
        setCerts(certs.map(c => c.id === certForm.id ? data.certification : c));
        showSuccess("Certification entry updated.");
      } else {
        const data = await fetchWithAuth("/certs", {
          method: "POST",
          body: JSON.stringify(body)
        });
        setCerts([...certs, data.certification]);
        showSuccess("Certification credentials logged.");
      }
      setCertForm({ id: null, title: "", issuer: "", date: "", credential_id: "", link: "", skillsStr: "", icon_emoji: "🎓", color_hex: "#39ff14", display_order: 0 });
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCert = async (id) => {
    if (!confirm("Remove this certification credentials entry?")) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/certs/${id}`, { method: "DELETE" });
      setCerts(certs.filter(c => c.id !== id));
      showSuccess("Certification entry removed.");
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Message Inbox Actions
  const toggleMessageRead = async (id, isRead) => {
    setActionLoading(true);
    try {
      const result = await fetchWithAuth(`/messages/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isRead: !isRead })
      });
      setMessages(messages.map(m => m.id === id ? result.contact : m));
      
      // Update counters
      const statData = await fetchWithAuth("/admin/stats");
      setStats(statData);
      showSuccess(`Transmission status marked as ${!isRead ? "READ" : "UNREAD"}.`);
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Purge this contact transmission entry? This action cannot be undone.")) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/messages/${id}`, { method: "DELETE" });
      setMessages(messages.filter(m => m.id !== id));
      
      const statData = await fetchWithAuth("/admin/stats");
      setStats(statData);
      showSuccess("Message transmission record deleted.");
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const triggerDashboardRefresh = () => {
    fetchData(token);
    showSuccess("All dashboard caches and metrics synchronized.");
  };

  const handleOperatorUpdate = async (e) => {
    e.preventDefault();
    if (operatorForm.password && operatorForm.password !== operatorForm.confirmPassword) {
      showErr("Operator passphrases do not match!");
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        username: operatorForm.username,
        email: operatorForm.email
      };
      if (operatorForm.password) {
        payload.password = operatorForm.password;
      }

      const result = await api.updateAccount(payload, token);
      showSuccess("Operator security profile updated successfully.");

      // update local storage
      localStorage.setItem("admin_user", JSON.stringify(result.user));
      setOperatorForm({ ...operatorForm, password: "", confirmPassword: "" });
    } catch (err) {
      showErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex select-text font-mono-hacker">
      {/* Side HUD Panel */}
      <aside className="w-64 bg-surface border-r border-accent/25 flex flex-col justify-between p-4 z-20">
        <div>
          <div className="flex items-center gap-2 mb-8 border-b border-accent-2/15 pb-4">
            <Shield size={20} className="text-accent animate-pulse" />
            <div>
              <h1 className="text-sm font-bold tracking-widest text-accent uppercase">ADMIN_HUD</h1>
              <span className="text-[9px] text-accent-2/60">NODE: ACTIVE_SYS</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: "DASHBOARD", label: "00_OVERVIEW", icon: Terminal },
              { id: "PROFILE", label: "01_IDENTITY", icon: User },
              { id: "SKILLS", label: "02_ASSETS_MATRIX", icon: Layers },
              { id: "PROJECTS", label: "03_PROJECT_LEDGER", icon: FolderGit2 },
              { id: "TIMELINES", label: "04_EXPERIENCE", icon: Calendar },
              { id: "CERTS", label: "05_CREDENTIALS", icon: Award },
              { id: "INBOX", label: `06_INBOX (${stats?.unread_messages || 0})`, icon: Mail, highlight: (stats?.unread_messages || 0) > 0 },
              { id: "SECURITY", label: "07_OPERATOR_CONFIG", icon: Shield },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setError(""); setSuccessMsg(""); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-xs tracking-wider transition-all border ${
                  activeTab === t.id 
                    ? "bg-accent/10 border-accent/50 text-accent font-bold shadow shadow-accent/10" 
                    : t.highlight
                      ? "border-accent-3/40 text-accent-3 hover:bg-accent-3/5 hover:border-accent-3"
                      : "bg-transparent border-transparent text-text-secondary hover:bg-surface-2/40 hover:text-text-primary"
                }`}
              >
                <t.icon size={14} className={activeTab === t.id ? "text-accent" : t.highlight ? "text-accent-3 animate-pulse" : "text-text-secondary"} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-accent-2/15 pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-red-950/20 border border-red-500/35 hover:bg-red-500 hover:text-black font-bold text-xs uppercase tracking-wider transition-all"
          >
            <LogOut size={13} /> TERMINATE_CONN
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-h-screen bg-bg relative overflow-y-auto">
        <div className="absolute inset-0 hacker-grid opacity-5 pointer-events-none" />

        {/* Global Notifications HUD */}
        {(successMsg || error) && (
          <div className="fixed top-6 right-6 z-50 max-w-sm space-y-2">
            {successMsg && (
              <div className="flex items-center gap-2.5 bg-black border border-accent rounded-xl px-4 py-3 text-xs text-accent shadow-lg shadow-green-500/10">
                <CheckCircle size={15} />
                <span>{successMsg}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2.5 bg-black border border-accent-3 rounded-xl px-4 py-3 text-xs text-accent-3 shadow-lg shadow-red-500/10">
                <XCircle size={15} />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Top Control Bar */}
        <header className="border-b border-accent-2/15 px-8 py-5 flex items-center justify-between bg-surface/40 backdrop-blur-md z-15">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold tracking-widest text-text-primary uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              SYSTEM_TAB: {activeTab}
            </h2>
            {loading && <RefreshCw size={14} className="text-accent animate-spin" />}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={triggerDashboardRefresh}
              className="p-2 bg-surface hover:bg-surface-2 border border-accent-2/20 hover:border-accent text-accent-2 hover:text-accent rounded-lg transition-all"
              title="Synchronize core database payload"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <a href="#" target="_blank" className="text-xs text-accent-2/65 hover:text-accent border border-accent-2/20 px-3 py-1.5 rounded-lg bg-surface transition-all">
              HOST_LOCKED
            </a>
          </div>
        </header>

        {/* Dynamic Panels */}
        <div className="flex-1 p-8 z-10">
          {loading && !stats ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <div className="text-xs text-accent animate-pulse">SYNCHRONIZING CORE PROTOCOLS...</div>
            </div>
          ) : (
            <>
              {/* Tab 0: Overview */}
              {activeTab === "DASHBOARD" && (
                <div className="space-y-6">
                  {/* Summary Counters Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[
                      { val: stats?.unread_messages, lbl: "UNREAD_MSG", sub: "Action Required", accent: "var(--accent-3)" },
                      { val: stats?.total_messages, lbl: "TOTAL_INBOX", sub: "Ledger", accent: "var(--accent-2)" },
                      { val: stats?.total_projects, lbl: "PROJECTS", sub: "Deploys", accent: "var(--accent)" },
                      { val: stats?.total_skills, lbl: "SKILLS", sub: "Assets", accent: "var(--gold)" },
                      { val: stats?.total_experience, lbl: "EXPERIENCE", sub: "Timeline", accent: "var(--accent-2)" },
                      { val: stats?.total_education, lbl: "ACADEMICS", sub: "Credits", accent: "var(--accent)" },
                      { val: stats?.total_certs, lbl: "CERTS", sub: "Credentials", accent: "var(--accent-3)" },
                    ].map((item, idx) => (
                      <div key={idx} className="cyber-card p-4 rounded-2xl flex flex-col justify-between" style={{ borderColor: item.val > 0 && item.accent ? `${item.accent}30` : "" }}>
                        <div className="text-[10px] text-text-secondary tracking-widest">{item.lbl}</div>
                        <div className="text-2xl font-bold my-1" style={{ color: item.val > 0 && item.accent ? item.accent : "" }}>
                          {item.val ?? 0}
                        </div>
                        <div className="text-[9px] text-muted">{item.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Cyber info board */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-surface/50 border border-accent/20 rounded-3xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 text-[9px] text-accent/40 font-bold uppercase">LEDGER_CONSOLE</div>
                      <h3 className="text-xs font-bold text-accent tracking-widest uppercase mb-4">Core Operating Instructions</h3>
                      <div className="text-xs text-text-secondary leading-relaxed space-y-3 font-mono-hacker">
                        <p>&gt; Welcome to the central administration panel. From this console, you can perform full CRUD updates to all portfolio configurations without direct database execution.</p>
                        <p>&gt; Data changes saved here are written straight to PostgreSQL. If the frontend portfolio is active, it pulls from these nodes.</p>
                        <p>&gt; <span className="text-accent font-bold">Resume Uploads</span> accept only PDF file configurations. Project status flags can be set manually. Icons refer to string lookup indices in React-Icons (e.g., SiReact, FaJava) or Lucide icons.</p>
                      </div>
                    </div>

                    <div className="bg-surface/50 border border-accent-2/20 rounded-3xl p-6">
                      <h3 className="text-xs font-bold text-accent-2 tracking-widest uppercase mb-4">Security Credentials</h3>
                      <div className="space-y-4 text-xs font-mono-hacker">
                        <div className="flex justify-between border-b border-accent-2/10 pb-2">
                          <span className="text-muted">Operator:</span>
                          <span className="text-text-primary font-bold">admin</span>
                        </div>
                        <div className="flex justify-between border-b border-accent-2/10 pb-2">
                          <span className="text-muted">Database Server:</span>
                          <span className="text-accent font-bold">PostgreSQL Pool</span>
                        </div>
                        <div className="flex justify-between border-b border-accent-2/10 pb-2">
                          <span className="text-muted">Session Token:</span>
                          <span className="text-accent-2 font-mono text-[9px] truncate max-w-[120px]">
                            {token}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Server Node IP:</span>
                          <span className="text-text-primary">127.0.0.1:5000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 1: Profile & Identity */}
              {activeTab === "PROFILE" && (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Settings Update */}
                  <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6 space-y-4">
                    <h3 className="text-xs font-bold text-accent tracking-widest uppercase border-b border-accent/20 pb-2 mb-4">
                      01.1 CORE PROFILE DETAILS
                    </h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Developer Name</label>
                          <input
                            type="text"
                            value={profile.name || ""}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            required
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Professional Status</label>
                          <input
                            type="text"
                            value={profile.status || ""}
                            onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                            required
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Core Stack (Comma separated)</label>
                        <input
                          type="text"
                          value={profile.core_stack || ""}
                          onChange={(e) => setProfile({ ...profile, core_stack: e.target.value })}
                          required
                          className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Bio Details (About Summary)</label>
                        <textarea
                          rows={4}
                          value={profile.about_text || ""}
                          onChange={(e) => setProfile({ ...profile, about_text: e.target.value })}
                          required
                          className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none resize-none font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Email</label>
                          <input
                            type="email"
                            value={profile.email || ""}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            required
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Phone</label>
                          <input
                            type="text"
                            value={profile.phone || ""}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Location Address</label>
                        <input
                          type="text"
                          value={profile.location || ""}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">GitHub Profile URL</label>
                          <input
                            type="url"
                            value={profile.github_url || ""}
                            onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">LinkedIn Profile URL</label>
                          <input
                            type="url"
                            value={profile.linkedin_url || ""}
                            onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="btn-hacker px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold"
                        >
                          <Save size={14} /> SAVE_CHANGES
                        </button>
                      </div>
                    </form>

                    {/* Resume Upload Module */}
                    <div className="pt-4 border-t border-accent-2/15 mt-6">
                      <h4 className="text-[10px] font-bold text-accent-2 uppercase mb-3">01.2 ATTACH RESUME DOCUMENT</h4>
                      <form onSubmit={handleResumeUpload} className="flex gap-4 items-end text-xs">
                        <div className="flex-1">
                          <label className="block text-[9px] uppercase text-muted mb-1">Select Resume (PDF ONLY)</label>
                          <div className="relative border border-dashed border-accent-2/30 bg-black/40 rounded-lg p-2 flex items-center justify-between">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => setResumeFile(e.target.files[0])}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <span className="text-[10px] text-text-secondary truncate pr-6">
                              {resumeFile ? resumeFile.name : "Choose file..."}
                            </span>
                            <Upload size={14} className="text-accent-2" />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={actionLoading || !resumeFile}
                          className="px-5 py-2.5 bg-accent-2 hover:bg-cyan-500 text-black font-bold uppercase rounded-lg disabled:opacity-50 tracking-wider flex items-center gap-1.5 transition-all text-xs"
                        >
                          <Upload size={13} /> UPLOAD
                        </button>
                      </form>
                      {profile.resume_url && (
                        <div className="text-[10px] text-muted mt-2 truncate flex items-center gap-1">
                          <FileText size={10} /> Live CV Endpoint: <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{profile.resume_url}</a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Roles & Stats CRUDs */}
                  <div className="space-y-6">
                    {/* Hero Typing Roles */}
                    <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6">
                      <h3 className="text-xs font-bold text-accent tracking-widest uppercase border-b border-accent/20 pb-2 mb-4">
                        01.3 TYPING EFFECTS CAROUSEL
                      </h3>
                      
                      <form onSubmit={submitRole} className="flex gap-2 items-end text-xs mb-4">
                        <div className="flex-1">
                          <label className="block text-[9px] text-muted mb-1 font-bold">Role Title</label>
                          <input
                            type="text"
                            value={roleForm.roleName}
                            onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
                            required
                            placeholder="e.g. MERN Specialist"
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2 focus:outline-none"
                          />
                        </div>
                        <div className="w-20">
                          <label className="block text-[9px] text-muted mb-1 font-bold">Order</label>
                          <input
                            type="number"
                            value={roleForm.displayOrder}
                            onChange={(e) => setRoleForm({ ...roleForm, displayOrder: parseInt(e.target.value) || 0 })}
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2 focus:outline-none"
                          />
                        </div>
                        <button type="submit" disabled={actionLoading} className="btn-hacker p-2 rounded-lg">
                          <Plus size={14} />
                        </button>
                      </form>

                      {/* List */}
                      <div className="space-y-2 max-h-44 overflow-y-auto pr-2">
                        {roles.length === 0 ? (
                          <div className="text-[10px] text-muted">No roles active. Seed settings file.</div>
                        ) : (
                          roles.sort((a, b) => a.display_order - b.display_order).map((r) => (
                            <div key={r.id} className="flex justify-between items-center bg-black/40 border border-accent-2/10 rounded-lg p-2 text-xs">
                              <div>
                                <span className="text-accent-2 text-[10px] font-bold mr-2">[{r.display_order}]</span>
                                <span className="text-text-primary font-bold">{r.role_name}</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setRoleForm({ id: r.id, roleName: r.role_name, displayOrder: r.display_order })} className="text-text-secondary hover:text-accent">
                                  <Edit3 size={12} />
                                </button>
                                <button onClick={() => deleteRole(r.id)} className="text-text-secondary hover:text-accent-3">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Hero Stats */}
                    <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6">
                      <h3 className="text-xs font-bold text-accent tracking-widest uppercase border-b border-accent/20 pb-2 mb-4">
                        01.4 HERO METRIC CARDS
                      </h3>

                      <form onSubmit={submitHeroStat} className="grid grid-cols-4 gap-2 items-end text-xs mb-4">
                        <div className="col-span-2">
                          <label className="block text-[9px] text-muted mb-1 font-bold">Metric Value</label>
                          <input
                            type="text"
                            value={statForm.value}
                            onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                            required
                            placeholder="e.g. 20+"
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-muted mb-1 font-bold">Label</label>
                          <input
                            type="text"
                            value={statForm.label}
                            onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                            required
                            placeholder="Projects"
                            className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2 focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-1">
                          <div className="w-10">
                            <input
                              type="number"
                              value={statForm.displayOrder}
                              onChange={(e) => setStatForm({ ...statForm, displayOrder: parseInt(e.target.value) || 0 })}
                              className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2 focus:outline-none text-center"
                            />
                          </div>
                          <button type="submit" disabled={actionLoading} className="btn-hacker p-2 rounded-lg">
                            <Plus size={14} />
                          </button>
                        </div>
                      </form>

                      {/* List */}
                      <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-2">
                        {heroStats.sort((a,b) => a.display_order - b.display_order).map((s) => (
                          <div key={s.id} className="flex justify-between items-center bg-black/40 border border-accent-2/10 rounded-lg p-2 text-xs">
                            <div>
                              <div className="text-accent font-bold">{s.value}</div>
                              <div className="text-[10px] text-text-secondary">{s.label}</div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setStatForm({ id: s.id, value: s.value, label: s.label, displayOrder: s.display_order })} className="text-text-secondary hover:text-accent">
                                <Edit3 size={11} />
                              </button>
                              <button onClick={() => deleteHeroStat(s.id)} className="text-text-secondary hover:text-accent-3">
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Skills & About Highlights */}
              {activeTab === "SKILLS" && (
                <div className="space-y-8">
                  {/* Highlights section */}
                  <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6">
                    <h3 className="text-xs font-bold text-accent tracking-widest uppercase border-b border-accent/20 pb-2 mb-4">
                      02.1 ABOUT SECTION HIGHLIGHTS
                    </h3>

                    <form onSubmit={submitHighlight} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end text-xs mb-6">
                      <div>
                        <label className="block text-[9px] text-muted mb-1 font-bold">Lucide Icon Name</label>
                        <input
                          type="text"
                          value={highlightForm.iconName}
                          onChange={(e) => setHighlightForm({ ...highlightForm, iconName: e.target.value })}
                          required
                          placeholder="Code2, Rocket, Coffee..."
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] text-muted mb-1 font-bold">Highlight Title</label>
                        <input
                          type="text"
                          value={highlightForm.label}
                          onChange={(e) => setHighlightForm({ ...highlightForm, label: e.target.value })}
                          required
                          placeholder="CLEAN CODE PROTOCOL"
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] text-muted mb-1 font-bold">Short Description</label>
                        <input
                          type="text"
                          value={highlightForm.description}
                          onChange={(e) => setHighlightForm({ ...highlightForm, description: e.target.value })}
                          required
                          placeholder="Writing modular architectures..."
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-12">
                          <label className="block text-[9px] text-muted mb-1 font-bold">Delay</label>
                          <input
                            type="number"
                            step="0.05"
                            value={highlightForm.delayOffset}
                            onChange={(e) => setHighlightForm({ ...highlightForm, delayOffset: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center"
                          />
                        </div>
                        <button type="submit" disabled={actionLoading} className="btn-hacker p-2.5 rounded-lg flex-1">
                          <Plus size={14} className="mx-auto" />
                        </button>
                      </div>
                    </form>

                    {/* Highlights List */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {highlights.sort((a,b) => a.display_order - b.display_order).map((h) => (
                        <div key={h.id} className="bg-black/40 border border-accent-2/10 rounded-2xl p-4 flex flex-col justify-between text-xs hover:border-accent-2/30 transition-all">
                          <div>
                            <div className="flex items-center justify-between border-b border-accent-2/10 pb-2 mb-2">
                              <span className="text-accent font-bold text-[10px]">{h.icon_name}</span>
                              <div className="flex gap-2">
                                <button onClick={() => setHighlightForm({ id: h.id, iconName: h.icon_name, label: h.label, description: h.description, delayOffset: parseFloat(h.delay_offset) || 0.1, displayOrder: h.display_order })} className="text-text-secondary hover:text-accent">
                                  <Edit3 size={11} />
                                </button>
                                <button onClick={() => deleteHighlight(h.id)} className="text-text-secondary hover:text-accent-3">
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                            <h4 className="font-bold text-accent-2 tracking-wider mb-1 uppercase">{h.label}</h4>
                            <p className="text-[10px] text-text-secondary leading-relaxed">{h.description}</p>
                          </div>
                          <div className="text-[8px] text-muted mt-2 text-right">Delay: {h.delay_offset}s</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Matrix Skills */}
                  <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6">
                    <h3 className="text-xs font-bold text-accent tracking-widest uppercase border-b border-accent/20 pb-2 mb-4">
                      02.2 TECHNICAL ASSETS MATRIX
                    </h3>

                    <form onSubmit={submitSkill} className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end text-xs mb-6">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[9px] text-muted mb-1 font-bold">Skill Name</label>
                        <input
                          type="text"
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          required
                          placeholder="e.g. React.js"
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-muted mb-1 font-bold">Icon Name</label>
                        <input
                          type="text"
                          value={skillForm.iconName}
                          onChange={(e) => setSkillForm({ ...skillForm, iconName: e.target.value })}
                          required
                          placeholder="SiReact, FaJava"
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-muted mb-1 font-bold">Level %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skillForm.level}
                          onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) || 0 })}
                          required
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-muted mb-1 font-bold">Glow Hex</label>
                        <input
                          type="text"
                          value={skillForm.colorHex}
                          onChange={(e) => setSkillForm({ ...skillForm, colorHex: e.target.value })}
                          required
                          placeholder="#39ff14"
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-muted mb-1 font-bold">Category</label>
                        <select
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                        >
                          <option value="FRONTEND">FRONTEND</option>
                          <option value="BACKEND">BACKEND</option>
                          <option value="TOOLS">TOOLS</option>
                        </select>
                      </div>
                      <button type="submit" disabled={actionLoading} className="btn-hacker p-2.5 rounded-lg flex items-center justify-center">
                        <Plus size={14} /> ADD_SKILL
                      </button>
                    </form>

                    {/* Table View */}
                    <div className="overflow-x-auto border border-accent-2/10 rounded-2xl max-h-96 overflow-y-auto">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="bg-black/60 border-b border-accent-2/25 text-accent-2 font-bold">
                            <th className="p-3">Skill Name</th>
                            <th className="p-3">Icon</th>
                            <th className="p-3 text-center">Category</th>
                            <th className="p-3 text-center">Level %</th>
                            <th className="p-3 text-center">Hex Glow</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-accent-2/10">
                          {skills.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="p-4 text-center text-muted text-xs">No skills loaded.</td>
                            </tr>
                          ) : (
                            skills.sort((a,b) => a.display_order - b.display_order).map((s) => (
                              <tr key={s.id} className="hover:bg-surface-2/30 transition-colors">
                                <td className="p-3 font-bold text-text-primary">{s.name}</td>
                                <td className="p-3 text-muted">{s.icon_name}</td>
                                <td className="p-3 text-center text-[10px] font-bold"><span className={`px-2 py-0.5 rounded border ${s.category === "FRONTEND" ? "border-accent/40 text-accent bg-accent/5" : s.category === "BACKEND" ? "border-accent-2/40 text-accent-2 bg-accent-2/5" : "border-gold/40 text-gold bg-gold/5"}`}>{s.category}</span></td>
                                <td className="p-3 text-center font-bold text-accent">{s.level}%</td>
                                <td className="p-3 text-center font-mono" style={{ color: s.color_hex }}>{s.color_hex}</td>
                                <td className="p-3 text-right flex justify-end gap-3 mt-1.5">
                                  <button onClick={() => setSkillForm({ id: s.id, name: s.name, iconName: s.icon_name, level: s.level, colorHex: s.color_hex, category: s.category, displayOrder: s.display_order })} className="text-text-secondary hover:text-accent">
                                    <Edit3 size={12} />
                                  </button>
                                  <button onClick={() => deleteSkill(s.id)} className="text-text-secondary hover:text-accent-3">
                                    <Trash2 size={12} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Projects CRUD */}
              {activeTab === "PROJECTS" && (
                <div className="space-y-6">
                  <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6">
                    <h3 className="text-xs font-bold text-accent tracking-widest uppercase border-b border-accent/20 pb-2 mb-4">
                      03.1 LAUNCH & COMPILE PROJECT MODULES
                    </h3>

                    <form onSubmit={submitProject} className="space-y-4 text-xs">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Project Title</label>
                          <input
                            type="text"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            required
                            placeholder="e.g. CORE LEDGER"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Major Category Code</label>
                          <input
                            type="text"
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                            required
                            placeholder="JAVA, DATABASE, MERN..."
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Status Label</label>
                            <input
                              type="text"
                              value={projectForm.status}
                              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                              required
                              placeholder="STABLE, PRODUCTION..."
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Color Hex</label>
                            <input
                              type="text"
                              value={projectForm.color_hex}
                              onChange={(e) => setProjectForm({ ...projectForm, color_hex: e.target.value })}
                              required
                              placeholder="#00e5ff"
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Project Description</label>
                        <textarea
                          rows={3}
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          required
                          placeholder="Comprehensive description of systems logic..."
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none resize-none font-sans"
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Git Repository URL</label>
                          <input
                            type="url"
                            value={projectForm.repo_url}
                            onChange={(e) => setProjectForm({ ...projectForm, repo_url: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Live Deploy URL</label>
                          <input
                            type="url"
                            value={projectForm.live_url}
                            onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Skills Tags (Comma separated)</label>
                          <input
                            type="text"
                            value={projectForm.tagsStr}
                            onChange={(e) => setProjectForm({ ...projectForm, tagsStr: e.target.value })}
                            placeholder="React, Node, PostgreSQL..."
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button type="submit" disabled={actionLoading} className="btn-hacker px-6 py-2.5 rounded-lg font-bold flex items-center gap-1.5">
                          <Save size={14} /> SAVE_PROJECT
                        </button>
                        {projectForm.id && (
                          <button type="button" onClick={() => setProjectForm({ id: null, title: "", description: "", category: "JAVA", repo_url: "", live_url: "", status: "STABLE", color_hex: "#00e5ff", tagsStr: "" })} className="px-5 py-2.5 bg-surface text-text-secondary border border-accent-2/20 hover:text-white rounded-lg text-xs font-bold uppercase transition-all">
                            ABORT_EDIT
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Active List */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {projects.map((p) => (
                      <div key={p.id} className="bg-surface/50 border border-accent-2/15 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-accent-2/30 transition-all select-text">
                        <div>
                          <div className="flex items-center justify-between border-b border-accent-2/10 pb-2 mb-3">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ borderColor: p.color_hex, color: p.color_hex, border: `1px solid ${p.color_hex}` }}>{p.category}</span>
                            <div className="flex gap-2.5">
                              <button onClick={() => setProjectForm({ id: p.id, title: p.title, description: p.description, category: p.category, repo_url: p.repo_url || "", live_url: p.live_url || "", status: p.status || "STABLE", color_hex: p.color_hex || "#00e5ff", tagsStr: p.tags?.join(", ") || "" })} className="text-text-secondary hover:text-accent">
                                <Edit3 size={13} />
                              </button>
                              <button onClick={() => deleteProject(p.id)} className="text-text-secondary hover:text-accent-3">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-bold text-text-primary text-sm tracking-wide uppercase">{p.title}</h4>
                          <p className="text-[10px] text-text-secondary leading-relaxed mt-2 font-sans">{p.description}</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {p.tags?.map(t => (
                              <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-black/30 border border-accent-2/10 text-accent-2">{t}</span>
                            ))}
                          </div>
                          <div className="border-t border-accent-2/10 pt-2 flex items-center justify-between text-[10px]">
                            <span className="font-bold uppercase" style={{ color: p.color_hex }}>STATUS: {p.status}</span>
                            <span className="text-muted truncate max-w-[150px]">{p.repo_url ? "Git Logged" : "Local Code"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Timelines (Experience & Education) */}
              {activeTab === "TIMELINES" && (
                <div className="space-y-8">
                  {/* Experience CRUD */}
                  <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6">
                    <h3 className="text-xs font-bold text-accent tracking-widest uppercase border-b border-accent/20 pb-2 mb-4 flex items-center gap-1.5">
                      <Briefcase size={14} /> 04.1 EMPLOYMENT EXPERIENCE TIMELINE
                    </h3>

                    <form onSubmit={submitExperience} className="space-y-4 text-xs">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Role Title</label>
                          <input
                            type="text"
                            value={expForm.role}
                            onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                            required
                            placeholder="e.g. SDE"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Company</label>
                          <input
                            type="text"
                            value={expForm.company}
                            onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                            required
                            placeholder="RajYug IT Solutions"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Location</label>
                          <input
                            type="text"
                            value={expForm.location}
                            onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                            required
                            placeholder="Pune, India"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Employment Type</label>
                            <input
                              type="text"
                              value={expForm.type}
                              onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                              required
                              placeholder="Full-Time"
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Period</label>
                            <input
                              type="text"
                              value={expForm.period}
                              onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                              required
                              placeholder="Dec 2025 - Present"
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Overall Description</label>
                          <input
                            type="text"
                            value={expForm.description}
                            onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                            required
                            placeholder="Summary of responsibilities..."
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Color Hex</label>
                            <input
                              type="text"
                              value={expForm.color_hex}
                              onChange={(e) => setExpForm({ ...expForm, color_hex: e.target.value })}
                              required
                              placeholder="#39ff14"
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Order Index</label>
                            <input
                              type="number"
                              value={expForm.display_order}
                              onChange={(e) => setExpForm({ ...expForm, display_order: parseInt(e.target.value) || 0 })}
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Key Points (One point per line)</label>
                          <textarea
                            rows={3}
                            value={expForm.pointsStr}
                            onChange={(e) => setExpForm({ ...expForm, pointsStr: e.target.value })}
                            placeholder="Involved in frontend development...&#10;Integrated REST APIs..."
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none resize-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Technologies Used (Comma separated)</label>
                          <textarea
                            rows={3}
                            value={expForm.techStr}
                            onChange={(e) => setExpForm({ ...expForm, techStr: e.target.value })}
                            placeholder="MongoDB, Express, Angular, Node..."
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none resize-none font-sans"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button type="submit" disabled={actionLoading} className="btn-hacker px-6 py-2.5 rounded-lg font-bold flex items-center gap-1.5">
                          <Save size={14} /> LOG_EXPERIENCE
                        </button>
                        {expForm.id && (
                          <button type="button" onClick={() => setExpForm({ id: null, role: "", company: "", location: "", period: "", type: "Full-Time", description: "", pointsStr: "", techStr: "", color_hex: "#39ff14", display_order: 0 })} className="px-5 py-2.5 bg-surface text-text-secondary border border-accent-2/20 hover:text-white rounded-lg text-xs font-bold uppercase transition-all">
                            ABORT_EDIT
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Active experiences list */}
                    <div className="mt-6 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {experiences.sort((a,b) => a.display_order - b.display_order).map((ex) => (
                        <div key={ex.id} className="flex justify-between items-start bg-black/40 border border-accent-2/15 rounded-2xl p-4 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-text-primary text-sm">{ex.role}</span>
                              <span className="text-muted">@ {ex.company}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-accent/20 font-bold" style={{ color: ex.color_hex }}>{ex.type}</span>
                            </div>
                            <div className="text-[10px] text-accent-2 mt-1">{ex.period} | {ex.location}</div>
                            <p className="text-text-secondary text-[11px] leading-relaxed mt-2 font-sans">{ex.description}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => setExpForm({ id: ex.id, role: ex.role, company: ex.company, location: ex.location, period: ex.period, type: ex.type, description: ex.description, pointsStr: ex.points?.join("\n") || "", techStr: ex.tech?.join(", ") || "", color_hex: ex.color_hex || "#39ff14", display_order: ex.display_order })} className="text-text-secondary hover:text-accent">
                              <Edit3 size={13} />
                            </button>
                            <button onClick={() => deleteExperience(ex.id)} className="text-text-secondary hover:text-accent-3">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education CRUD */}
                  <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6">
                    <h3 className="text-xs font-bold text-accent tracking-widest uppercase border-b border-accent/20 pb-2 mb-4 flex items-center gap-1.5">
                      <GraduationCap size={14} /> 04.2 ACADEMIC QUALIFICATIONS LOG
                    </h3>

                    <form onSubmit={submitEducation} className="space-y-4 text-xs">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Degree / Certification</label>
                          <input
                            type="text"
                            value={eduForm.degree}
                            onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                            required
                            placeholder="e.g. MCA"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Institution</label>
                          <input
                            type="text"
                            value={eduForm.institution}
                            onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                            required
                            placeholder="JSPM Narhe Technical Campus"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Location</label>
                            <input
                              type="text"
                              value={eduForm.location}
                              onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                              required
                              placeholder="Pune, India"
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Period</label>
                            <input
                              type="text"
                              value={eduForm.period}
                              onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                              required
                              placeholder="2023 - 2025"
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Grade / Score</label>
                          <input
                            type="text"
                            value={eduForm.grade}
                            onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                            required
                            placeholder="8.03 CGPA"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Color Hex</label>
                          <input
                            type="text"
                            value={eduForm.color_hex}
                            onChange={(e) => setEduForm({ ...eduForm, color_hex: e.target.value })}
                            required
                            placeholder="#00e5ff"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Order Index</label>
                          <input
                            type="number"
                            value={eduForm.display_order}
                            onChange={(e) => setEduForm({ ...eduForm, display_order: parseInt(e.target.value) || 0 })}
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Highlights (One point per line)</label>
                        <textarea
                          rows={3}
                          value={eduForm.highlightsStr}
                          onChange={(e) => setEduForm({ ...eduForm, highlightsStr: e.target.value })}
                          placeholder="Acquired expertise in Advanced Web Technologies...&#10;Focused on database efficiency..."
                          className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none resize-none font-sans"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button type="submit" disabled={actionLoading} className="btn-hacker px-6 py-2.5 rounded-lg font-bold flex items-center gap-1.5">
                          <Save size={14} /> LOG_EDUCATION
                        </button>
                        {eduForm.id && (
                          <button type="button" onClick={() => setEduForm({ id: null, degree: "", institution: "", location: "", period: "", grade: "", highlightsStr: "", color_hex: "#00e5ff", display_order: 0 })} className="px-5 py-2.5 bg-surface text-text-secondary border border-accent-2/20 hover:text-white rounded-lg text-xs font-bold uppercase transition-all">
                            ABORT_EDIT
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Active education list */}
                    <div className="mt-6 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {education.sort((a,b) => a.display_order - b.display_order).map((ed) => (
                        <div key={ed.id} className="flex justify-between items-start bg-black/40 border border-accent-2/15 rounded-2xl p-4 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-text-primary text-sm">{ed.degree}</span>
                              <span className="text-muted">@ {ed.institution}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-accent/20 text-accent font-bold">{ed.grade}</span>
                            </div>
                            <div className="text-[10px] text-accent-2 mt-1">{ed.period} | {ed.location}</div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => setEduForm({ id: ed.id, degree: ed.degree, institution: ed.institution, location: ed.location, period: ed.period, grade: ed.grade, highlightsStr: ed.highlights?.join("\n") || "", color_hex: ed.color_hex || "#00e5ff", display_order: ed.display_order })} className="text-text-secondary hover:text-accent">
                              <Edit3 size={13} />
                            </button>
                            <button onClick={() => deleteEducation(ed.id)} className="text-text-secondary hover:text-accent-3">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Certifications */}
              {activeTab === "CERTS" && (
                <div className="space-y-6">
                  <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6">
                    <h3 className="text-xs font-bold text-accent tracking-widest uppercase border-b border-accent/20 pb-2 mb-4">
                      05.1 REGISTER PROFESSIONAL CREDENTIALS
                    </h3>

                    <form onSubmit={submitCert} className="space-y-4 text-xs">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Certification Title</label>
                          <input
                            type="text"
                            value={certForm.title}
                            onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                            required
                            placeholder="e.g. Java Full Stack Development"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Issuer / Authority</label>
                          <input
                            type="text"
                            value={certForm.issuer}
                            onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                            required
                            placeholder="QSpiders"
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">License ID</label>
                            <input
                              type="text"
                              value={certForm.credential_id}
                              onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })}
                              required
                              placeholder="QS-JFS-2023"
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Issue Date</label>
                            <input
                              type="date"
                              value={certForm.date}
                              onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                              required
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center"
                              style={{ colorScheme: 'dark' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="col-span-2">
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Credential Verification Link</label>
                          <input
                            type="url"
                            value={certForm.link}
                            onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Key Skills (Comma separated)</label>
                          <input
                            type="text"
                            value={certForm.skillsStr}
                            onChange={(e) => setCertForm({ ...certForm, skillsStr: e.target.value })}
                            placeholder="Java, SQL, Spring Boot..."
                            className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Emoji</label>
                            <input
                              type="text"
                              value={certForm.icon_emoji}
                              onChange={(e) => setCertForm({ ...certForm, icon_emoji: e.target.value })}
                              required
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Glow</label>
                            <input
                              type="text"
                              value={certForm.color_hex}
                              onChange={(e) => setCertForm({ ...certForm, color_hex: e.target.value })}
                              required
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase text-muted mb-1">Order</label>
                            <input
                              type="number"
                              value={certForm.display_order}
                              onChange={(e) => setCertForm({ ...certForm, display_order: parseInt(e.target.value) || 0 })}
                              className="w-full bg-black/60 border border-accent-2/20 text-white rounded-lg p-2.5 focus:outline-none text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button type="submit" disabled={actionLoading} className="btn-hacker px-6 py-2.5 rounded-lg font-bold flex items-center gap-1.5">
                          <Save size={14} /> SAVE_CREDENTIAL
                        </button>
                        {certForm.id && (
                          <button type="button" onClick={() => setCertForm({ id: null, title: "", issuer: "", date: "", credential_id: "", link: "", skillsStr: "", icon_emoji: "🎓", color_hex: "#39ff14", display_order: 0 })} className="px-5 py-2.5 bg-surface text-text-secondary border border-accent-2/20 hover:text-white rounded-lg text-xs font-bold uppercase transition-all">
                            ABORT_EDIT
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* List View */}
                  <div className="overflow-x-auto border border-accent-2/10 rounded-2xl">
                    <table className="w-full border-collapse text-left text-xs select-text">
                      <thead>
                        <tr className="bg-black/60 border-b border-accent-2/25 text-accent-2 font-bold">
                          <th className="p-3">Title</th>
                          <th className="p-3">Issuer</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">License ID</th>
                          <th className="p-3">Skills Tags</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent-2/10">
                        {certs.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-4 text-center text-muted text-xs">No certificates registered.</td>
                          </tr>
                        ) : (
                          certs.sort((a,b) => a.display_order - b.display_order).map((c) => (
                            <tr key={c.id} className="hover:bg-surface-2/30 transition-colors">
                              <td className="p-3 font-bold text-text-primary flex items-center gap-2">
                                <span>{c.icon_emoji}</span>
                                <div>
                                  <div>{c.title}</div>
                                  <a href={c.link} target="_blank" rel="noreferrer" className="text-[10px] text-accent hover:underline">Verify Credential</a>
                                </div>
                              </td>
                              <td className="p-3 font-bold text-text-secondary">{c.issuer}</td>
                              <td className="p-3 text-muted">{c.date}</td>
                              <td className="p-3 font-mono text-[11px] text-accent-2">{c.credential_id}</td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                  {c.skills?.map(sk => (
                                    <span key={sk} className="text-[8px] px-1.5 py-0.5 rounded bg-black/40 border border-accent-2/5 text-text-secondary">{sk}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3 text-right flex justify-end gap-3 mt-1.5">
                                <button onClick={() => setCertForm({ id: c.id, title: c.title, issuer: c.issuer, date: c.date, credential_id: c.credential_id, link: c.link, skillsStr: c.skills?.join(", ") || "", icon_emoji: c.icon_emoji || "🎓", color_hex: c.color_hex || "#39ff14", display_order: c.display_order })} className="text-text-secondary hover:text-accent">
                                  <Edit3 size={12} />
                                </button>
                                <button onClick={() => deleteCert(c.id)} className="text-text-secondary hover:text-accent-3">
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: Messages Inbox */}
              {activeTab === "INBOX" && (
                <div className="space-y-6 select-text">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-accent tracking-widest uppercase">
                      06.1 CLIENT CONTACT TRANSMISSIONS
                    </h3>
                    <span className="text-[10px] text-accent-2 bg-accent-2/10 border border-accent-2/25 px-2.5 py-1 rounded-full font-bold">
                      LOGGED SESSIONS: {messages.length} total
                    </span>
                  </div>

                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="bg-surface/50 border border-accent/20 rounded-3xl p-12 text-center text-muted text-xs">
                        No contact transmissions received. Securing networks.
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div 
                          key={m.id} 
                          className={`bg-surface/70 border rounded-3xl p-6 relative overflow-hidden transition-all duration-300 ${
                            m.status === "UNREAD" 
                              ? "border-accent-3/45 shadow shadow-red-500/5 bg-surface-2/10" 
                              : "border-accent-2/15 hover:border-accent-2/30"
                          }`}
                        >
                          {/* Top Tag */}
                          {m.status === "UNREAD" && (
                            <div className="absolute top-0 right-0 bg-accent-3 text-black font-bold font-mono-hacker text-[9px] px-3.5 py-1 rounded-bl-xl uppercase tracking-wider animate-pulse">
                              NEW_MSG
                            </div>
                          )}

                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-accent-2/10 pb-4 mb-4 gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-text-primary text-sm">{m.name}</span>
                                <span className="text-xs text-muted">&lt;{m.email}&gt;</span>
                              </div>
                              <div className="text-[10px] text-accent-2 mt-1">
                                Subject: <span className="text-text-primary font-bold">{m.subject}</span>
                              </div>
                            </div>

                            <div className="text-right text-[10px] text-muted font-mono-hacker">
                              <div>IP Address: <span className="text-text-secondary">{m.ip_address}</span></div>
                              <div>Received: <span className="text-text-secondary">{new Date(m.created_at).toLocaleString()}</span></div>
                            </div>
                          </div>

                          <div className="text-xs text-text-secondary leading-relaxed bg-black/30 rounded-2xl p-4 font-sans select-text whitespace-pre-wrap">
                            {m.message}
                          </div>

                          <div className="mt-4 flex gap-3 justify-end text-xs">
                            <button
                              onClick={() => toggleMessageRead(m.id, m.status === "READ")}
                              className={`px-4 py-2 rounded-lg font-bold border transition-all ${
                                m.status === "READ"
                                  ? "bg-transparent border-accent-2/20 text-accent-2 hover:bg-accent-2/10"
                                  : "bg-accent text-black border-accent hover:shadow hover:shadow-green-500/20"
                              }`}
                            >
                              {m.status === "READ" ? "MARK_UNREAD" : "MARK_READ"}
                            </button>
                            <button
                              onClick={() => deleteMessage(m.id)}
                              className="px-4 py-2 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-black font-bold transition-all"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 7: Operator Config */}
              {activeTab === "SECURITY" && (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-accent tracking-widest uppercase mb-4">
                    07.1 OPERATOR ACCOUNT CONFIGURATION
                  </h3>
                  
                  <div className="bg-surface/50 border border-accent/20 rounded-3xl p-6 max-w-xl">
                    <form onSubmit={handleOperatorUpdate} className="space-y-4 text-xs font-mono-hacker">
                      <div>
                        <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Operator Username</label>
                        <input
                          type="text"
                          value={operatorForm.username}
                          onChange={(e) => setOperatorForm({ ...operatorForm, username: e.target.value })}
                          required
                          className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Operator Email</label>
                        <input
                          type="email"
                          value={operatorForm.email}
                          onChange={(e) => setOperatorForm({ ...operatorForm, email: e.target.value })}
                          required
                          className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-muted mb-1 font-bold">New Passphrase (Leave blank to keep current)</label>
                        <input
                          type="password"
                          value={operatorForm.password}
                          onChange={(e) => setOperatorForm({ ...operatorForm, password: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-muted mb-1 font-bold">Confirm New Passphrase</label>
                        <input
                          type="password"
                          value={operatorForm.confirmPassword}
                          onChange={(e) => setOperatorForm({ ...operatorForm, confirmPassword: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full bg-black/60 border border-accent-2/20 focus:border-accent text-white rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="btn-hacker px-6 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider hover:-translate-y-0.5 transition-all"
                      >
                        {actionLoading ? "SAVING..." : "COMMIT_CHANGES"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
