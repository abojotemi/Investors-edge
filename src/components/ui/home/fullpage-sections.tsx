"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FullPageSectionsProps {
  children: React.ReactNode[];
  sectionNames?: string[];
}

const sectionVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.95,
  }),
};

const FullPageSections = ({
  children,
  sectionNames = [],
}: FullPageSectionsProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSections = React.Children.count(children);
  const childrenArray = React.Children.toArray(children);

  const goToSection = useCallback(
    (index: number) => {
      if (isAnimating || index < 0 || index >= totalSections) return;

      setIsAnimating(true);
      setDirection(index > currentSection ? 1 : -1);
      setCurrentSection(index);

      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    },
    [isAnimating, totalSections, currentSection]
  );

  const goToNextSection = useCallback(() => {
    if (currentSection < totalSections - 1) {
      goToSection(currentSection + 1);
    }
  }, [currentSection, totalSections, goToSection]);

  const goToPrevSection = useCallback(() => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }, [currentSection, goToSection]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToNextSection();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevSection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSection, goToPrevSection]);

  // Reference to the current section's scrollable container
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle mouse wheel - only navigate when at scroll boundaries
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;

      const section = sectionRef.current;
      if (!section) return;

      const { scrollTop, scrollHeight, clientHeight } = section;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      // Only navigate if at boundaries
      if (e.deltaY > 0 && isAtBottom) {
        e.preventDefault();
        goToNextSection();
      } else if (e.deltaY < 0 && isAtTop) {
        e.preventDefault();
        goToPrevSection();
      }
      // Otherwise, allow normal scrolling within the section
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isAnimating, goToNextSection, goToPrevSection]);

  // Handle touch events for mobile - only navigate when at scroll boundaries
  useEffect(() => {
    let touchStartY = 0;
    let touchStartScrollTop = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      const section = sectionRef.current;
      if (section) {
        touchStartScrollTop = section.scrollTop;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      const section = sectionRef.current;

      if (!section) return;

      const { scrollTop, scrollHeight, clientHeight } = section;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      // Only navigate if swipe is significant and at boundaries
      if (Math.abs(diff) > 80) {
        if (diff > 0 && isAtBottom) {
          // Swiping up at bottom - go to next section
          goToNextSection();
        } else if (diff < 0 && isAtTop && touchStartScrollTop <= 0) {
          // Swiping down at top - go to previous section
          goToPrevSection();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isAnimating, goToNextSection, goToPrevSection]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-background"
    >
      {/* Animated Section Container */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSection}
          ref={sectionRef}
          custom={direction}
          variants={sectionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className="absolute inset-0 h-screen w-full overflow-y-auto overscroll-contain"
        >
          {childrenArray[currentSection]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {Array.from({ length: totalSections }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSection(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "group relative w-3 h-3 rounded-full transition-all duration-300",
              currentSection === index
                ? "bg-primary-orange scale-125"
                : "bg-gray-300 hover:bg-primary-orange/50"
            )}
            aria-label={`Go to section ${sectionNames[index] || index + 1}`}
          >
            {/* Tooltip */}
            <span className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {sectionNames[index] || `Section ${index + 1}`}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Navigation Arrows - positioned on bottom right to avoid blocking content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      >
        {/* Up Arrow */}
        <motion.button
          onClick={goToPrevSection}
          disabled={currentSection === 0}
          whileHover={currentSection !== 0 ? { scale: 1.1 } : {}}
          whileTap={currentSection !== 0 ? { scale: 0.95 } : {}}
          className={cn(
            "p-2 rounded-full bg-white/90 shadow-lg border border-gray-200 transition-all duration-300",
            currentSection === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-primary-green hover:text-white"
          )}
          aria-label="Previous section"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>

        {/* Section indicator */}
        <motion.div
          key={currentSection}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="px-3 py-1.5 bg-white/90 rounded-full shadow-lg border border-gray-200"
        >
          <span className="text-sm font-medium text-gray-700">
            {currentSection + 1} / {totalSections}
          </span>
        </motion.div>

        {/* Down Arrow */}
        <motion.button
          onClick={goToNextSection}
          disabled={currentSection === totalSections - 1}
          whileHover={
            currentSection !== totalSections - 1 ? { scale: 1.1 } : {}
          }
          whileTap={currentSection !== totalSections - 1 ? { scale: 0.95 } : {}}
          className={cn(
            "p-2 rounded-full bg-white/90 shadow-lg border border-gray-200 transition-all duration-300",
            currentSection === totalSections - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-primary-green hover:text-white"
          )}
          aria-label="Next section"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Scroll hint on first section - positioned at bottom center */}
      <AnimatePresence>
        {currentSection === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center gap-1 text-gray-400"
            >
              <span className="text-xs font-medium">Scroll to explore</span>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FullPageSections;
