'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { ReactNode } from 'react';

interface StatCounterProps {
  label: string;
  value: number;
  icon: ReactNode;
  suffix?: string;
  color?: string;
}

export default function StatCounter({ label, value, icon, suffix = '', color = 'var(--color-emerald-400)' }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const startTime = performance.now();

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out-expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * end);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center sm:justify-start gap-4 p-4"
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(0, 106, 78, 0.1)', color: 'var(--color-emerald-800)' }}>
        {icon}
      </div>
      <div className="flex flex-col text-left">
        <span
          className="text-2xl font-bold leading-none mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-900)' }}
        >
          {count}{suffix}
        </span>
        <span
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}
