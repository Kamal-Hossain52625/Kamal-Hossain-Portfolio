/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown } from 'lucide-react';

interface ScrollDownButtonProps {
  threshold?: number;
}

export default function ScrollDownButton({ threshold = 200 }: ScrollDownButtonProps) {
  const [isNearBottom, setIsNearBottom] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Detect if user has initiated scroll or is near bottom
      setHasScrolled(scrollY > 50);

      // Hide when user reaches within 250px of the footer bottom
      const distanceToBottom = documentHeight - (scrollY + windowHeight);
      setIsNearBottom(distanceToBottom <= 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToBottom = () => {
    // Scroll completely to the bottom of the page (similar to Footer's scroll-to-top)
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  // Only show when not at the very bottom
  const isVisible = !isNearBottom;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40"
        >
          {/* Continuous Up-Down Floating/Bobbing animation */}
          <motion.button
            onClick={handleScrollToBottom}
            animate={{
              y: [0, -9, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Scroll to Bottom"
            title="Scroll to Bottom"
            className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0d0e12]/90 hover:bg-[#14161f] text-orange-400 hover:text-white border border-orange-500/40 hover:border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] backdrop-blur-md cursor-pointer transition-colors"
          >
            {/* Ambient pulse ring */}
            <span className="absolute -inset-1 rounded-full bg-orange-500/20 blur-sm animate-pulse pointer-events-none" />

            {/* Glowing inner ring */}
            <span className="absolute inset-0 rounded-full border border-orange-400/20 group-hover:border-orange-400/40 transition-colors pointer-events-none" />

            {/* Arrow icon with subtle hover micro-bounce */}
            <div className="relative flex flex-col items-center justify-center">
              <ArrowDown className="w-5 h-5 md:w-6 md:h-6 stroke-[2.25] text-orange-400 group-hover:text-white transition-colors group-hover:translate-y-0.5 duration-200" />
            </div>

            {/* Optional subtle tooltip on hover */}
            <span className="absolute right-full mr-3.5 px-2.5 py-1 rounded bg-[#0b0c10] border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg hidden md:block">
              Scroll to Bottom
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
