import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  ShieldAlert,
  CheckCircle,
  Loader,
  Eye,
} from "lucide-react";
import SectionTitle from "./SectionTitle";
import { api } from "../services/api";



function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  textarea,
}) {
  return (
    <div>
      <label className="block font-mono-hacker text-xs font-semibold text-accent-2 mb-2 tracking-wider">
        &gt; {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={4}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-black border border-accent-2/30 text-text-primary placeholder:text-muted/50 font-mono-hacker text-sm focus:outline-none focus:border-accent/70 focus:bg-surface transition-all duration-300 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-black border border-accent-2/30 text-text-primary placeholder:text-muted/50 font-mono-hacker text-sm focus:outline-none focus:border-accent/70 focus:bg-surface transition-all duration-300"
        />
      )}
    </div>
  );
}

import Skeleton from '@mui/material/Skeleton';

export default function Contact({ showSkeleton }) {
  const formRef = useRef(null);
  const inView = useInView(formRef, { once: true, margin: "-60px" });
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useEffect(() => {
    api.getProfile()
      .then((data) => {
        setProfile(data);
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error("Failed to load contact settings:", err);
        setLoadingProfile(false);
      });
  }, []);

  const isLoading = loadingProfile || showSkeleton;

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: profile?.email || "devaapatil330@gmail.com",
      href: profile?.email ? `mailto:${profile.email}` : "mailto:devaapatil330@gmail.com",
      color: "#00e5ff",
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile?.phone || "+91 9518331190",
      href: profile?.phone ? `tel:${profile.phone.replace(/\s+/g, '')}` : "tel:+919518331190",
      color: "#39ff14",
    },
    {
      icon: MapPin,
      label: "Location",
      value: profile?.location || "Pune, Maharashtra, India",
      href: null,
      color: "#ffb700",
    },
  ];

  const socials = [
    {
      icon: Github,
      label: "GitHub",
      href: profile?.github_url || "https://github.com/Devanandfarkade",
      color: "#ffffff",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: profile?.linkedin_url || "https://linkedin.com/in/devanandfarkade",
      color: "#0077b5",
    },
  ];

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");

    try {
      await api.sendMessage(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      console.error("Transmission error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="relative lg:h-screen lg:max-h-screen lg:min-h-[600px] flex items-center py-12 lg:py-0 bg-bg overflow-hidden hacker-grid">
      {/* Decorative glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-green-950/2 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col justify-center">
        <SectionTitle
          tag="CONTACT"
          title="CONNECT:"
          highlight="GET IN TOUCH"
          subtitle="Send a message to establish an encrypted handshake pipeline..."
        />

        <div className="grid lg:grid-cols-5 gap-10 mt-6 items-stretch">
          {/* Left Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="cyber-card p-5 rounded-2xl">
                <h3 className="font-mono-hacker font-bold text-sm text-text-primary mb-2 tracking-wider">
                  &gt; STATUS
                </h3>
                <p className="font-dm text-xs text-text-secondary leading-relaxed">
                  Open for developer roles, full-stack consulting, and core assignments. Route your transmission parameters using the secure console interface.
                </p>
              </div>

              {/* Contact info cards */}
              <div className="space-y-2.5">
                {isLoading ? (
                  [1,2,3].map(i => <Skeleton key={i} variant="rounded" height={60} className="bg-surface-2/40 rounded-xl" />)
                ) : (
                  contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                    <div
                      key={label}
                      className="group flex items-center gap-3.5 p-3 rounded-xl bg-surface/50 border border-accent-2/15 hover:border-accent/40 hover:bg-surface-2/40 transition-all duration-300"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: color + "10" }}
                      >
                        <Icon size={14} style={{ color }} />
                      </div>
                      <div>
                        <div className="font-mono-hacker text-[9px] text-accent-2 mb-0.5 tracking-widest">
                          {label.toUpperCase()}
                        </div>
                        {href ? (
                          <a
                            href={href}
                            className="font-mono-hacker text-xs text-text-primary hover:text-accent transition-colors"
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="font-mono-hacker text-xs text-text-primary">
                            {value}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Social & availability tags */}
            <div className="space-y-3">
              <div className="cyber-card p-4 rounded-xl flex items-center justify-between">
                <span className="font-mono-hacker text-[10px] text-accent-2 uppercase tracking-widest">&gt; SOCIAL_CHANNELS</span>
                <div className="flex gap-2">
                  {isLoading ? (
                    <Skeleton variant="rounded" width={80} height={28} className="bg-surface-2/40 rounded" />
                  ) : (
                    socials.map(({ icon: Icon, label, href }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        whileHover={{ scale: 1.05, y: -1 }}
                        className="w-7 h-7 flex items-center justify-center rounded bg-surface border border-accent-2/20 hover:border-accent text-text-secondary hover:text-accent transition-all duration-200"
                      >
                        <Icon size={12} />
                      </motion.a>
                    ))
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono-hacker text-[9px] text-accent font-bold tracking-wider">SECURE CONNECTION ESTABLISHED</span>
                </div>
                <span className="font-mono-hacker text-[9px] text-text-secondary/50">SYS_LVL_0</span>
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 flex"
          >
            <div className="p-6 lg:p-8 rounded-3xl cyber-card flex-1 flex flex-col justify-center max-h-[60vh] lg:max-h-[72vh]">
              <div className="w-full overflow-y-auto cyber-scrollbar pr-2 max-h-full">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Skeleton variant="rounded" height={60} className="bg-surface-2/40 rounded-xl" />
                      <Skeleton variant="rounded" height={60} className="bg-surface-2/40 rounded-xl" />
                    </div>
                    <Skeleton variant="rounded" height={60} className="bg-surface-2/40 rounded-xl" />
                    <Skeleton variant="rounded" height={150} className="bg-surface-2/40 rounded-xl" />
                    <div className="flex gap-3">
                      <Skeleton variant="rounded" height={45} className="bg-surface-2/40 rounded-xl flex-1" />
                      <Skeleton variant="rounded" height={45} className="bg-surface-2/40 rounded-xl flex-1" />
                    </div>
                  </div>
                ) : status === "success" ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <CheckCircle size={40} className="text-accent mb-3.5" />
                    <h3 className="font-mono-hacker font-bold text-sm text-text-primary mb-2 tracking-wider">
                      TRANSMISSION COMPLETE
                    </h3>
                    <p className="font-dm text-xs text-text-secondary">
                      Your message packet was routed successfully. Handshake queued.
                    </p>
                  </motion.div>
                ) : status === "error" ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <ShieldAlert size={40} className="text-red-500 mb-3.5" />
                    <h3 className="font-mono-hacker font-bold text-sm text-red-500 mb-2 tracking-wider">
                      TRANSMISSION FAILED
                    </h3>
                    <p className="font-dm text-xs text-text-secondary">
                      An error occurred routing the packet. Please email directly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <InputField
                        label="YOUR_NAME"
                        name="name"
                        placeholder="Ident Name"
                        value={form.name}
                        onChange={handleChange}
                      />
                      <InputField
                        label="YOUR_EMAIL"
                        name="email"
                        type="email"
                        placeholder="address@domain.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                    <InputField
                      label="SUBJECT"
                      name="subject"
                      placeholder="Brief description"
                      value={form.subject}
                      onChange={handleChange}
                    />
                    <InputField
                      label="MESSAGE"
                      name="message"
                      placeholder="Enter message details here..."
                      value={form.message}
                      onChange={handleChange}
                      textarea
                    />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        type="submit"
                        disabled={status === "loading"}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 btn-hacker font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 text-xs"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            TRANSMITTING...
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            SEND MESSAGE
                          </>
                        )}
                      </motion.button>

                      <a
                        href="#email-template"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-3.5 border border-accent-2/30 text-accent-2 hover:bg-accent-2/5 rounded-xl hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm text-xs font-mono-hacker font-bold"
                      >
                        <Eye size={13} />
                        VIEW_TEMPLATE_SPEC
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
