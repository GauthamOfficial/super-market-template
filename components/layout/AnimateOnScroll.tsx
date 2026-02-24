"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  /** Optional delay before animation starts (ms). */
  delay?: number;
  /** Root margin for Intersection Observer (e.g. "0px 0px -80px" to trigger when 80px from bottom of viewport). */
  rootMargin?: string;
  /** Fraction of element that must be visible to trigger (0–1). */
  threshold?: number;
  className?: string;
}

/**
 * Wraps content and animates it (fade-in + slide-up) when it scrolls into view.
 * Respects prefers-reduced-motion.
 */
export function AnimateOnScroll({
  children,
  delay = 0,
  rootMargin = "0px 0px -40px 0px",
  threshold = 0.1,
  className,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = setTimeout(() => setVisible(true), delay);
          } else {
            setVisible(true);
          }
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [rootMargin, threshold, delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "animate-on-scroll min-w-0",
        visible && "is-visible",
        className
      )}
      style={delay && visible ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
