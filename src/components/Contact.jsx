import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
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
} from "lucide-react";
import SectionTitle from "./SectionTitle";

const contactInfo = [
  {
    icon: Mail,
    label: "EMAIL_NODE",
    value: "devaapatil330@gmail.com",
    href: "mailto:devaapatil330@gmail.com",
    color: "#00e5ff",
  },
  {
    icon: Phone,
    label: "COMMS_LINE",
    value: "+91 9518331190",
    href: "tel:+919518331190",
    color: "#39ff14",
  },
  {
    icon: MapPin,
    label: "PHYSICAL_COORDS",
    value: "Pune, Maharashtra, India",
    href: null,
    color: "#ffb700",
  },
];

const socials = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Devanandfarkade",
    color: "#ffffff",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/devanandfarkade",
    color: "#0077b5",
  },
];

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
          rows={5}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-xl bg-black border border-accent-2/30 text-text-primary placeholder:text-muted/50 font-mono-hacker text-sm focus:outline-none focus:border-accent/70 focus:bg-surface transition-all duration-300 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-xl bg-black border border-accent-2/30 text-text-primary placeholder:text-muted/50 font-mono-hacker text-sm focus:outline-none focus:border-accent/70 focus:bg-surface transition-all duration-300"
        />
      )}
    </div>
  );
}

export default function Contact() {
  const formRef = useRef(null);
  const inView = useInView(formRef, { once: true, margin: "-60px" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");

    try {
      await emailjs.send(
        "service_9mhpnzo",
        "template_cu3c3is",
        form,
        "E8kFEbVpsCQ2eZXD0"
      );
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-bg overflow-hidden hacker-grid">
      {/* Decorative glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-green-950/2 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle
          tag="SECURE_TRANSMISSION"
          title="COMMS_PANEL:"
          highlight="CONTACT"
          subtitle="Establish encrypted link protocol for professional communications..."
        />

        <div className="grid lg:grid-cols-5 gap-12 mt-12">
          {/* Left Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="cyber-card p-6 rounded-2xl">
              <h3 className="font-mono-hacker font-bold text-lg text-text-primary mb-3.5 tracking-wider">
                &gt; CONNECTION STATE
              </h3>
              <p className="font-dm text-sm text-text-secondary leading-relaxed">
                Currently open for software engineering roles, full-stack consulting, 
                and core development assignments. Initiate handshake protocols by transmitting details below.
              </p>
            </div>

            {/* Contact info cards */}
            <div className="space-y-3">
              {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                <div
                  key={label}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-surface/50 border border-accent-2/15 hover:border-accent/40 hover:bg-surface-2/40 transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + "10" }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div>
                    <div className="font-mono-hacker text-[10px] text-accent-2 mb-0.5 tracking-widest">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="font-mono-hacker text-sm text-text-primary hover:text-accent transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="font-mono-hacker text-sm text-text-primary">
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="cyber-card p-6 rounded-2xl space-y-3">
              <div className="font-mono-hacker text-[10px] text-accent-2 uppercase tracking-widest">
                &gt; REMOTE_SOCIAL_NODES
              </div>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface border border-accent-2/20 hover:border-accent text-text-secondary hover:text-accent transition-all duration-300"
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono-hacker font-bold text-accent text-xs tracking-wider">
                  SYSTEM READY: ACCEPTING CONNECTIONS
                </span>
              </div>
              <p className="font-dm text-xs text-text-secondary pl-4">
                Latency: ~24 hours. Safe connection verified.
              </p>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="p-8 rounded-3xl cyber-card">
              {status === "success" ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle size={48} className="text-accent mb-4" />
                  <h3 className="font-mono-hacker font-bold text-xl text-text-primary mb-2 tracking-wider">
                    TRANSMISSION COMPLETE
                  </h3>
                  <p className="font-dm text-sm text-text-secondary">
                    Your message packet was routed successfully. Handshake queued.
                  </p>
                </motion.div>
              ) : status === "error" ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <ShieldAlert size={48} className="text-red-500 mb-4" />
                  <h3 className="font-mono-hacker font-bold text-xl text-red-500 mb-2 tracking-wider">
                    TRANSMISSION FAILED
                  </h3>
                  <p className="font-dm text-sm text-text-secondary">
                    An error occurred routing the packet. Please try again or email directly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField
                      label="SENDER_NAME"
                      name="name"
                      placeholder="Ident Name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    <InputField
                      label="SENDER_EMAIL"
                      name="email"
                      type="email"
                      placeholder="address@domain.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <InputField
                    label="ROUTE_SUBJECT"
                    name="subject"
                    placeholder="Brief description header"
                    value={form.subject}
                    onChange={handleChange}
                  />
                  <InputField
                    label="DATA_PAYLOAD"
                    name="message"
                    placeholder="Enter message details here..."
                    value={form.message}
                    onChange={handleChange}
                    textarea
                  />

                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 btn-hacker font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        TRANSMITTING_PACKETS...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        TRANSMIT_MESSAGE
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
