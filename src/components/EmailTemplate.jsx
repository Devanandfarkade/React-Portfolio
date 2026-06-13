import { useState, useEffect } from "react";
import { Mail, Shield, Clock, Terminal, ChevronRight, CornerDownRight, Check, Copy } from "lucide-react";

export default function EmailTemplate() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Restore native browser cursor for easy selections on the template preview page
    document.body.style.cursor = "auto";
    return () => {
      // Re-hide cursor for portfolio sections
      document.body.style.cursor = "";
    };
  }, []);

  // Mock template data
  const templateConfig = {
    subject: "TRANSMISSION: {{subject}} [SECURE_SHELL]",
    recipient: "devaapatil330@gmail.com",
    body: `
=========================================
      INBOUND PORTFOLIO CONTACT LOG
=========================================
TIMESTAMP: ${new Date().toISOString()}
ROUTE_ID:  SYS_TRANS_PIPE_091
SENDER:    {{name}}
REPLY_TO:  {{email}}
=========================================

MESSAGE_BODY:
-----------------------------------------
{{message}}

-----------------------------------------
[END OF PACKET]
=========================================
`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(templateConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020308] text-[#e6f7f4] flex items-center justify-center p-4 sm:p-6 md:p-8 font-mono-hacker hacker-grid select-text">
      {/* Decorative scanner line */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020308] via-transparent to-[#020308] pointer-events-none" />
      <div className="laser-line" />

      <div className="w-full max-w-4xl cyber-card p-6 md:p-8 rounded-3xl relative z-10 flex flex-col gap-6 bg-[#070c19]/90 border border-accent/20 shadow-2xl">
        {/* Header HUD */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#00e5ff]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/30 text-accent">
              <Terminal size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-[#e6f7f4]">EMAIL_TEMPLATE_SPEC</h1>
              <p className="text-[10px] text-[#8da4a6]">TEMPLATE_ID: template_cu3c3is | SYSTEM SPECIFICATION</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-accent-2/30 hover:border-accent text-accent-2 hover:bg-accent/5 hover:text-accent font-mono-hacker text-[10px] font-semibold transition-all duration-300"
            >
              {copied ? (
                <>
                  <Check size={11} /> COPIED_CONFIG
                </>
              ) : (
                <>
                  <Copy size={11} /> COPY_JSON_SPEC
                </>
              )}
            </button>
            <a
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-black font-mono-hacker text-[10px] font-bold shadow-md shadow-green-500/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              RETURN_TO_BASE <ChevronRight size={11} />
            </a>
          </div>
        </div>

        <p className="text-xs text-[#8da4a6] leading-relaxed">
          &gt; This static page displays the exact structure of the email template. When you build the backend API, this layout will structure the mail payload before transmission. You can use the values <code className="text-accent">{"{{name}}"}</code>, <code className="text-accent-2">{"{{email}}"}</code>, <code className="text-accent-3">{"{{subject}}"}</code>, and <code className="text-accent">{"{{message}}"}</code> to bind dynamic input parameters.
        </p>

        {/* Live Mock Render */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Details / Fields Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-surface border border-accent-2/10 space-y-3">
              <h3 className="text-xs font-bold text-accent-2 flex items-center gap-1.5 uppercase tracking-wider">
                <Shield size={12} /> Bind Parameters
              </h3>
              <div className="space-y-2.5 text-[11px]">
                <div className="p-2 rounded bg-black/40 border border-[#0e1530] flex flex-col gap-0.5">
                  <span className="text-[#8da4a6] text-[9px] uppercase tracking-wider">&gt; sender_name</span>
                  <span className="text-accent">{"{{name}}"}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-[#0e1530] flex flex-col gap-0.5">
                  <span className="text-[#8da4a6] text-[9px] uppercase tracking-wider">&gt; sender_email</span>
                  <span className="text-accent-2">{"{{email}}"}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-[#0e1530] flex flex-col gap-0.5">
                  <span className="text-[#8da4a6] text-[9px] uppercase tracking-wider">&gt; email_subject</span>
                  <span className="text-accent-3">{"{{subject}}"}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-[#0e1530] flex flex-col gap-0.5">
                  <span className="text-[#8da4a6] text-[9px] uppercase tracking-wider">&gt; transmission_payload</span>
                  <span className="text-white">{"{{message}}"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-[#ffb700]/20 space-y-2.5 text-[11px] text-[#8da4a6]">
              <div className="flex items-center gap-1.5 text-[#ffb700] font-bold uppercase tracking-wider">
                <Clock size={12} /> Router Config
              </div>
              <p className="leading-relaxed text-[10px]">
                Target Service Node: <span className="text-[#ffb700]">devaapatil330@gmail.com</span><br />
                Security Layer: TLS / SSL Parameters<br />
                Route Pipeline: SMTP_DIRECT
              </p>
            </div>
          </div>

          {/* Email HTML Template Mockup */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-accent/20 bg-black/60 overflow-hidden flex flex-col shadow-inner">
              {/* Fake Email Client Chrome */}
              <div className="bg-[#0e1530] px-4 py-2 border-b border-[#00e5ff]/10 flex items-center justify-between text-[10px] text-[#8da4a6]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff007f]/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffb700]/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/40" />
                </div>
                <span className="font-mono-hacker text-[9px] tracking-widest text-[#00e5ff]">SECURE_VIEWER // PORT 465</span>
              </div>

              {/* Email Client Header */}
              <div className="p-4 border-b border-[#0e1530] space-y-1.5 text-xs text-[#8da4a6]">
                <div>
                  <span className="font-bold text-accent">From:</span> Devanand's Core Router &lt;system@deva.core&gt;
                </div>
                <div>
                  <span className="font-bold text-accent-2">To:</span> {templateConfig.recipient}
                </div>
                <div>
                  <span className="font-bold text-accent-3">Subject:</span> <span className="text-white font-bold">{templateConfig.subject}</span>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="p-6 bg-[#04060c] text-xs leading-relaxed space-y-4 max-h-[350px] overflow-y-auto cyber-scrollbar select-text text-left">
                {/* Simulated Email Header Logo */}
                <div className="border border-accent-2/20 bg-surface/30 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-bold">&lt;DEVA_CORE /&gt;</span>
                    <span className="text-[9px] text-[#8da4a6] border border-[#00e5ff]/20 px-1.5 py-0.5 rounded bg-black">SYS_ALERT</span>
                  </div>
                  <span className="text-[9px] text-accent font-mono-hacker">SECURE DISPATCH</span>
                </div>

                {/* Email Info Table */}
                <div className="space-y-1 bg-black/50 p-3.5 rounded-xl border border-[#0e1530] font-mono-hacker text-[11px] text-[#8da4a6]">
                  <div className="flex justify-between border-b border-[#0e1530]/50 pb-1">
                    <span>TRANSMISSION_STATUS:</span>
                    <span className="text-accent font-bold">ROUTED_OK</span>
                  </div>
                  <div className="flex justify-between border-b border-[#0e1530]/50 py-1">
                    <span>SENDER_IDENT:</span>
                    <span className="text-white">John Doe</span>
                  </div>
                  <div className="flex justify-between border-b border-[#0e1530]/50 py-1">
                    <span>SENDER_EMAIL:</span>
                    <a href="mailto:john.doe@example.com" className="text-accent-2 hover:underline">john.doe@example.com</a>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>IP_ROUTING_ROUTE:</span>
                    <span className="text-accent-3">192.168.1.109</span>
                  </div>
                </div>

                {/* Email Message Text */}
                <div className="space-y-2 font-sans bg-black/30 p-4 rounded-xl border border-[#0e1530]/80">
                  <div className="font-mono-hacker text-[9px] text-[#8da4a6] uppercase tracking-widest flex items-center gap-1">
                    <CornerDownRight size={10} /> Message Payload
                  </div>
                  <p className="text-[#e6f7f4] leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    Hi Devanand,

I saw your react portfolio. The 3D interactions and hacker aesthetic are impressive. I would love to talk about a full-stack developer role at our company.

Best regards,
John Doe
                  </p>
                </div>

                <div className="text-[10px] text-center text-[#8da4a6]/50 border-t border-[#0e1530] pt-4 font-mono-hacker">
                  This is an automated transmission from the portfolio contact node.<br />
                  DO NOT REPLY DIRECTLY TO THIS SYSTEM MAIL. ROUTE CORRESPONDENCE TO SENDER EMAIL.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
