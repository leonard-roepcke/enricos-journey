'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type Props = {
  files: string[];
  caption: string;
  description?: string;
  side: 'left' | 'right';
};

const isVideoFile = (f: string) => /\.(mp4|webm|ogg|m4v)$/i.test(f);

export default function TimelineItem({ files, caption, description, side }: Props) {
  const firstVideoIndex = files.findIndex(isVideoFile);
  const [idx, setIdx] = useState(() => (firstVideoIndex >= 0 ? firstVideoIndex : 0));
  const count = files.length;
  const intervalMs = 4000;
  const hoverRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to video elements so we can play/pause when the active index changes
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const schedule = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!hoverRef.current) {
        setIdx((i) => (i + 1) % count);
      }
      schedule();
    }, intervalMs);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [count, schedule]);

  // When active index changes, make sure any active video plays and others are paused
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) {
        // attempt to play the active video (may be blocked without user gesture)
        v.muted = true; // muted to increase chance of autoplay working
        v.playsInline = true;
        v.loop = true;
        v.play().catch(() => {
          // ignore: autoplay might be blocked, user can use controls
        });
      } else {
        v.pause();
        try {
          v.currentTime = 0;
        } catch (e) {
          /* ignore */
        }
      }
    });
  }, [idx]);

  const handleMouseLeave = () => {
    hoverRef.current = false;
    if (count > 1) schedule(); // Timer nach Hover neu starten
  };

  // Description kürzen, wenn Caption doppelt ist
  const trimmedDesc = description?.trim() ?? '';
  let descToShow = '';
  if (trimmedDesc) {
    const lines = trimmedDesc.split(/\r?\n/);
    const firstNonEmpty = lines.find((l) => l.trim().length > 0) || '';
    if (firstNonEmpty && firstNonEmpty.trim() === caption.trim()) {
      const escaped = firstNonEmpty.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      descToShow = trimmedDesc.replace(new RegExp('^' + escaped + '\\s*\\n?'), '').trim();
    } else {
      descToShow = trimmedDesc;
    }
  }

  return (
    <div className={`w-full ${side === 'right' ? 'text-right' : 'text-left'}`}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Bild-/Video-Container: contain statt cover damit nichts abgeschnitten wird */}
        <div className="w-full h-96 md:h-[60vh] relative bg-gray-50 dark:bg-zinc-800">
          {files.map((f, i) => {
            const isVideo = isVideoFile(f);
            if (isVideo) {
              return (
                <video
                  key={f}
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={f}
                  aria-hidden={i !== idx ? 'true' : 'false'}
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                    i === idx ? 'opacity-100' : 'opacity-0'
                  }`}
                  controls
                  playsInline
                  muted
                  autoPlay
                  loop
                  preload="auto"
                  onLoadedData={() => {
                    // ensure autoplay starts when ready for the active video
                    if (i === idx) {
                      try {
                        videoRefs.current[i]?.play().catch(() => {});
                      } catch (e) {
                        /* ignore */
                      }
                    }
                  }}
                />
              );
            }

            return (
              <img
                key={f}
                src={f}
                alt={i === idx ? caption : ''}
                aria-hidden={i !== idx ? 'true' : 'false'}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                  i === idx ? 'opacity-100' : 'opacity-0'
                }`}
              />
            );
          })}

          {/* Dot-Navigation bei mehreren Bildern/Videos */}
          {count > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {files.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Element ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i === idx ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 md:p-6">
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-snug">
            <strong className="block text-zinc-900 dark:text-zinc-50 mb-1">{caption}</strong>
            {descToShow ? (
              <span className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{descToShow}</span>
            ) : (
              <span className="text-zinc-500 dark:text-zinc-400">
                Kurzer Begleittext oder Datum — ergänze mit Sidecar-Datei.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}