/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { experienceData } from '../data';
import { Calendar, MapPin, Briefcase, ChevronRight, GraduationCap } from 'lucide-react';

export default function Experience() {
  return (
    <section 
      id="experience" 
      className="relative py-28 bg-luxury-black border-t border-white/10 overflow-hidden bg-grid-pattern"
    >
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start gap-2 mb-16">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
            04 // PROFESSIONAL CHRONICLE
          </span>
          <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
            Journey & Impact
          </h2>
        </div>

        {/* Timeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Team Leadership manifesto */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="font-sans text-lg md:text-xl font-bold text-white tracking-wide">
              Engineering Leadership & Agile Stewardship
            </h3>
            
            <p className="font-sans text-xs md:text-sm text-white/60 leading-relaxed tracking-wide font-light">
              Great software engineering isn’t just about writing code. It’s about aligned architecture, transparent team communications, automated testing coverage, and strict delivery discipline.
            </p>

            <p className="font-sans text-xs md:text-sm text-white/60 leading-relaxed tracking-wide font-light">
              I collaborate with tech leads, design directors, and startup founders to craft strategic roadmap goals. My background allows me to lead development sprints, structure CI/CD environments, and mentor junior colleagues successfully.
            </p>

            {/* Quick stats board */}
            <div className="p-5 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl flex flex-col gap-4 mt-2 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono text-white/40 uppercase">Lead Roles</span>
                <span className="text-xs font-semibold text-orange-400">Zenith, Nexus Lab</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono text-white/40 uppercase">Test Coverage Target</span>
                <span className="text-xs font-semibold text-emerald-400">95% Standard</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/40 uppercase">Continuous Deployment</span>
                <span className="text-xs font-mono text-white font-light">Docker / Github Actions</span>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline nodes */}
          <div className="lg:col-span-8 relative flex flex-col gap-10">
            {/* Middle connecting track line */}
            <div className="absolute left-[17px] top-2 bottom-2 w-[1px] bg-white/10" />

            {experienceData.map((exp, idx) => (
              <div 
                key={exp.id} 
                className="relative pl-12 group"
              >
                {/* Visual Circle Node anchor */}
                <div className="absolute left-[8px] top-1.5 w-5 h-5 rounded-full border-2 border-orange-500 bg-[#0c0c0e] z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125">
                  <Briefcase className="w-2.5 h-2.5 text-orange-400" />
                </div>

                {/* Main Card */}
                <div className="p-6 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl">
                  
                  {/* Title Area */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4 mb-4">
                    <div>
                      <h4 className="font-sans text-base md:text-lg font-bold text-white tracking-wide group-hover:text-orange-400 transition-colors uppercase italic">
                        {exp.role}
                      </h4>
                      <p className="font-sans text-xs text-orange-400 font-semibold flex items-center gap-1.5 mt-1">
                        {exp.company}
                        <span className="text-white/20 font-normal">|</span>
                        <span className="text-white/40 font-normal flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {exp.location}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1 font-mono text-[9px]">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 rounded-full font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-orange-400" /> {exp.period}
                      </span>
                      <span className="text-white/40 font-semibold uppercase tracking-wider mt-1 mr-2 font-mono">
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  {/* Bullet Achievements */}
                  <div className="flex flex-col gap-3 font-sans text-xs md:text-sm text-white/60 mb-6 leading-relaxed font-light">
                    {exp.description.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5">
                        <ChevronRight className="w-3.5 h-3.5 text-orange-500 mt-1 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies Integrated */}
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
                    <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase font-bold mr-1">
                      INTEGRATED:
                    </span>
                    {exp.skillsLearned.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2.5 py-0.5 rounded-full border border-white/10 text-[8.5px] font-mono text-white/50 bg-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
