"use client";

import Link from "next/link";
import { ArrowUpRight, Compass, HeartHandshake, CalendarDays, ShieldCheck, LockKeyhole, MessageCircle, Sparkles, UserRound, ArrowRight } from "lucide-react";

const features = [
  { icon: Compass, title: "Discover your people", text: "Find a community that makes room for real connection, shared interests, and individual expression." },
  { icon: CalendarDays, title: "Make moments happen", text: "Explore events, meetups, and experiences brought together in one place." },
  { icon: MessageCircle, title: "Connect on your terms", text: "Start conversations, build trust, and decide what you want to share." },
  { icon: ShieldCheck, title: "Respect comes first", text: "A space built around consent, boundaries, discretion, and personal choice." },
  { icon: HeartHandshake, title: "More than a feed", text: "Community, discovery, and experiences beyond the usual endless scrolling." },
  { icon: LockKeyhole, title: "Your space, your pace", text: "Choose how you participate. Explore the community when you’re ready." },
];

export default function LandingPage() {
  return (
    <main className="vybe-landing">
      <div className="container">
        <nav className="nav" aria-label="Main navigation">
          <Link className="wordmark" href="/" aria-label="VYBE homepage">VYBE<span>.</span></Link>
          <div className="nav-links">
            <a className="nav-extra" href="#discover">Discover</a>
            <a className="nav-extra" href="#experience">Experience</a>
            <a className="nav-extra" href="#questions">Questions</a>
            <Link href="/auth/login" className="nav-extra">Sign in</Link>
            <Link href="/auth/signup" className="cta dark">Enter VYBE <ArrowUpRight size={16} /></Link>
          </div>
        </nav>

        <section className="hero" id="top">
          <div>
            <span className="eyebrow">Your world · Your people · Your pace</span>
            <h1 className="display engraved">FEEL<br />THE <em>VYBE.</em></h1>
            <p>A space for genuine connection, community and experiences. Meet like-minded people, explore what matters to you and make the moments your own.</p>
            <div className="hero-actions">
              <Link href="/auth/signup" className="cta dark">Explore VYBE <ArrowRight size={19}/></Link>
              <a href="#discover" className="cta light">How it works <ArrowUpRight size={17}/></a>
            </div>
            <div className="hero-note"><i aria-hidden="true" /> Curiosity welcome. Respect required.</div>
          </div>

          <div className="console" aria-label="Illustration of VYBE's community experience">
            <div className="console-head"><span>VYBE / CONNECTION CONSOLE</span><b aria-hidden="true" /></div>
            <div className="console-screen">
              <div className="small">Now entering</div>
              <strong>YOUR KIND<br />OF COMMUNITY.</strong>
              <span>Discover more. Connect naturally.</span>
            </div>
            <div className="console-keys">
              <div className="console-key"><Compass aria-hidden="true"/><span>Explore</span></div>
              <div className="console-key"><MessageCircle aria-hidden="true"/><span>Connect</span></div>
              <div className="console-key"><CalendarDays aria-hidden="true"/><span>Events</span></div>
              <div className="console-key"><HeartHandshake aria-hidden="true"/><span>Community</span></div>
              <div className="console-key"><LockKeyhole aria-hidden="true"/><span>Boundaries</span></div>
              <div className="console-key"><Sparkles aria-hidden="true"/><span>Express</span></div>
            </div>
          </div>
        </section>
      </div>

      <section className="section" id="discover">
        <div className="container">
          <div className="eyebrow">01 / Discover VYBE</div>
          <h2 className="display section-title engraved">MADE FOR<br />REAL CONNECTION.</h2>
          <p className="section-lead">A fresh take on finding your circle. Everything has a purpose, from discovering new people to exploring events and starting conversations.</p>
          <div className="feature-grid">
            {features.map(({icon: Icon,title,text},i)=>(
              <article className="feature raised" key={title}>
                <div className="icon-frame"><Icon size={27} strokeWidth={1.6} aria-hidden="true"/></div>
                <div><div className="eyebrow">0{i+1} / VYBE</div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section journey" id="experience">
        <div className="container journey-grid">
          <div className="journey-stage pressed">
            <div className="profile-stack">
              <div className="eyebrow" style={{marginBottom:8}}>EXPERIENCE / 001</div>
              <div className="mini-row"><div className="dot"><UserRound size={19}/></div><div><strong>Find your circle</strong><small>Explore people with shared interests</small></div></div>
              <div className="mini-row"><div className="dot"><MessageCircle size={19}/></div><div><strong>Start a conversation</strong><small>Connect at your own pace</small></div></div>
              <div className="mini-row"><div className="dot"><CalendarDays size={19}/></div><div><strong>Discover experiences</strong><small>Find what’s happening around you</small></div></div>
              <div className="mini-row"><div className="dot"><ShieldCheck size={19}/></div><div><strong>Keep your boundaries</strong><small>Respect and choice come first</small></div></div>
            </div>
          </div>
          <div>
            <span className="eyebrow">02 / How it works</span>
            <h2 className="display section-title engraved">YOUR WORLD.<br />YOUR RULES.</h2>
            <p className="section-lead">VYBE brings discovery and conversation together, with space to move at a pace that feels right for you.</p>
            <div className="steps">
              <div className="step"><b>01</b><div><h3>Make your entrance</h3><p>Set up your account and choose how you want to show up.</p></div></div>
              <div className="step"><b>02</b><div><h3>Follow your interests</h3><p>Explore the people, experiences and communities that resonate.</p></div></div>
              <div className="step"><b>03</b><div><h3>Let connection happen</h3><p>Start a conversation or find an experience worth showing up for.</p></div></div>
            </div>
            <Link href="/auth/signup" className="cta dark" style={{marginTop:32}}>Get started <ArrowRight size={17}/></Link>
          </div>
        </div>
      </section>

      <section className="statement">
        <div className="container">
          <div className="eyebrow">03 / The point of it all</div>
          <h2 className="display">LESS NOISE.<br />MORE VYBE.</h2>
          <p>Not another place to perform for an audience. A place to explore who you are, meet people who understand you, and make connections that mean something.</p>
        </div>
      </section>

      <section className="section" id="questions">
        <div className="container">
          <div className="eyebrow">04 / Good to know</div>
          <h2 className="display section-title engraved">QUESTIONS?<br />WE GET IT.</h2>
          <p className="section-lead">The essentials, before you enter.</p>
          <div className="faq-list">
            <details><summary>What is VYBE?</summary><p>VYBE is a community-focused platform for discovering people, connecting through conversation, and exploring shared experiences and events.</p></details>
            <details><summary>How do I join?</summary><p>Use the Enter VYBE button to visit the registration flow. Availability may depend on the current site settings.</p></details>
            <details><summary>Can I browse existing features?</summary><p>Existing member areas include discovery, conversations and events. Access and available features depend on your account and the website’s current configuration.</p></details>
            <details><summary>What about privacy and safety?</summary><p>Read our privacy policy, terms and safety guidelines before participating. Respect other members’ boundaries and use the available reporting options when needed.</p></details>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="container">
          <span className="eyebrow">A different kind of connection</span>
          <h2 className="display engraved">FIND YOUR<br />FREQUENCY.</h2>
          <Link href="/auth/signup" className="cta dark">Enter VYBE <ArrowRight size={18}/></Link>
          <Link href="/auth/login" className="cta light">Already a member?</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-line">
            <span className="eyebrow" style={{color:"#bcbec5"}}>Beyond the ordinary</span>
            <div className="footer-links">
              <Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/safety">Safety</Link><Link href="/report">Report</Link><Link href="/auth/login">Sign in</Link>
            </div>
          </div>
          <div className="footer-wordmark" aria-label="VYBE">VYBE</div>
          <div className="footer-line footer-fine"><span>© {new Date().getFullYear()} VYBE</span><span>Find your people. Feel the VYBE.</span></div>
        </div>
      </footer>
    </main>
  );
}
