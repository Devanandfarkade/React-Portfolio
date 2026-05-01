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
  Twitter,
  CheckCircle,
  Loader,
} from "lucide-react";
import SectionTitle from "./SectionTitle";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "devaapatil330@gmail.com",
    href: "mailto:devaapatil330@gmail.com",
    color: "#a855f7",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9518331190",
    href: "tel:+919518331190",
    color: "#06b6d4",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Pune, Maharashtra, India",
    href: null,
    color: "#f59e0b",
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
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com/",
    color: "#1da1f2",
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
      <label className="block font-dm text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-xl bg-surface border border-purple-900/40 text-text-primary placeholder:text-muted font-dm text-sm focus:outline-none focus:border-accent/70 focus:bg-surface-2 transition-all duration-300 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-xl bg-surface border border-purple-900/40 text-text-primary placeholder:text-muted font-dm text-sm focus:outline-none focus:border-accent/70 focus:bg-surface-2 transition-all duration-300"
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

    // Simulate send (replace with EmailJS integration)

    await emailjs.send(
      "service_9mhpnzo",
      "template_cu3c3is",
      form,
      "E8kFEbVpsCQ2eZXD0",
    );
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 1800);
  };

  return (
    <section id="contact" className="relative py-5 bg-bg overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-purple-600/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <SectionTitle
          tag="Get in Touch"
          title="Let's Work"
          highlight="Together"
          subtitle="Have a project in mind? I'd love to help. Send me a message and let's talk."
        />

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="font-syne font-bold text-2xl text-text-primary mb-3">
                Open to opportunities
              </h3>
              <p className="font-dm text-text-secondary leading-relaxed">
                I'm currently available for freelance projects, full-time roles,
                and exciting collaborations. Reach out and let's create
                something amazing together.
              </p>
            </div>

            {/* Contact info cards */}
            <div className="space-y-3">
              {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                <div
                  key={label}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-surface glow-border hover:bg-surface/80 transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + "20" }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <div className="font-dm text-xs text-muted mb-0.5">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="font-dm text-sm text-text-primary hover:text-accent transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="font-dm text-sm text-text-primary">
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div>
              <div className="font-dm text-xs text-muted uppercase tracking-widest mb-4">
                Connect with me
              </div>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, label, href, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface border border-purple-900/40 hover:border-accent/50 text-text-secondary hover:text-accent transition-all duration-300"
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-syne font-semibold text-green-400 text-sm">
                  Available for Work
                </span>
              </div>
              <p className="font-dm text-xs text-text-secondary">
                Usually responds within 24 hours.
              </p>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="p-8 rounded-3xl bg-surface glow-border">
              {status === "success" ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle size={56} className="text-green-400 mb-4" />
                  <h3 className="font-syne font-bold text-2xl text-text-primary mb-2">
                    Message Sent!
                  </h3>
                  <p className="font-dm text-text-secondary">
                    Thanks for reaching out. I'll get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InputField
                      label="Your Name"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <InputField
                    label="Subject"
                    name="subject"
                    placeholder="Project idea, job offer..."
                    value={form.subject}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Message"
                    name="message"
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={handleChange}
                    textarea
                  />

                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white font-dm font-semibold rounded-xl hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>

                  <p className="font-dm text-xs text-center text-muted">
                    Or email me directly at{" "}
                    <a
                      href="mailto:devaapatil330@gmail.com"
                      className="text-accent hover:underline"
                    >
                      devaapatil330@gmail.com
                    </a>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
