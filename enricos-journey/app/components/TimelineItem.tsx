'use client'

import { useState } from 'react';

type Props = {
  files: string[];
  caption: string;
  side: 'left' | 'right';
};

export default function TimelineItem({ files, caption, side }: Props) {
  const [idx, setIdx] = useState(0);
  const count = files.length;

  function prev() {
    setIdx((i) => (i - 1 + count) % count);
  }
  function next() {
    setIdx((i) => (i + 1) % count);
  }

  return (
    <div className={`w-full max-w-[46%] ${side === 'right' ? 'text-right' : 'text-left'}`}>
      <div className="inline-block bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-md relative overflow-visible">
        <img
          src={`/images/${files[idx]}`}
          alt={caption}
          // allow clicks to reach the overlay buttons
          className="w-full h-auto rounded-md object-cover relative z-10 pointer-events-none"
        />

        {count > 1 && (
          <>
            {/* large transparent hit areas on left/right so clicks register easily */}
            <button
              type="button"
              onClick={prev}
              aria-label="Vorheriges Bild"
              className="absolute left-0 inset-y-0 w-16 flex items-center justify-center z-40 pointer-events-auto"
              title="Vorheriges"
            >
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-700 text-lg shadow">
                ◀
              </span>
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Nächstes Bild"
              className="absolute right-0 inset-y-0 w-16 flex items-center justify-center z-40 pointer-events-auto"
              title="Nächstes"
            >
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-700 text-lg shadow">
                ▶
              </span>
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded z-40 pointer-events-none">
              {idx + 1} / {count}
            </div>
          </>
        )}

        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          <strong className="text-zinc-900 dark:text-zinc-100">{caption}</strong>
        </p>
      </div>
    </div>
  );
}
