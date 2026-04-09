'use client';
import TimelineItem from './components/TimelineItem';

const basePath = '/enricos-journey';

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
  {
    folder: 'image-1',
    caption: 'tu tu',
    description: 'HI bo',
    files: ['enricos-mega.jpg', 'IMG-20260403-WA0001.jpg'],
  },
];

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
          {/* Vertikale Linie – auf Mobile zentriert links, auf Desktop mittig */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 pointer-events-none">
            <div className="w-1 h-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>

          <div className="relative">
            {images.length === 0 ? (
              <div className="py-24 text-center text-zinc-600 dark:text-zinc-400">
                Keine Bilder vorhanden.
              </div>
            ) : (
              <div className="flex flex-col gap-12">
                {images.map((item, idx) => {
                  const side = idx % 2 === 0 ? 'left' : 'right';
                  return (
                    <div key={item.file[0]}>
                      {/* Mobile: alle Einträge untereinander, zentriert */}
                      <div className="flex md:hidden items-start gap-4 pl-14">
                        <div className="absolute left-4 w-5 h-5 bg-white dark:bg-zinc-900 border-4 border-zinc-300 dark:border-zinc-700 rounded-full shadow-md mt-2" />
                        <div className="w-[80vw]">
                          <TimelineItem
                            files={item.file}
                            caption={item.caption}
                            description={item.description}
                            side="left"
                          />
                        </div>
                      </div>

                      {/* Desktop: Links/Rechts abwechselnd */}
                      <div className="hidden md:grid md:grid-cols-[1fr_2rem_1fr] items-start gap-4">
                        <div className="flex justify-end">
                          {side === 'left' && (
                            <div className="w-full max-w-lg">
                              <TimelineItem
                                files={item.file}
                                caption={item.caption}
                                description={item.description}
                                side={side}
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex justify-center pt-3">
                          <div className="w-5 h-5 bg-white dark:bg-zinc-900 border-4 border-zinc-300 dark:border-zinc-700 rounded-full shadow-md" />
                        </div>

                        <div className="flex justify-start">
                          {side === 'right' && (
                            <div className="w-full max-w-lg">
                              <TimelineItem
                                files={item.file}
                                caption={item.caption}
                                description={item.description}
                                side={side}
                              />
                            </div>
                          )}
                        </div>
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