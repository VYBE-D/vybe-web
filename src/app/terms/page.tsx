"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Scale, ShieldAlert, ScrollText, AlertTriangle, Lock, Globe, CreditCard, ShieldCheck, Zap } from "lucide-react";

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-24 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* STICKY HEADER */}
        <header className="flex items-center justify-between mb-12 sticky top-0 bg-[#050505]/90 backdrop-blur-md py-4 z-50 border-b border-white/5">
          <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-red-600/20 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">Terms of Use</h1>
            <p className="text-[8px] text-red-600 font-bold uppercase tracking-[0.4em]">Protocol Version 2026.1</p>
          </div>
          <div className="w-10" />
        </header>

        <div className="space-y-12 text-zinc-400 text-sm leading-relaxed pb-32">
          
          {/* OVERVIEW */}
          <section className="space-y-4">
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Overview</h2>
            <p className="text-zinc-300 text-base">
              Welcome to vybe (“vybe”, “we”, “us”, or “our”). Vybe is a social networking platform for adults interested in exploring sexuality, intimacy, and alternative lifestyles in a consensual environment.
            </p>
            <p>
              These Terms of Use (“Terms and Conditions”) govern your access to and use of all vybe products, services, applications, features, and websites (collectively, the “Products and Services”). Unless explicitly stated otherwise, any current, updated, or new Products and Services provided by vybe are subject to these Terms and Conditions.
            </p>
            <p>
              Certain Products and Services offered through vybe may be governed by additional or separate agreements. In cases where no separate agreement applies, these Terms and Conditions shall govern. Vybe may also publish additional rules, guidelines, or policies applicable to specific areas of the platform, which are incorporated by reference into these Terms.
            </p>
          </section>

          {/* TABLE OF CONTENTS - VISUAL BREAK */}
          <div className="py-8 border-y border-white/5 my-10">
            <h3 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-6 flex items-center gap-2">
              <ScrollText size={14} className="text-red-600" /> Table of Contents
            </h3>
            <div className="columns-1 md:columns-2 gap-8 space-y-2 text-[10px] font-bold uppercase text-zinc-600 tracking-tighter">
              <p>1. Acceptance</p>
              <p>2. Conditions and Restrictions</p>
              <p>3. Registration and Privacy</p>
              <p>4. User Conduct</p>
              <p>5. Submitting a Report</p>
              <p>6. Media Participation</p>
              <p>7. License to User Content</p>
              <p>8. Payment and Refunds</p>
              <p>9. Third-Party Merchandise</p>
              <p>10. Profiles</p>
              <p>11. Disclaimer of Warranties</p>
              <p>12. Limitation of Liability</p>
              <p>13. Third-Party Content</p>
              <p>14. Storage</p>
              <p>15. Advertisers</p>
              <p>16. Intellectual Property</p>
              <p>17. Logos and Linking</p>
              <p>18. Indemnity and Release</p>
              <p>19. Limitation of Actions</p>
              <p>20. IP Notices</p>
              <p>21. Infringement Claims</p>
              <p>22. Arbitration & Law</p>
              <p>23. Changes to Services</p>
              <p>24. Merger</p>
              <p>25. Severability</p>
              <p>26. Relationship of Parties</p>
              <p>27. Assignment</p>
              <p>28. Successors</p>
              <p>29. Termination</p>
              <p>30. Communications</p>
              <p>31. Submission of Ideas</p>
              <p>32. Export Controls</p>
              <p>33. Contact Information</p>
              <p>34. Violations</p>
              <p>35. Additional Resources</p>
            </div>
          </div>

          {/* 1-5 CORE PROTOCOLS */}
          <section className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-white font-black uppercase italic tracking-widest text-lg flex items-center gap-3">
                <span className="text-red-600 text-2xl">01</span> Acceptance
              </h3>
              <p>By using any vybe Products and Services, you agree—without limitation or qualification—to be bound by these Terms and Conditions and all applicable rules, policies, and guidelines posted on vybe. All such materials are incorporated into these Terms by reference. This Agreement constitutes a legally binding contract between you and vybe.</p>
            </div>

            <div className="space-y-4 border-l-2 border-red-600 pl-6 bg-red-600/5 py-4 rounded-r-2xl">
              <h3 className="text-white font-black uppercase italic tracking-widest text-lg flex items-center gap-3">
                <span className="text-red-600 text-2xl">02</span> Conditions and Restrictions on Use
              </h3>
              <p>Vybe authorizes use of its Products and Services for personal, non-commercial purposes only. Users must be at least 18 years of age and legally permitted to access adult content in their jurisdiction. Vybe may require proof of age and may use automated systems, including image analysis, to detect potential violations. Accounts associated with underage access will be terminated.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-black uppercase italic tracking-widest text-lg flex items-center gap-3">
                <span className="text-red-600 text-2xl">03</span> Registration and Privacy
              </h3>
              <p>Some Products and Services require account registration. You agree that all registration information you provide is accurate, current, and complete. Vybe reserves the right to suspend or terminate accounts associated with false or misleading information. All registrations are the property of vybe and are subject to its Privacy Policy.</p>
            </div>

            <div className="space-y-4 bg-white/5 p-8 rounded-3xl">
              <h3 className="text-white font-black uppercase italic tracking-widest text-lg flex items-center gap-3">
                <span className="text-red-600 text-2xl">04</span> User Conduct
              </h3>
              <p className="text-zinc-200 font-bold uppercase text-[11px] tracking-widest mb-4">Prohibited conduct includes, but is not limited to:</p>
              <ul className="space-y-3 text-[12px] list-none font-medium">
                <li className="flex gap-3"><AlertTriangle size={14} className="text-red-600 shrink-0" /> Harassment, bullying, stalking, or threats.</li>
                <li className="flex gap-3"><AlertTriangle size={14} className="text-red-600 shrink-0" /> Content involving minors or sexualization of minors.</li>
                <li className="flex gap-3"><AlertTriangle size={14} className="text-red-600 shrink-0" /> Human trafficking or solicitation of illegal services.</li>
                <li className="flex gap-3"><AlertTriangle size={14} className="text-red-600 shrink-0" /> Non-consensual sharing of private content.</li>
                <li className="flex gap-3"><AlertTriangle size={14} className="text-red-600 shrink-0" /> Impersonation or misrepresentation.</li>
                <li className="flex gap-3"><AlertTriangle size={14} className="text-red-600 shrink-0" /> Unauthorized commercial activity or data scraping.</li>
              </ul>
            </div>
          </section>

          {/* 6-10 OPERATIONAL TERMS */}
          <section className="space-y-10 py-10">
            <div className="space-y-4 border-t border-white/5 pt-10">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">6. Media Participation</h3>
              <p className="italic text-zinc-400">By using vybe, you certify that you are not participating as a member of the media for investigative or reporting purposes without express written consent. All observations made within the vybe ecosystem must remain strictly confidential. Unauthorized reporting is a breach of contract.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">7. License to User Content</h3>
              <p>You retain ownership of content you post. By submitting content to vybe, you grant vybe a non-exclusive, worldwide, royalty-free license to host, display, modify, and distribute such content solely for operating the Products and Services. This license terminates 30 days after account deletion, except where retention is required by law.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs text-red-600">8. Payment and Refunds</h3>
              <p>Refund requests must be submitted within seven (7) days of purchase. Refund eligibility and payment method limitations apply. Certain payment methods (including crypto or certain digital assets) are final and non-refundable. Refunds are limited to one per user.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs text-zinc-200">10. Profiles</h3>
              <p>Profiles are subject to bandwidth limits, advertising placement, and these Terms. Vybe may remove or modify profile content at any time. You are responsible for all interactions initiated through your profile.</p>
            </div>
          </section>

          {/* 11-20 LEGAL PROTECTIONS (THE LONG PART) */}
          <section className="space-y-12 bg-white/5 p-8 rounded-[3rem] border border-white/5">
            <div className="space-y-4">
               <h3 className="text-red-600 font-black uppercase text-xs">11. Disclaimer of Warranties</h3>
               <p className="text-[11px] uppercase font-bold leading-relaxed">ALL PRODUCTS AND SERVICES ARE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, TO THE MAXIMUM EXTENT PERMITTED BY LAW. VYBE DISCLAIMS ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
            </div>

            <div className="space-y-4">
               <h3 className="text-red-600 font-black uppercase text-xs">12. Limitation of Liability</h3>
               <p className="text-[11px] uppercase font-bold leading-relaxed">VYBE SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM USE OR INABILITY TO USE THE PRODUCTS AND SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
            </div>

            <div className="space-y-4">
               <h3 className="text-white font-black uppercase text-xs">16. Intellectual Property</h3>
               <p>All vybe trademarks, software, and platform materials are protected by intellectual property laws. Unauthorized use, reverse engineering, or duplication of the interface, logic, or brand assets is strictly prohibited.</p>
            </div>

            <div className="space-y-4">
               <h3 className="text-white font-black uppercase text-xs">18. Indemnity and Release</h3>
               <p>You agree to indemnify and hold harmless vybe, its officers, directors, and employees from all claims, damages, and expenses arising from your use of the Products and Services or your violation of these Terms.</p>
            </div>

            <div className="space-y-4">
               <h3 className="text-white font-black uppercase text-xs">19. Limitation of Actions</h3>
               <p className="italic underline">Any claim or cause of action arising out of or related to use of vybe must be brought within one (1) year of accrual or be permanently barred.</p>
            </div>
          </section>

          {/* 21-35 DISPUTES & FINALITY */}
          <section className="space-y-10 pt-10">
            <div className="space-y-4">
               <h3 className="text-white font-bold uppercase tracking-widest text-xs">22. Arbitration, Governing Law, and Jurisdiction</h3>
               <p>All disputes shall be governed by applicable laws determined by vybe and resolved through binding arbitration, except where injunctive relief is permitted for intellectual property protection.</p>
            </div>

            <div className="space-y-4">
               <h3 className="text-white font-bold uppercase tracking-widest text-xs">29. Termination and Survival</h3>
               <p>These Terms remain in effect until terminated. Vybe may terminate your access immediately for breach. Provisions regarding liability, indemnity, and intellectual property shall survive termination.</p>
            </div>

            <div className="space-y-4">
               <h3 className="text-white font-bold uppercase tracking-widest text-xs">34. Violations</h3>
               <p>Vybe reserves the right to pursue all legal remedies, including civil litigation and criminal reporting, for violations of these Terms that compromise the safety of users or the integrity of the platform.</p>
            </div>

            {/* FINAL FOOTER STAMP */}
            <div className="pt-20 border-t border-white/5 text-center space-y-6">
              <div className="flex justify-center gap-4">
                <ShieldCheck size={30} className="text-zinc-800" />
                <Scale size={30} className="text-zinc-800" />
                <Zap size={30} className="text-zinc-800" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600">
                End of Protocol
              </p>
              <p className="text-[11px] font-black text-red-600 uppercase tracking-widest italic">
                © vybe — All Rights Reserved • 2026
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}