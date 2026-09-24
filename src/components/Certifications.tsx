/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { certificationsData } from '../data';
import { Award, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Certifications() {
  return (
    <section 
      id="certifications" 
      className="relative py-28 bg-luxury-black border-t border-white/10 overflow-hidden bg-grid-pattern"
    >
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[250px] h-[250px] bg-orange-600/5 rounded-full blur-[80px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start gap-2 mb-16">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
            06 // GLOBAL RECOGNITION
          </span>
          <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
            Credentials & Certifications
          </h2>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificationsData.map((cert) => (
            <div 
              key={cert.id}
              className="group relative flex flex-col justify-between p-6 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl transition-all duration-300 hover:border-white/20 shadow-2xl"
            >
              <div>
                
                {/* Header issuer info */}
                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono font-extrabold tracking-widest text-white/40 uppercase">ISSUER</span>
                    <span className="text-xs font-semibold text-white mt-0.5">{cert.issuer}</span>
                  </div>
                  <Award className="w-4 h-4 text-orange-400 opacity-80" />
                </div>

                {/* Title */}
                <h3 className="font-sans text-xs md:text-sm font-bold text-white group-hover:text-orange-400 transition-colors leading-snug mb-3 uppercase italic">
                  {cert.title}
                </h3>

                <p className="font-mono text-[9px] text-white/40">
                  DATE: <span className="text-white/60">{cert.date}</span>
                </p>

                <p className="font-mono text-[9px] text-white/40 mt-1">
                  ID: <span className="text-white/60">{cert.credentialId}</span>
                </p>

              </div>

              {/* Verified Badge Footer */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> SECURE_VERIFIED
                </span>

                <a
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 border border-white/10 rounded-full text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label={`Verify credential for ${cert.title}`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
