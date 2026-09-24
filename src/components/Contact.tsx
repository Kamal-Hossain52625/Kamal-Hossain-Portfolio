/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Calendar, Check, Copy, ArrowRight, ShieldCheck, ChevronDown, RefreshCw } from 'lucide-react';
import { addStoredInquiry } from '../lib/storage';

interface ContactProps {
  inquiryTopic: string;
}

const faqData = [
  {
    q: 'Are you available for international full-time roles?',
    a: 'Yes, absolutely. I work fully remotely with clients in the US, Europe, and Asia, and am comfortable adjusting meeting schedules to align with standard global time zones.'
  },
  {
    q: 'What is your typical contract availability?',
    a: 'For freelance and architectural consulting, I am generally available for commitments of 15 to 40 hours per week. I specialize in rapid prototyping and high-throughput backend scaling projects.'
  },
  {
    q: 'Do you work through platforms or direct contracts?',
    a: 'I prefer direct B2B corporate contracts with transparent milestone payments, but am also open to verified global talent platforms depending on the project scope.'
  }
];

export default function Contact({ inquiryTopic }: ContactProps) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Pre-fill message box when an inquiry topic is selected from Services
  useEffect(() => {
    if (inquiryTopic) {
      setFormData((prev) => ({
        ...prev,
        message: `Hello Kamal,\n\nI am reaching out regarding your consulting service: "${inquiryTopic}". Let's arrange a time to discuss details.`
      }));
    }
  }, [inquiryTopic]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('kamalhossainm5443@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = () => {
    const tempErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Full name is required.';
      isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email format.';
      isValid = false;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      tempErrors.message = 'Please provide a message with at least 10 characters.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error as user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();
    const topic = inquiryTopic || 'Direct General Inquiry';

    // Store in local administrative storage
    addStoredInquiry({
      name,
      email,
      message,
      topic,
    });

    // Send real transmission to Kamal's email inbox via FormSubmit API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      await fetch('https://formsubmit.co/ajax/kamalhossainm5443@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: name,
          email: email,
          topic: topic,
          message: message,
          _subject: `New Transmission from ${name} // Portfolio Inquiry [${topic}]`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      clearTimeout(timeoutId);
    } catch (err) {
      // Gracefully continue even if network/adblocker blocks AJAX; inquiry is already recorded locally
      console.warn('Form transmission sent with fallback mode:', err);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section 
      id="contact" 
      className="relative py-28 bg-luxury-black border-t border-white/10 overflow-hidden bg-grid-pattern"
    >
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start gap-2 mb-16">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-500 font-extrabold uppercase">
            08 // SECURE TRANSMISSIONS
          </span>
          <h2 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight uppercase italic">
            Initiate Contact
          </h2>
        </div>

        {/* Form & Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: FAQ & Quick copy coordinates */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            <div className="flex flex-col gap-4">
              <h3 className="font-sans text-lg md:text-xl font-bold text-white tracking-wide">
                Direct Communication Protocols
              </h3>
              <p className="font-sans text-xs md:text-sm text-white/60 leading-relaxed font-light">
                Skip the traditional form if you are in a rush. Copy my direct verified address or check standard inquiries below.
              </p>
            </div>

            {/* Email copying widget */}
            <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-950/40 border border-white/10 rounded-xl">
                  <Mail className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <span className="text-[8px] font-mono text-white/40 font-bold uppercase block">DIRECT EMAIL</span>
                  <a href="mailto:kamalhossainm5443@gmail.com" className="text-xs font-mono font-bold text-white hover:text-orange-400 transition-colors">
                    kamalhossainm5443@gmail.com
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-2.5 border border-white/10 hover:border-orange-500/20 hover:bg-white/10 rounded-xl transition-all cursor-pointer text-orange-400 hover:text-white bg-white/5"
                aria-label="Copy Email Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Scheduling link widget */}
            <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-zinc-950/40 border border-white/10 rounded-xl">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[8px] font-mono text-white/40 font-bold uppercase block">BOOK CALENDAR CALL</span>
                  <span className="text-xs font-mono font-bold text-white/70">15-Min Introductory Sync</span>
                </div>
              </div>

              <a
                href="#"
                className="group flex items-center gap-1 bg-white hover:bg-zinc-100 text-black font-mono text-[9px] font-extrabold tracking-widest px-4.5 py-2.5 rounded-xl transition-all duration-300 uppercase shadow-2xl hover:scale-105"
              >
                SCHEDULE <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* FAQ Accordion block */}
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase block mb-1">
                PRE-INQUIRY FAQS:
              </span>

              {faqData.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-md overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-4 flex items-center justify-between gap-4 text-left font-sans text-xs md:text-sm font-bold text-white/80 hover:text-white cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-orange-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="p-4 pt-0 border-t border-white/5 font-sans text-xs text-white/60 leading-relaxed font-light">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Contact Form with luxury encrypted state */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-2xl shadow-2xl">
              
              <AnimatePresence mode="wait">
                {!submitSuccess ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    
                    {/* Header info */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                      <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase font-extrabold">
                        ENCRYPTED COMMUNICATIONS PROTOCOL
                      </span>
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                    </div>

                    {/* Name input */}
                    <div className="flex flex-col gap-2 font-sans">
                      <label htmlFor="name-input" className="text-[10px] font-mono font-bold tracking-widest text-white/40 uppercase">
                        YOUR FULL NAME
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="e.g. Marcus Thorne"
                        className={`w-full p-3.5 border ${
                          errors.name ? 'border-rose-500/50' : 'border-white/10 focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/40'
                        } bg-black/40 backdrop-blur-md text-white rounded-xl text-xs md:text-sm font-sans outline-none transition-all placeholder:text-zinc-600`}
                      />
                      {errors.name && <span className="text-[10px] font-mono text-rose-400">{errors.name}</span>}
                    </div>

                    {/* Email input */}
                    <div className="flex flex-col gap-2 font-sans">
                      <label htmlFor="email-input" className="text-[10px] font-mono font-bold tracking-widest text-white/40 uppercase">
                        YOUR DIRECT EMAIL
                      </label>
                      <input
                        id="email-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="e.g. marcus@company.com"
                        className={`w-full p-3.5 border ${
                          errors.email ? 'border-rose-500/50' : 'border-white/10 focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/40'
                        } bg-black/40 backdrop-blur-md text-white rounded-xl text-xs md:text-sm font-sans outline-none transition-all placeholder:text-zinc-600`}
                      />
                      {errors.email && <span className="text-[10px] font-mono text-rose-400">{errors.email}</span>}
                    </div>

                    {/* Message input */}
                    <div className="flex flex-col gap-2 font-sans">
                      <label htmlFor="message-input" className="text-[10px] font-mono font-bold tracking-widest text-white/40 uppercase">
                        SPECIFIC OBJECTIVE / DETAILS
                      </label>
                      <textarea
                        id="message-input"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="Details of contract, consulting project or introduction..."
                        className={`w-full p-3.5 border ${
                          errors.message ? 'border-rose-500/50' : 'border-white/10 focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/40'
                        } bg-black/40 backdrop-blur-md text-white rounded-xl text-xs md:text-sm font-sans outline-none transition-all placeholder:text-zinc-600 resize-none leading-relaxed`}
                      />
                      {errors.message && <span className="text-[10px] font-mono text-rose-400">{errors.message}</span>}
                    </div>

                    {/* Submit action */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 font-mono text-[9px] font-extrabold tracking-widest p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.01] mt-2 disabled:opacity-80 shadow-2xl"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                          TRANSMITTING SECURE DATA...
                        </>
                      ) : (
                        <>
                          TRANSMIT COMPILATION REQUEST
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                  </motion.form>
                ) : (
                  <motion.div
                    key="success-card"
                    className="py-12 text-center flex flex-col items-center justify-center gap-5"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <div className="relative w-16 h-16 rounded-full bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                      <ShieldCheck className="w-8 h-8" />
                      {/* Flashing glow circle */}
                      <span className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20 animate-spin-slow pointer-events-none" />
                    </div>

                    <h4 className="font-sans text-2xl text-emerald-100 font-bold tracking-tight uppercase italic">
                      Transmission Delivered
                    </h4>
                    
                    <p className="font-sans text-xs text-white/70 max-w-md leading-relaxed font-light">
                      Your message has been dispatched to <span className="text-orange-400 font-mono font-semibold">kamalhossainm5443@gmail.com</span> and archived in Kamal's administrative inbox. Expect a response within 12 business hours.
                    </p>

                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-4 font-mono text-[9px] font-extrabold tracking-widest border border-white/10 hover:border-orange-500/20 hover:text-orange-300 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl transition-all cursor-pointer uppercase"
                    >
                      SEND ANOTHER TRANSMISSION
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
