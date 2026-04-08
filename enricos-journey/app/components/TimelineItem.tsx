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

  // robust timeout loop (avoids setInterval closure issues)
  useEffect(() => {
    if (count <= 1) {
      console.log('TimelineItem: no rotation, count=', count);
      return;
    }

    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      timer = setTimeout(() => {
        if (!mounted) return;
        if (!hoverRef.current) {
          setIdx((i) => {
            const next = (i + 1) % count;
            console.log('TimelineItem: advancing', i, '->', next);
            return next;
          });
        } else {
          console.log('TimelineItem: paused by hover/focus');
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

  useEffect(() => {
    console.log('TimelineItem mount/update: files=', files, 'count=', count);
  }, [files, count]);

  return (
    <div className={`w-full max-w-[46%] ${side === 'right' ? 'text-right' : 'text-left'}`}>
      <div
        className="inline-block bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-md relative overflow-visible"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        onFocus={() => (hoverRef.current = true)}
        onBlur={() => (hoverRef.current = false)}
      >
        {/* visible index badge for debugging rotation */}
        {count > 1 && (
          <div className="absolute right-3 top-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded pointer-events-none z-50">
            {idx + 1} / {count}
          </div>
        )}
        <div className="w-full h-64 md:h-96 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
          <img
            src={`/images/${files[idx]}`}
            alt={caption}
            className="w-full h-full object-cover"
          />
        </div>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          <strong className="text-zinc-900 dark:text-zinc-100">{caption}</strong>
        </p>
      </div>
    </div>
  );
}
