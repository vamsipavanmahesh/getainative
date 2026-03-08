import { useState, useEffect, useRef } from "react";

const CALENDLY_URL = "https://calendly.com/gvpmahesh/ai-native-sdlc-workshop-discovery-call";

const blogPosts = [];

const workshopTopics = [
  { num: "01", title: "AI-Powered PR Automation", desc: "Auto-generated PR descriptions with JIRA context, reviewers, and labels. Never write a PR description again." },
  { num: "02", title: "Automated Code Review", desc: "AI code review agents that catch bugs, suggest improvements, and enforce your team's style - before humans review." },
  { num: "03", title: "Commit Message Automation", desc: "Conventional commits, generated from diffs. Consistent git history across your entire team, zero effort." },
  { num: "04", title: "Test Generation Workflows", desc: "AI-assisted test writing that actually understands your codebase. RSpec, Jest, whatever your stack." },
  { num: "05", title: "Debugging & Support Workflows", desc: "Custom AI workflows for triaging production issues, reading logs, and suggesting fixes in context." },
  { num: "06", title: "Multi-Agent Development", desc: "Claude Code, custom skills, orchestrated agents - the full stack of AI-native development." },
];

const deliverables = [
  { title: "Live Workshop", duration: "1–2 hours", detail: "Hands-on, live coding in your actual repo. Not slides about 'the future of AI.' Your team builds and configures real workflows during the session.", num: "01" },
  { title: "7 Days Async Support", duration: "Post-workshop", detail: "Your team will have questions. Things won't work the first time. I answer everything for 7 days - Slack, email, whatever your team uses.", num: "02" },
  { title: "Custom Workflow Setup", duration: "Tailored to your stack", detail: "I configure AI workflows for your actual codebase - PR automation, code review agents, debugging pipelines. You keep everything after.", num: "03" },
];

const adjacentItems = [
  "Copilot for line completions",
  "Paste errors into ChatGPT",
  "Generate boilerplate code",
  "Manually write PRs, reviews, commits"
];

const nativeItems = [
  "PRs auto-generated with JIRA context",
  "AI code review before human review",
  "Tests generated from codebase context",
  "Custom debugging & support workflows"
];

