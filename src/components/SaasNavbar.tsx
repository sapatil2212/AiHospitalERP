"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PURPLE = "#7C3AED";
const PURPLE_200 = "#DDD6FE";
const PURPLE_50 = "#F5F3FF";
const DARK = "#0F172A";
const GRAY = "#64748B";

/**
 * Marketing-site (SaaS) top navigation — matches the AiHospitalERPLanding header.
 * Links: Solutions · AI Rx · Features · Pricing · FAQ  +  Sign In / Free Trial.
 */
export default function SaasNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .mn-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 0 5%; transition: all 0.3s; font-family: 'Inter', sans-serif; }
        .mn-nav.scrolled { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); box-shadow: 0 1px 32px rgba(124,58,237,0.08); }
        .mn-nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 18px 0; }
        .mn-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .mn-nav-links { display: flex; align-items: center; gap: 32px; }
        .mn-nav-links a { font-size: 14px; font-weight: 500; color: ${GRAY}; text-decoration: none; transition: color 0.2s; }
        .mn-nav-links a:hover { color: ${PURPLE}; }
        .mn-nav-cta { display: flex; align-items: center; gap: 12px; }
        .mn-btn-ghost { padding: 6px 18px; font-size: 13px; font-weight: 600; color: ${PURPLE}; background: transparent; border: 1.5px solid ${PURPLE_200}; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; text-decoration: none; }
        .mn-btn-ghost:hover { background: ${PURPLE_50}; border-color: ${PURPLE}; }
        .mn-btn-free-trial { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 22px; font-size: 13px; font-weight: 600; color: #fff; background: #DC2626; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; text-transform: lowercase; letter-spacing: 0.05em; transition: all 0.2s; font-family: 'Inter', sans-serif; }
        .mn-btn-free-trial:hover { transform: translateY(-2px); background: #B91C1C; }
        .mn-burger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 8px; position: relative; z-index: 1001; }
        .mn-burger span { display: block; width: 24px; height: 2.5px; background: ${DARK}; border-radius: 2px; transition: all 0.3s ease; }
        .mn-burger.open span:nth-child(1) { transform: rotate(45deg) translateY(8px); }
        .mn-burger.open span:nth-child(2) { opacity: 0; transform: translateX(-10px); }
        .mn-burger.open span:nth-child(3) { transform: rotate(-45deg) translateY(-8px); }
        .mn-mobile-menu { position: fixed; top: 0; right: -100%; bottom: 0; width: 320px; max-width: 82vw; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); z-index: 1000; padding: 100px 24px 24px; display: flex; flex-direction: column; gap: 16px; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: -10px 0 40px rgba(0,0,0,0.05); }
        .mn-mobile-menu.open { right: 0; }
        .mn-mobile-menu a { font-size: 16px; font-weight: 600; color: ${DARK}; text-decoration: none; padding: 12px 16px; border-radius: 12px; transition: all 0.2s; }
        .mn-mobile-menu a:hover { background: #F8FAFC; color: ${PURPLE}; transform: translateX(4px); }
        .mn-mobile-menu-divider { height: 1px; background: linear-gradient(90deg, transparent, #F1F5F9, transparent); margin: 8px 0; }
        .mn-mobile-menu-buttons { display: flex; flex-direction: column; gap: 12px; padding: 0 16px; margin-top: auto; }
        .mn-mobile-menu-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.3); backdrop-filter: blur(4px); z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .mn-mobile-menu-backdrop.open { opacity: 1; pointer-events: auto; }
        @media (max-width: 900px) {
          .mn-nav-links, .mn-nav-cta { display: none; }
          .mn-burger { display: flex; }
        }
      ` }} />

      <nav className={`mn-nav${scrolled ? " scrolled" : ""}`}>
        <div className="mn-nav-inner">
          <Link href="/" className="mn-logo">
            <img src="/logo/aihospitalerp-logo.png" alt="AiHospitalERP" style={{ height: 38, width: "auto", objectFit: "contain" }} />
          </Link>

          <div className="mn-nav-links">
            <Link href="/#solutions">Solutions</Link>
            <Link href="/#ai-prescription">AI Rx</Link>
            <Link href="/#features">Features</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/#faq">FAQ</Link>
          </div>

          <div className="mn-nav-cta">
            <Link href="/login" className="mn-btn-ghost">Sign In</Link>
            <Link href="/signup" className="mn-btn-free-trial">free 14 days trial</Link>
          </div>

          <button className={`mn-burger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>

        <div className={`mn-mobile-menu-backdrop${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />

        <div className={`mn-mobile-menu${menuOpen ? " open" : ""}`}>
          <Link href="/#solutions" onClick={() => setMenuOpen(false)}>Solutions</Link>
          <Link href="/#ai-prescription" onClick={() => setMenuOpen(false)}>AI Rx</Link>
          <Link href="/#features" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/#pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/#faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
          <div className="mn-mobile-menu-divider" />
          <div className="mn-mobile-menu-buttons">
            <Link href="/login" className="mn-btn-ghost" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/signup" className="mn-btn-free-trial" onClick={() => setMenuOpen(false)}>Free Trial</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
