/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [hoveredType, setHoveredType] = useState<'default' | 'link' | 'project' | 'interactive'>('default');
  const [isVisible, setIsVisible] = useState(false);

  // Position motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for fluid lag follow
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    // Event listeners to detect hovers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const closestLink = target.closest('a, button, [role="button"]');
      const closestProject = target.closest('[data-cursor="project"]');
      const closestInteractive = target.closest('[data-cursor="interactive"]');

      if (closestProject) {
        setHoveredType('project');
      } else if (closestInteractive) {
        setHoveredType('interactive');
      } else if (closestLink) {
        setHoveredType('link');
      } else {
        setHoveredType('default');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Dynamic Main Glow Blob */}
      <motion.div
        id="custom-cursor-glow"
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hoveredType === 'project' ? 2.5 : hoveredType === 'link' ? 1.5 : hoveredType === 'interactive' ? 1.2 : 0.6,
          backgroundColor: hoveredType === 'project' ? 'rgba(255, 255, 255, 1)' : hoveredType === 'link' ? 'rgba(197, 168, 128, 1)' : 'rgba(255, 255, 255, 0.95)',
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      >
        {hoveredType === 'project' && (
          <span className="text-[6px] tracking-widest text-black font-mono font-bold uppercase select-none">
            VIEW
          </span>
        )}
      </motion.div>

      {/* Large luxury outer ring following the mouse (creates depth) */}
      <motion.div
        id="custom-cursor-ring"
        className="fixed top-0 left-0 border border-gold-500/25 rounded-full pointer-events-none z-45"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          width: 48,
          height: 48,
        }}
        animate={{
          scale: hoveredType === 'project' ? 1.8 : hoveredType === 'link' ? 1.4 : hoveredType === 'interactive' ? 0.3 : 1,
          opacity: hoveredType === 'interactive' ? 0 : 0.6,
          borderColor: hoveredType === 'link' ? 'rgba(197, 168, 128, 0.6)' : 'rgba(197, 168, 128, 0.25)',
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      />
    </>
  );
}