function useReveal(threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function AINativeSDLC() {
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [activeDeliverable, setActiveDeliverable] = useState(0);

  return (
    <div className="landing-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: #1a1a2e; color: #f0e6d3; }
        a { color: inherit; text-decoration: none; }

        .landing-root {
          --sand: #f0e6d3;
          --sand-light: #f7f2ea;
          --sand-dark: #e0d2bc;
          --ink: #1a1a2e;
          --ink-light: #2d2d44;
          --ink-muted: #6b6b80;
          --accent: #c45d3e;
          --accent-light: #e8734f;
          --accent-bg: rgba(196, 93, 62, 0.08);
          --serif: 'DM Serif Display', Georgia, serif;
          --sans: 'Instrument Sans', -apple-system, sans-serif;
          --mono: 'JetBrains Mono', monospace;

          font-family: var(--sans);
          background: var(--sand-light);
          color: var(--ink);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        /* Texture overlay */
        .landing-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .section-pad { padding-left: 48px; padding-right: 48px; }

        /* Nav */
        .nav-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          background: rgba(247, 242, 234, 0.85);
          border-bottom: 1px solid rgba(26, 26, 46, 0.06);
        }

        /* Buttons */
        .btn-book {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px;
          background: var(--ink);
          color: var(--sand-light);
          font-family: var(--sans);
          font-weight: 600; font-size: 14px;
          border: none; border-radius: 6px;
          cursor: pointer; transition: all 0.25s ease;
          text-decoration: none; letter-spacing: -0.01em;
        }
        .btn-book:hover { background: var(--ink-light); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(26,26,46,0.15); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px;
          background: transparent;
          color: var(--ink);
          font-family: var(--sans);
          font-weight: 500; font-size: 14px;
          border: 1.5px solid rgba(26,26,46,0.15);
          border-radius: 6px;
          cursor: pointer; transition: all 0.25s ease;
          text-decoration: none;
        }
        .btn-ghost:hover { border-color: rgba(26,26,46,0.35); background: rgba(26,26,46,0.03); }

        /* Section label */
        .sec-label {
          font-family: var(--mono);
          font-size: 11px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 16px;
        }

        .sec-heading {
          font-family: var(--serif);
          font-size: 48px; font-weight: 400;
          letter-spacing: -0.02em; line-height: 1.12;
          color: var(--ink);
        }

        .divider { height: 1px; background: rgba(26,26,46,0.07); max-width: 1100px; margin: 0 auto; }

        /* Card base */
        .topic-card {
          padding: 28px 24px;
          border-radius: 10px;
          border: 1px solid rgba(26,26,46,0.06);
          background: rgba(255,255,255,0.4);
          transition: all 0.3s ease;
          cursor: default;
        }
        .topic-card:hover, .topic-card.active {
          background: rgba(255,255,255,0.8);
          border-color: rgba(196, 93, 62, 0.2);
          box-shadow: 0 2px 24px rgba(26,26,46,0.05);
        }

        .proof-strip {
          display: flex; align-items: center; justify-content: center;
          gap: 40px; flex-wrap: wrap;
          padding: 24px 48px;
          background: rgba(26,26,46,0.03);
          border-top: 1px solid rgba(26,26,46,0.06);
          border-bottom: 1px solid rgba(26,26,46,0.06);
        }

        .terminal-box {
          background: var(--ink);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(26,26,46,0.15), 0 1px 3px rgba(26,26,46,0.1);
        }

        /* Accordion deliverables */
        .del-item {
          border-bottom: 1px solid rgba(26,26,46,0.08);
          cursor: pointer;
          transition: background 0.2s;
        }
        .del-item:hover { background: rgba(255,255,255,0.3); }
        .del-item.active { background: rgba(196,93,62,0.04); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .hero-anim-1 { animation: fadeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .hero-anim-2 { animation: fadeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .hero-anim-3 { animation: fadeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .hero-anim-4 { animation: fadeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .hero-anim-5 { animation: fadeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s both; }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        @media (max-width: 820px) {
          .hero-heading { font-size: 36px !important; }
          .sec-heading { font-size: 34px !important; }
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .hero-ctas { flex-direction: column !important; align-items: stretch !important; }
          .hero-ctas .btn-book, .hero-ctas .btn-ghost { justify-content: center; }
          .proof-strip { gap: 20px !important; padding: 20px !important; }
          .cta-heading { font-size: 36px !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav-bar">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }} className="section-pad">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
            <span style={{ fontFamily: "var(--serif)", fontSize: 16, letterSpacing: "-0.01em" }}>Get AI Native</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div className="nav-links" style={{ display: "flex", gap: 28 }}>
              {[{ l: "Workshop", h: "#what-you-get" }, { l: "Topics", h: "#topics" }, { l: "About", h: "#about" }, { l: "Blog \u2197", h: "https://blog.getainative.com" }].map(link => (
                <a key={link.l} href={link.h} style={{ fontSize: 13, color: "var(--ink-muted)", fontWeight: 500, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "var(--ink)"}
                  onMouseLeave={e => e.target.style.color = "var(--ink-muted)"}>
                  {link.l}
                </a>
              ))}
            </div>
            <a href={CALENDLY_URL} className="btn-book" style={{ padding: "9px 20px", fontSize: 13 }}>Book a Call</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", padding: "152px 48px 80px", maxWidth: 1100, margin: "0 auto" }} className="section-pad">
        <div className="hero-anim-1" style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 16px",
            background: "var(--accent-bg)",
            border: "1px solid rgba(196,93,62,0.12)",
            borderRadius: 100,
            fontSize: 13, fontWeight: 500, color: "var(--accent)",
            fontFamily: "var(--sans)"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
            Workshop for engineering teams of 5–30
          </span>
        </div>

        <h1 className="hero-heading hero-anim-2" style={{
          fontFamily: "var(--serif)", fontSize: 64, fontWeight: 400,
          lineHeight: 1.08, letterSpacing: "-0.025em",
          maxWidth: 720, marginBottom: 24,
        }}>
          Make your entire SDLC{" "}
          <span style={{ fontStyle: "italic", color: "var(--accent)" }}>AI&nbsp;Native</span>
          {" "}in one workshop.
        </h1>

        <p className="hero-anim-3" style={{
          fontSize: 17, lineHeight: 1.7, color: "var(--ink-muted)",
          maxWidth: 520, marginBottom: 40, letterSpacing: "-0.01em"
        }}>
          From PR descriptions to code review to test generation - a hands-on session where your team builds and ships real AI workflows. Not slides. Not theory. Working automation in your actual codebase.
        </p>

        <div className="hero-anim-4 hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href={CALENDLY_URL} className="btn-book" style={{ padding: "15px 32px", fontSize: 15 }}>
            Book the Workshop <span style={{ opacity: 0.6 }}>{"\u2192"}</span>
          </a>
          <a href="#what-you-get" className="btn-ghost" style={{ padding: "15px 32px", fontSize: 15 }}>
            See What's Included
          </a>
        </div>

        {/* Terminal */}
        <div className="hero-anim-5" style={{ maxWidth: 460, marginTop: 56 }}>
          <div className="terminal-box">
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ marginLeft: 8, fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>~/your-repo</span>
            </div>
            <div style={{ padding: "16px 20px", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 2, color: "rgba(255,255,255,0.45)" }}>
              <div><span style={{ color: "#e8734f" }}>$</span> claude commit --push</div>
              <div><span style={{ color: "#6ec87a" }}>{"\u2713"}</span> feat(payments): add HDFC integration</div>
              <div><span style={{ color: "#6ec87a" }}>{"\u2713"}</span> PR #247 created with JIRA context</div>
              <div><span style={{ color: "#6ec87a" }}>{"\u2713"}</span> Code review agent triggered</div>
              <div><span style={{ color: "#6ec87a" }}>{"\u2713"}</span> 3 tests auto-generated</div>
              <div style={{ marginTop: 2 }}>
                <span style={{ color: "#e8734f" }}>$</span>{" "}
                <span style={{ display: "inline-block", width: 7, height: 15, background: "#e8734f", verticalAlign: "middle", animation: "blink 1.2s step-end infinite", borderRadius: 1 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <div className="proof-strip">
        {[
          "10+ years production engineering",
          "Fintech & cross-border payments",
          "Adopted by entire teams",
          "Documented in public blog series"
        ].map((item, i) => (
          <span key={i} style={{ fontSize: 12, fontFamily: "var(--mono)", fontWeight: 500, color: "var(--ink-muted)", letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
            {item}
          </span>
        ))}
      </div>

      {/* PROBLEM */}
      <section style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }} className="section-pad">
        <Reveal><div className="sec-label">The Gap</div></Reveal>
        <Reveal delay={80}>
          <h2 className="sec-heading" style={{ maxWidth: 660, marginBottom: 20 }}>
            Most teams are AI&nbsp;Adjacent.
            <br />
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>Yours should be AI&nbsp;Native.</span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-muted)", maxWidth: 520, marginBottom: 48 }}>
            There's a difference between "we use Copilot" and "AI is woven into every step of how we ship." This workshop closes that gap.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Adjacent */}
            <div style={{ padding: 32, background: "rgba(255,255,255,0.3)", border: "1px solid rgba(26,26,46,0.06)", borderRadius: 12 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500, letterSpacing: 2, color: "var(--ink-muted)", marginBottom: 24, textTransform: "uppercase" }}>AI Adjacent</div>
              {adjacentItems.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: i > 0 ? "1px solid rgba(26,26,46,0.06)" : "none", fontSize: 14, color: "var(--ink-muted)" }}>
                  <span style={{ color: "rgba(26,26,46,0.2)", fontSize: 14, fontWeight: 600 }}>{"\u2715"}</span>{item}
                </div>
              ))}
            </div>
            {/* Native */}
            <div style={{ padding: 32, background: "var(--accent-bg)", border: "1px solid rgba(196,93,62,0.12)", borderRadius: 12 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500, letterSpacing: 2, color: "var(--accent)", marginBottom: 24, textTransform: "uppercase" }}>AI Native</div>
              {nativeItems.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: i > 0 ? "1px solid rgba(196,93,62,0.08)" : "none", fontSize: 14, color: "var(--ink)" }}>
                  <span style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600 }}>{"\u2713"}</span>{item}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <div className="divider" />

      {/* WHAT YOU GET - ACCORDION */}
      <section id="what-you-get" style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }} className="section-pad">
        <Reveal><div className="sec-label">What You Get</div></Reveal>
        <Reveal delay={80}>
          <h2 className="sec-heading" style={{ maxWidth: 560, marginBottom: 56 }}>
            Not a talk.<br />
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>A complete setup.</span>
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 40, alignItems: "start" }}>
            {/* Left: accordion */}
            <div style={{ borderTop: "1px solid rgba(26,26,46,0.08)" }}>
              {deliverables.map((d, i) => (
                <div
                  key={i}
                  className={`del-item ${activeDeliverable === i ? "active" : ""}`}
                  onClick={() => setActiveDeliverable(i)}
                  style={{ padding: "24px 0" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500, color: activeDeliverable === i ? "var(--accent)" : "var(--ink-muted)", transition: "color 0.2s" }}>
                        {d.num}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: activeDeliverable === i ? "var(--ink)" : "var(--ink-muted)", transition: "color 0.2s" }}>
                        {d.title}
                      </span>
                    </div>
                    <span style={{ fontSize: 18, color: "var(--ink-muted)", transform: activeDeliverable === i ? "rotate(45deg)" : "none", transition: "transform 0.25s" }}>+</span>
                  </div>
                  <div style={{
                    maxHeight: activeDeliverable === i ? 120 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}>
                    <div style={{ paddingTop: 12, paddingLeft: 36 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", fontWeight: 500, display: "block", marginBottom: 6 }}>{d.duration}</span>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-muted)" }}>{d.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: emphasis card */}
            <div style={{
              padding: 40,
              background: "var(--ink)",
              borderRadius: 12,
              color: "var(--sand)",
            }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(240,230,211,0.4)", marginBottom: 24 }}>
                The outcome
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 28, lineHeight: 1.35, letterSpacing: "-0.02em", marginBottom: 20 }}>
                Your team walks away with AI workflows{" "}
                <span style={{ color: "var(--accent-light)" }}>running in your actual codebase</span>,
                not a slide deck of possibilities.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(240,230,211,0.5)" }}>
                Every workflow is configured in your repo, with your tools, your CI, your conventions. Nothing hypothetical. You keep everything after the workshop.
              </p>
              <a href={CALENDLY_URL} className="btn-book" style={{
                marginTop: 28,
                background: "var(--accent)",
                color: "#fff",
                display: "inline-flex",
              }}>
                Book the Workshop <span style={{ opacity: 0.6 }}>{"\u2192"}</span>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="divider" />

      {/* TOPICS */}
      <section id="topics" style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }} className="section-pad">
        <Reveal><div className="sec-label">Workshop Modules</div></Reveal>
        <Reveal delay={80}>
          <h2 className="sec-heading" style={{ maxWidth: 540, marginBottom: 56 }}>
            Six workflows.<br />
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>All hands-on.</span>
          </h2>
        </Reveal>

        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {workshopTopics.map((topic, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                className={`topic-card ${hoveredTopic === i ? "active" : ""}`}
                onMouseEnter={() => setHoveredTopic(i)}
                onMouseLeave={() => setHoveredTopic(null)}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500,
                    color: hoveredTopic === i ? "var(--accent)" : "var(--ink-muted)",
                    transition: "color 0.25s", marginTop: 3, flexShrink: 0,
                  }}>
                    {topic.num}
                  </span>
                  <div>
                    <h3 style={{
                      fontSize: 15, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.01em",
                      color: hoveredTopic === i ? "var(--ink)" : "var(--ink-light)",
                      transition: "color 0.25s"
                    }}>
                      {topic.title}
                    </h3>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-muted)" }}>{topic.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }} className="section-pad">
        <Reveal><div className="sec-label">Your Instructor</div></Reveal>
        <Reveal delay={80}>
          <h2 className="sec-heading" style={{ marginBottom: 28, maxWidth: 480 }}>
            Not a consultant who read a blog.
            <br />
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>An engineer who wrote it.</span>
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-muted)", display: "flex", flexDirection: "column", gap: 14, maxWidth: 600 }}>
            <p>
              I'm Vamsi Gunturu.
            </p>
            <p>
              For over a decade I've shipped production systems used by millions. I've led engineering at a $200M edtech company through Series A, worked as a Staff Engineer at a billion-dollar European bank, and now build cross-border payment infrastructure processing hundreds of millions in volume.
            </p>
            <p>
              I adopted AI-native development early, not as a side experiment but as part of my daily workflow.
            </p>
            <p style={{ color: "var(--ink-light)" }}>
              The techniques in this course come directly from that practice.
            </p>
            <p>
              I've shared these workflows at engineering meetups and internal team workshops. Teams that adopted them saw meaningful improvements in development speed, debugging time, and overall code quality.
            </p>
            <p style={{ color: "var(--ink-light)" }}>
              Everything you'll learn here follows one simple rule.
            </p>
            <p style={{ color: "var(--ink)", fontWeight: 500 }}>
              If it doesn't work in production, I don't teach it.
            </p>
          </div>
        </Reveal>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section style={{ padding: "120px 48px", textAlign: "center", position: "relative" }} className="section-pad">
        <Reveal>
          <h2 className="cta-heading" style={{
            fontFamily: "var(--serif)", fontSize: 52, fontWeight: 400,
            lineHeight: 1.1, letterSpacing: "-0.025em",
            maxWidth: 560, margin: "0 auto 20px"
          }}>
            Ready to make your team{" "}
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>AI&nbsp;Native?</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--ink-muted)", maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.65 }}>
            30-minute call. We'll talk through your team's stack, pain points, and how the workshop gets tailored for you.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={CALENDLY_URL} className="btn-book" style={{ padding: "16px 36px", fontSize: 15 }}>
              Book a Call <span style={{ opacity: 0.6 }}>{"\u2192"}</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "28px 48px",
        borderTop: "1px solid rgba(26,26,46,0.06)",
        maxWidth: 1100, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12
      }} className="section-pad">
        <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>{"\u00A9"} {new Date().getFullYear()} Vamsi Gunturu</span>
      </footer>
    </div>
  );
}
