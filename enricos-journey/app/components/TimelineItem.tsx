'use client'

import { useEffect, useRef, useState } from 'react';

type Props = {
  files: string[];
  caption: string;
  side: 'left' | 'right';
};

export default function TimelineItem({ files, caption, side }: Props) {
  const [idx, setIdx] = useState(0);
  const count = files.length;
  const intervalMs = 4000;
  const hoverRef = useRef(false);

  // automatic slideshow using timeout loop
  useEffect(() => {
    if (count <= 1) return;

    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      timer = setTimeout(() => {
        if (!mounted) return;
        if (!hoverRef.current) {
          setIdx((i) => (i + 1) % count);
        }
        schedule();
      }, intervalMs);
    };

    schedule();

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [count]);

  return (
    <div className={`w-full ${side === 'right' ? 'text-right' : 'text-left'}`}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
      >
        <div className="w-full h-96 md:h-[60vh] relative bg-gray-50 dark:bg-zinc-800">
          {files.map((f, i) => (
            <img
              key={f}
              src={`/images/${f}`}
              alt={i === idx ? caption : ''}
              aria-hidden={i !== idx}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${i === idx ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>

        <div className="p-4 md:p-6">
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-snug">
            <strong className="block text-zinc-900 dark:text-zinc-50 mb-1">{caption}</strong>
            <span className="text-zinc-500 dark:text-zinc-400">Kurzer Begleittext oder Datum — ergänze mit Sidecar-Datei.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
