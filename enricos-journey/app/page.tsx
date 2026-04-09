'use client';

import TimelineItem from './components/TimelineItem';

const basePath = '/enricos-journey';

// Bildordner manuell definieren
const imagesData = [
  {
    folder: '2',
    caption: 'Te to',
    description: 'hu hu',
    files: ['enricos-mega.jpg'],
  },
  {
    folder: '3',
    caption: 'tu tu',
    description: 'HI bo',
    files: ['enricos-mega.jpg'],
  },
  // weitere Ordner hier hinzufügen
];

// Wandelt Ordner + Dateien in vollständige URLs um
const images = imagesData.map((item) => ({
  caption: item.caption,
  description: item.description,
  file: item.files.map((f) => `${basePath}/images/${item.folder}/${f}`),
}));

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Enricos Journey</h1>
        </header>

        <section className="relative">
          {/* vertikale Linie */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none">
            <div className="w-1 h-full bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto" />
          </div>

          <div className="relative">
            {images.length === 0 ? (
              <div className="py-24 text-center text-zinc-600 dark:text-zinc-400">Keine Bilder vorhanden.</div>
            ) : (
              <div className="mt-3.75">
                {images.map((item, idx) => {
                  const side = idx % 2 === 0 ? 'left' : 'right';
                  return (
                    <div key={item.file[0]} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 -mt-15 first:mt-0">
                      <div className={`flex ${side === 'left' ? 'justify-end pr-6' : 'justify-start pr-6'}`}>
                        {side === 'left' && (
                          <TimelineItem files={item.file} caption={item.caption} description={item.description} side={side} />
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="w-6 h-6 bg-white dark:bg-zinc-900 border-4 border-zinc-100 dark:border-zinc-900 rounded-full shadow-md" />
                      </div>

                      <div className={`flex ${side === 'right' ? 'justify-start pl-6' : 'justify-end pl-6'}`}>
                        {side === 'right' && (
                          <TimelineItem files={item.file} caption={item.caption} description={item.description} side={side} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}