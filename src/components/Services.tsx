/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { servicesData } from '../data';
import { Layout, Cpu, Layers, ArrowRight, ShieldAlert, HeartHandshake } from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-5 h-5 text-orange-500" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-purple-400" />;
      default:
        return <Layout className="w-5 h-5 text-orange-500" />;
    }
  };

  const handleInquire = (serviceTitle: string) => {
    onSelectService(serviceTitle);
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="services" 
      className="relative py-28 bg-luxury-black border-t border-white/10 overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start gap-2 mb-16">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
            05 // PROFESSIONAL COLLABORATIONS
          </span>
          <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
            Consulting & Delivery
          </h2>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {servicesData.map((service) => (
            <div 
              key={service.id}
              className="group relative flex flex-col justify-between p-8 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl transition-all duration-300 hover:border-white/20"
            >
              
              {/* Top Details */}
              <div>
                
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
                  <div className="p-3 bg-zinc-950/40 border border-white/10 rounded-xl">
                    {getIcon(service.icon)}
                  </div>
                  <span className="font-mono text-[10px] font-extrabold tracking-widest text-orange-400 uppercase">
                    SERVICE MATRIX
                  </span>
                </div>

                <h3 className="font-sans text-xl md:text-2xl text-white font-bold tracking-tight mb-3.5 group-hover:text-orange-400 transition-colors uppercase italic">
                  {service.title}
                </h3>
                
                <p className="font-sans text-xs md:text-sm text-white/60 leading-relaxed mb-8 font-light">
                  {service.description}
                </p>

                {/* Physical Deliverables Checklist */}
                <div className="flex flex-col gap-3 mb-8">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase block">
                    DELIVERABLE STATUTES:
                  </span>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                      <span className="font-sans text-[11px] md:text-xs text-white/70 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Price & Action Footer */}
              <div className="mt-auto border-t border-white/5 pt-6">
                <div className="flex items-center justify-between mb-5 select-none font-mono">
                  <span className="text-[10px] text-white/40 font-bold uppercase">ESTIMATED INVESTMENT:</span>
                  <span className="text-sm font-extrabold text-white tracking-tight">{service.priceEstimate}</span>
                </div>

                <button
                  onClick={() => handleInquire(service.title)}
                  className="group w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 text-black p-3.5 rounded-xl font-mono text-[9px] font-extrabold tracking-widest transition-all duration-300 cursor-pointer uppercase shadow-2xl hover:scale-105"
                >
                  DISCUSS INQUIRY
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
